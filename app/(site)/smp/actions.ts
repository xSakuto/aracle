"use server";

import { headers } from "next/headers";
import { supabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/server";

export type ApplyField = "ign" | "discord" | "email" | "why";

export type ApplyState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<ApplyField, string>>; values: Record<string, string> }
  | { status: "sent"; ign: string }
  | { status: "unavailable"; mailto: string; values: Record<string, string> };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Minecraft-Namen: 3 bis 16 Zeichen, Buchstaben, Ziffern und Unterstrich
const IGN = /^[A-Za-z0-9_]{3,16}$/;

const recent = new Map<string, number[]>();
function throttled(ip: string) {
  const now = Date.now();
  const list = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  list.push(now);
  recent.set(ip, list);
  return list.length > 3;
}

function body(v: Record<string, string>) {
  return [`Minecraft-Name: ${v.ign}`, `Discord: ${v.discord || "Keine Angabe"}`, "", v.why].join("\n");
}

async function notify(v: Record<string, string>) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO;
  const from = process.env.INQUIRY_FROM;
  if (!key || !to || !from) return null;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: v.email,
      subject: `AracleSMP-Bewerbung von ${v.ign}`,
      text: [`Neue Bewerbung für AracleSMP über aracle.ch`, "", `E-Mail: ${v.email}`, body(v)].join("\n"),
    }),
  });
  return res.ok;
}

export async function applySmp(_prev: ApplyState, form: FormData): Promise<ApplyState> {
  const get = (k: string, max: number) => String(form.get(k) ?? "").trim().slice(0, max);
  const v: Record<string, string> = {
    ign: get("ign", 16),
    discord: get("discord", 40),
    email: get("email", 200).toLowerCase(),
    why: get("why", 1500),
  };

  const errors: Partial<Record<ApplyField, string>> = {};
  if (!IGN.test(v.ign)) errors.ign = "Dein Minecraft-Name hat 3 bis 16 Zeichen: Buchstaben, Ziffern oder _.";
  if (!EMAIL.test(v.email)) errors.email = "Bitte gib eine gültige E-Mail-Adresse an, damit wir antworten können.";
  if (v.why.length < 20) errors.why = "Erzähl uns in ein, zwei Sätzen, warum du mitspielen willst (mindestens 20 Zeichen).";
  if (Object.keys(errors).length) return { status: "invalid", errors, values: v };

  const trap = String(form.get("website") ?? "");
  const started = Number(form.get("t") ?? 0);
  if (trap || (started && Date.now() - started < 3000)) {
    return { status: "invalid", errors: { why: "Bitte versuche es in ein paar Sekunden erneut." }, values: v };
  }
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (throttled(ip)) {
    return { status: "invalid", errors: { why: "Zu viele Bewerbungen in kurzer Zeit. Bitte versuche es später erneut." }, values: v };
  }

  let stored: boolean | null = null;
  if (supabaseConfigured) {
    const db = createPublicClient();
    const row = { name: v.ign, email: v.email, company: null, description: body(v) };
    let { error } = await db.from("inquiries").insert({ ...row, project_type: "smp" });
    // Ohne Datenbank-Update (supabase/2026-10-profile-quote.sql) kennt die Tabelle "smp" noch nicht.
    if (error && /check constraint|violates/i.test(error.message)) {
      ({ error } = await db.from("inquiries").insert({ ...row, project_type: "other", description: `[AracleSMP]\n${row.description}` }));
    }
    stored = !error;
    if (error) console.error("Bewerbung nicht gespeichert:", error.message);
  }

  let mailed: boolean | null = null;
  try {
    mailed = await notify(v);
  } catch (err) {
    console.error("Benachrichtigung fehlgeschlagen:", err);
    mailed = false;
  }

  if (stored || mailed) return { status: "sent", ign: v.ign };
  const mailto = `mailto:info@aracle.ch?subject=${encodeURIComponent(`AracleSMP-Bewerbung: ${v.ign}`)}&body=${encodeURIComponent(body(v))}`;
  return { status: "unavailable", mailto, values: v };
}
