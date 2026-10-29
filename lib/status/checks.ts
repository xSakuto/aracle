import { createHash, createHmac } from "node:crypto";
import type { Service } from "@/data/status";

export interface CheckResult {
  service: string;
  ok: boolean;
  latency_ms: number | null;
  detail: string;
}

const TIMEOUT = 10_000;
const UA = "AracleStatus/1.0 (+https://aracle.ch/status)";

async function timed<T>(fn: () => Promise<T>) {
  const t0 = performance.now();
  const value = await fn();
  return { value, ms: Math.round(performance.now() - t0) };
}

// Cloudflare-Fehler, wenn der Tunnel zum Heimserver weg ist
const TUNNEL_DOWN: Record<number, string> = {
  502: "Tunnel erreicht den Server nicht (502)",
  503: "Dienst nicht verfügbar (503)",
  504: "Zeitüberschreitung am Tunnel (504)",
  521: "Server antwortet nicht (521)",
  522: "Verbindung zum Server abgebrochen (522)",
  523: "Server nicht erreichbar (523)",
  524: "Server antwortet zu langsam (524)",
  530: "Cloudflare-Tunnel offline (530)",
};

async function checkHttp(s: Service & { check: { type: "http" } }): Promise<CheckResult> {
  try {
    const { value: res, ms } = await timed(() =>
      fetch(s.check.url, { redirect: "follow", cache: "no-store", signal: AbortSignal.timeout(TIMEOUT), headers: { "User-Agent": UA } }),
    );
    if (!res.ok) return { service: s.id, ok: false, latency_ms: ms, detail: TUNNEL_DOWN[res.status] ?? `Antwort ${res.status}` };
    if (s.check.contains) {
      const body = await res.text();
      if (!body.includes(s.check.contains)) return { service: s.id, ok: false, latency_ms: ms, detail: "Seite lädt, aber Inhalt fehlt" };
    }
    return { service: s.id, ok: true, latency_ms: ms, detail: "" };
  } catch (err) {
    return { service: s.id, ok: false, latency_ms: null, detail: describe(err) };
  }
}

// Der Bot prüft mit derselben Signatur wie das Dashboard. Ohne Geheimnis reicht
// schon, dass der Bot überhaupt antwortet (401 heisst: Prozess läuft).
async function checkBot(s: Service & { check: { type: "bot" } }, botSecret: string | null): Promise<CheckResult> {
  const url = new URL(s.check.url);
  const headers: Record<string, string> = { "User-Agent": UA };
  if (botSecret) {
    const ts = String(Math.floor(Date.now() / 1000));
    const bodyHash = createHash("sha256").update("").digest("hex");
    headers["X-Site-Ts"] = ts;
    headers["X-Site-Sig"] = createHmac("sha256", botSecret).update(`${ts}\nGET\n${url.pathname}${url.search}\n${bodyHash}`).digest("hex");
    headers["X-Site-User"] = "status-monitor";
  }
  try {
    const { value: res, ms } = await timed(() => fetch(url, { cache: "no-store", signal: AbortSignal.timeout(TIMEOUT), headers }));
    if (TUNNEL_DOWN[res.status]) return { service: s.id, ok: false, latency_ms: ms, detail: TUNNEL_DOWN[res.status] };
    if (!botSecret) {
      const alive = res.ok || res.status === 401 || res.status === 403;
      return { service: s.id, ok: alive, latency_ms: ms, detail: alive ? "" : `Antwort ${res.status}` };
    }
    if (!res.ok) return { service: s.id, ok: false, latency_ms: ms, detail: `Bot antwortet mit ${res.status}` };
    const json = (await res.json().catch(() => null)) as { ok?: boolean; guilds?: unknown[] } | null;
    if (!json?.ok) return { service: s.id, ok: false, latency_ms: ms, detail: "Bot meldet einen Fehler (nicht mit Discord verbunden?)" };
    return { service: s.id, ok: true, latency_ms: ms, detail: Array.isArray(json.guilds) ? `${json.guilds.length} Server` : "" };
  } catch (err) {
    return { service: s.id, ok: false, latency_ms: null, detail: describe(err) };
  }
}

type McStatus = { online?: boolean; players?: { online?: number; max?: number }; version?: string; debug?: { ping?: boolean } };

async function checkMinecraft(s: Service & { check: { type: "minecraft" } }): Promise<CheckResult> {
  try {
    const { value: res, ms } = await timed(() =>
      fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(s.check.host)}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(TIMEOUT),
        headers: { "User-Agent": UA },
      }),
    );
    // Fällt die Abfrage selbst aus, ist das kein Ausfall des Servers
    if (!res.ok) return { service: s.id, ok: true, latency_ms: null, detail: "Abfrage nicht möglich, Status unbekannt" };
    const j = (await res.json()) as McStatus;
    if (!j.online) return { service: s.id, ok: false, latency_ms: ms, detail: "Server offline" };
    const players = j.players ? `${j.players.online ?? 0} von ${j.players.max ?? "?"} online` : "";
    return { service: s.id, ok: true, latency_ms: null, detail: players };
  } catch (err) {
    return { service: s.id, ok: true, latency_ms: null, detail: `Abfrage nicht möglich (${describe(err)})` };
  }
}

function describe(err: unknown) {
  const e = err as { name?: string; cause?: { code?: string } ; message?: string };
  if (e?.name === "TimeoutError" || e?.name === "AbortError") return "Keine Antwort innert 10 Sekunden";
  const code = e?.cause?.code;
  if (code === "ENOTFOUND") return "Adresse nicht gefunden (DNS)";
  if (code === "ECONNREFUSED") return "Verbindung abgelehnt";
  if (code === "ECONNRESET") return "Verbindung abgebrochen";
  if (code?.startsWith("CERT") || code?.includes("TLS")) return "Zertifikatsproblem";
  return (e?.message ?? "Unbekannter Fehler").slice(0, 120);
}

export async function runChecks(services: Service[], botSecret: string | null): Promise<CheckResult[]> {
  return Promise.all(
    services.map((s) => {
      switch (s.check.type) {
        case "http":
          return checkHttp(s as Service & { check: { type: "http" } });
        case "bot":
          return checkBot(s as Service & { check: { type: "bot" } }, botSecret);
        case "minecraft":
          return checkMinecraft(s as Service & { check: { type: "minecraft" } });
      }
    }),
  );
}
