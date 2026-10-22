"use server";

import { headers } from "next/headers";
import { BUDGETS, PROJECT_TYPES, budgetLabel, typeLabel } from "@/data/inquiry";
import { supabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/server";

export type InquiryField = "name" | "email" | "company" | "type" | "description" | "budget";

export type InquiryState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<InquiryField, string>>; values: Record<string, string> }
  | { status: "sent"; name: string }
  /** Kein Versandweg eingerichtet oder alle Wege fehlgeschlagen: ehrlich melden, Mail anbieten */
  | { status: "unavailable"; reason: string; mailto: string; values: Record<string, string> };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Einfache Drosselung pro Server-Instanz gegen Massenversand
const recent = new Map<string, number[]>();
function throttled(ip: string) {
  const now = Date.now();
  const list = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  list.push(now);
  recent.set(ip, list);
  return list.length > 5;
}

function mailtoFor(v: Record<string, string>) {
  const body = [
    `Name: ${v.name}`,
    v.company ? `Unternehmen: ${v.company}` : "",
    `Projekttyp: ${typeLabel(v.type)}`,
    `Budget: ${budgetLabel(v.budget || null)}`,
    "",
    v.description,
  ]
    .filter((l) => l !== "")
    .join("\n");
  return `mailto:info@aracle.ch?subject=${encodeURIComponent(`Projektanfrage: ${typeLabel(v.type)}`)}&body=${encodeURIComponent(body)}`;
}

async function notifyByMail(v: Record<string, string>) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO;
  const from = process.env.INQUIRY_FROM;
  if (!key || !to || !from) return null; // nicht eingerichtet
  const text = [
    `Neue Projektanfrage über aracle.ch`,
    ``,
    `Name: ${v.name}`,
    `E-Mail: ${v.email}`,
    `Unternehmen: ${v.company || "Keine Angabe"}`,
    `Projekttyp: ${typeLabel(v.type)}`,
    `Budget: ${budgetLabel(v.budget || null)}`,
    ``,
    v.description,
  ].join("\n");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: v.email,
      subject: `Projektanfrage: ${typeLabel(v.type)} von ${v.name}`,
      text,
    }),
  });
  return res.ok;
}

export async function sendInquiry(_prev: InquiryState, form: FormData): Promise<InquiryState> {
  const get = (k: string, max: number) => String(form.get(k) ?? "").trim().slice(0, max);
  const v: Record<string, string> = {
    name: get("name", 120),
    email: get("email", 200).toLowerCase(),
    company: get("company", 160),
    type: get("type", 20),
    description: get("description", 4000),
    budget: get("budget", 20),
  };

  const errors: Partial<Record<InquiryField, string>> = {};
  if (v.name.length < 2) errors.name = "Bitte gib deinen Namen an.";
  if (!EMAIL.test(v.email)) errors.email = "Bitte gib eine gültige E-Mail-Adresse an, damit wir antworten können.";
  if (!PROJECT_TYPES.some((t) => t.key === v.type)) errors.type = "Bitte wähle, worum es geht.";
  if (v.description.length < 20) errors.description = "Beschreib dein Projekt in ein, zwei Sätzen (mindestens 20 Zeichen).";
  else if ((v.description.match(/https?:\/\//g) ?? []).length > 3) errors.description = "Bitte höchstens drei Links.";
  if (v.budget && !BUDGETS.some((b) => b.key === v.budget)) errors.budget = "Bitte wähle einen Budgetrahmen aus der Liste.";
  if (Object.keys(errors).length) return { status: "invalid", errors, values: v };

  // Spam: verstecktes Feld muss leer bleiben, Formular nicht schneller als 3 s ausgefüllt.
  // Erst nach der Validierung, damit Menschen zuerst echte Feldfehler sehen.
  const trap = String(form.get("website") ?? "");
  const started = Number(form.get("t") ?? 0);
  if (trap || (started && Date.now() - started < 3000)) {
    return { status: "invalid", errors: { description: "Bitte versuche es in ein paar Sekunden erneut." }, values: v };
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (throttled(ip)) {
    return { status: "invalid", errors: { description: "Zu viele Anfragen in kurzer Zeit. Bitte versuche es später erneut." }, values: v };
  }

  // Zustellung: Datenbank und/oder Mail. Erfolg nur, wenn mindestens ein Weg geklappt hat.
  let stored: boolean | null = null;
  if (supabaseConfigured) {
    const { error } = await createPublicClient()
      .from("inquiries")
      .insert({
        name: v.name,
        email: v.email,
        company: v.company || null,
        project_type: v.type,
        description: v.description,
        budget: v.budget || null,
      });
    stored = !error;
    if (error) console.error("Anfrage nicht gespeichert:", error.message);
  }

  let mailed: boolean | null = null;
  try {
    mailed = await notifyByMail(v);
  } catch (err) {
    console.error("Benachrichtigung fehlgeschlagen:", err);
    mailed = false;
  }

  if (stored || mailed) return { status: "sent", name: v.name.split(" ")[0] };

  const reason =
    stored === null && mailed === null
      ? "Das Formular ist noch nicht mit unserem Postfach verbunden."
      : "Die Anfrage konnte gerade nicht übermittelt werden.";
  return { status: "unavailable", reason, mailto: mailtoFor(v), values: v };
}
