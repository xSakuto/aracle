// Alarm bei Ausfällen. Jeder Kanal ist optional und wird über Umgebungsvariablen
// in Vercel eingeschaltet:
//
//   E-Mail (Resend, schon eingerichtet):   RESEND_API_KEY, STATUS_ALERT_EMAIL (mehrere mit Komma)
//   WhatsApp (CallMeBot, gratis):          CALLMEBOT_PHONE (+4179...), CALLMEBOT_APIKEY
//   Push aufs Handy (ntfy, gratis):        NTFY_TOPIC (z. B. aracle-status-xyz), optional NTFY_SERVER
//   Discord-Webhook (zusätzlich):          STATUS_DISCORD_WEBHOOK

export interface StatusEvent {
  service: string;
  event: "down" | "up" | "test";
  started_at?: string;
  resolved_at?: string;
  detail?: string;
}

const time = new Intl.DateTimeFormat("de-CH", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Zurich" });

export function duration(fromIso: string, toIso: string) {
  const min = Math.max(1, Math.round((new Date(toIso).getTime() - new Date(fromIso).getTime()) / 60000));
  if (min < 60) return `${min} Min.`;
  const h = Math.floor(min / 60);
  const rest = min % 60;
  if (h < 24) return rest ? `${h} Std. ${rest} Min.` : `${h} Std.`;
  const d = Math.floor(h / 24);
  return `${d} ${d === 1 ? "Tag" : "Tage"} ${h % 24} Std.`;
}

export function message(e: StatusEvent, name: string) {
  if (e.event === "test") {
    return { title: "Test-Alarm von aracle.ch", text: "Wenn du das liest, kommen Ausfall-Meldungen bei dir an.", priority: "default" };
  }
  if (e.event === "down") {
    return {
      title: `🔴 ${name} ist ausgefallen`,
      text: [
        `${name} antwortet seit ${e.started_at ? time.format(new Date(e.started_at)) : "eben"} nicht mehr.`,
        e.detail ? `Grund: ${e.detail}` : "",
        "Status: https://aracle.ch/status",
      ].filter(Boolean).join("\n"),
      priority: "urgent",
    };
  }
  return {
    title: `🟢 ${name} läuft wieder`,
    text: [
      `${name} ist wieder erreichbar.`,
      e.started_at && e.resolved_at ? `Ausfall: ${duration(e.started_at, e.resolved_at)}` : "",
      "Status: https://aracle.ch/status",
    ].filter(Boolean).join("\n"),
    priority: "default",
  };
}

type Sent = { channel: string; ok: boolean; error?: string };

async function email(title: string, text: string): Promise<Sent | null> {
  const key = process.env.RESEND_API_KEY;
  const to = (process.env.STATUS_ALERT_EMAIL ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!key || !to.length) return null;
  const from = process.env.STATUS_ALERT_FROM ?? process.env.INQUIRY_FROM ?? "Aracle Status <no-reply@aracle.ch>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject: title, text }),
  }).catch(() => null);
  return { channel: "E-Mail", ok: Boolean(res?.ok), error: res && !res.ok ? `Resend ${res.status}` : res ? undefined : "nicht erreichbar" };
}

async function whatsapp(title: string, text: string): Promise<Sent | null> {
  const phone = process.env.CALLMEBOT_PHONE;
  const key = process.env.CALLMEBOT_APIKEY;
  if (!phone || !key) return null;
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&apikey=${encodeURIComponent(key)}&text=${encodeURIComponent(`*${title}*\n${text}`)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) }).catch(() => null);
  return { channel: "WhatsApp", ok: Boolean(res?.ok), error: res && !res.ok ? `CallMeBot ${res.status}` : res ? undefined : "nicht erreichbar" };
}

async function ntfy(title: string, text: string, priority: string): Promise<Sent | null> {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) return null;
  const server = process.env.NTFY_SERVER ?? "https://ntfy.sh";
  const res = await fetch(`${server}/${encodeURIComponent(topic)}`, {
    method: "POST",
    body: text,
    headers: {
      // Header müssen ASCII sein, deshalb kodiert
      Title: `=?UTF-8?B?${Buffer.from(title).toString("base64")}?=`,
      Priority: priority === "urgent" ? "urgent" : "default",
      Tags: priority === "urgent" ? "rotating_light" : "white_check_mark",
      Click: "https://aracle.ch/status",
    },
  }).catch(() => null);
  return { channel: "Push", ok: Boolean(res?.ok), error: res && !res.ok ? `ntfy ${res.status}` : res ? undefined : "nicht erreichbar" };
}

async function discord(title: string, text: string): Promise<Sent | null> {
  const hook = process.env.STATUS_DISCORD_WEBHOOK;
  if (!hook) return null;
  const res = await fetch(hook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "Aracle Status", content: `**${title}**\n${text}` }),
  }).catch(() => null);
  return { channel: "Discord", ok: Boolean(res?.ok), error: res && !res.ok ? `Discord ${res.status}` : res ? undefined : "nicht erreichbar" };
}

/** Welche Kanäle eingerichtet sind (für das Dashboard, ohne Werte zu verraten). */
export function configuredChannels() {
  return {
    "E-Mail": Boolean(process.env.RESEND_API_KEY && process.env.STATUS_ALERT_EMAIL),
    WhatsApp: Boolean(process.env.CALLMEBOT_PHONE && process.env.CALLMEBOT_APIKEY),
    Push: Boolean(process.env.NTFY_TOPIC),
    Discord: Boolean(process.env.STATUS_DISCORD_WEBHOOK),
  };
}

export async function notify(e: StatusEvent, name: string): Promise<Sent[]> {
  const m = message(e, name);
  const results = await Promise.all([
    email(m.title, m.text),
    whatsapp(m.title, m.text),
    ntfy(m.title, m.text, m.priority),
    discord(m.title, m.text),
  ]);
  return results.filter((r): r is Sent => r !== null);
}
