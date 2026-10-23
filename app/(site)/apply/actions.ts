"use server";

import { headers } from "next/headers";
import { APPLY_ROLES, roleLabel } from "@/data/apply";
import { supabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/server";

export type JoinField = "role" | "name" | "email" | "discord" | "about" | "links";

export type JoinState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<JoinField, string>>; values: Record<string, string> }
  | { status: "sent"; name: string }
  | { status: "unavailable"; mailto: string; values: Record<string, string> };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const recent = new Map<string, number[]>();
function throttled(ip: string) {
  const now = Date.now();
  const list = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  list.push(now);
  recent.set(ip, list);
  return list.length > 3;
}

function body(v: Record<string, string>) {
  return [
    `Bereich: ${roleLabel(v.role)}`,
    `Discord: ${v.discord || "Keine Angabe"}`,
    `Links: ${v.links || "Keine"}`,
    "",
    v.about,
  ].join("\n");
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
      subject: `Bewerbung ${roleLabel(v.role)} von ${v.name}`,
      text: [`Neue Bewerbung über aracle.ch/apply`, "", `Name: ${v.name}`, `E-Mail: ${v.email}`, body(v)].join("\n"),
    }),
  });
  return res.ok;
}

export async function applyTeam(_prev: JoinState, form: FormData): Promise<JoinState> {
  const get = (k: string, max: number) => String(form.get(k) ?? "").trim().slice(0, max);
  const v: Record<string, string> = {
    role: get("role", 20),
    name: get("name", 120),
    email: get("email", 200).toLowerCase(),
    discord: get("discord", 40),
    about: get("about", 2000),
    links: get("links", 400),
  };

  const errors: Partial<Record<JoinField, string>> = {};
  if (!APPLY_ROLES.some((r) => r.key === v.role)) errors.role = "Bitte wähle einen Bereich.";
  if (v.name.length < 2) errors.name = "Bitte gib deinen Namen an.";
  if (!EMAIL.test(v.email)) errors.email = "Bitte gib eine gültige E-Mail-Adresse an, damit wir antworten können.";
  if (v.about.length < 30) errors.about = "Erzähl uns in ein paar Sätzen, was du kannst und worauf du Lust hast (mindestens 30 Zeichen).";
  if ((v.links.match(/https?:\/\//g) ?? []).length > 5) errors.links = "Bitte höchstens fünf Links.";
  if (Object.keys(errors).length) return { status: "invalid", errors, values: v };

  const trap = String(form.get("website") ?? "");
  const started = Number(form.get("t") ?? 0);
  if (trap || (started && Date.now() - started < 3000)) {
    return { status: "invalid", errors: { about: "Bitte versuche es in ein paar Sekunden erneut." }, values: v };
  }
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (throttled(ip)) {
    return { status: "invalid", errors: { about: "Zu viele Bewerbungen in kurzer Zeit. Bitte versuche es später erneut." }, values: v };
  }

  let stored: boolean | null = null;
  if (supabaseConfigured) {
    const db = createPublicClient();
    const row = { name: v.name, email: v.email, company: null, description: body(v) };
    let { error } = await db.from("inquiries").insert({ ...row, project_type: "apply" });
    // Ohne Datenbank-Update (supabase/2026-10-profile-quote.sql) kennt die Tabelle "apply" noch nicht.
    if (error && /check constraint|violates/i.test(error.message)) {
      ({ error } = await db.from("inquiries").insert({ ...row, project_type: "other", description: `[Bewerbung]\n${row.description}` }));
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

  if (stored || mailed) return { status: "sent", name: v.name.split(" ")[0] };
  const mailto = `mailto:info@aracle.ch?subject=${encodeURIComponent(`Bewerbung ${roleLabel(v.role)}: ${v.name}`)}&body=${encodeURIComponent(body(v))}`;
  return { status: "unavailable", mailto, values: v };
}
