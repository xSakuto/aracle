"use server";

import { redirect } from "next/navigation";
import { botFetch } from "@/lib/bot-api";
import { requirePermission } from "@/lib/session";

type Result = { ok: string } | { fehler: string };

const ID = /^\d{1,20}$/;

function field(form: FormData, key: string, max = 200) {
  return String(form.get(key) ?? "").trim().slice(0, max);
}

function needId(form: FormData, key: string) {
  const v = field(form, key, 24);
  return ID.test(v) ? v : null;
}

async function call(path: string, payload: Record<string, unknown>): Promise<Result> {
  const { user } = await requirePermission("bot");
  try {
    const res = await botFetch<{ message: string }>(path, {
      method: "POST",
      body: payload,
      user: user.email ?? user.id,
    });
    return { ok: res.message };
  } catch (err) {
    return { fehler: err instanceof Error ? err.message : "Unbekannter Fehler" };
  }
}

function back(url: string, r: Result): never {
  const q = "ok" in r ? `ok=${encodeURIComponent(r.ok)}` : `fehler=${encodeURIComponent(r.fehler)}`;
  redirect(`${url}${url.includes("?") ? "&" : "?"}${q}`);
}

// ── Übersicht ─────────────────────────────────────────────────────────────────

export async function syncRanks(form: FormData) {
  const g = needId(form, "g");
  if (!g) return back("/dashboard/bot", { fehler: "Server fehlt." });
  back(`/dashboard/bot?g=${g}`, await call("/api/site/action/syncranks", { g }));
}

export async function resetGame(form: FormData) {
  const g = needId(form, "g");
  if (!g) return back("/dashboard/bot", { fehler: "Server fehlt." });
  back(`/dashboard/bot?g=${g}`, await call("/api/site/action/resetgame", { g, game: field(form, "game", 20) }));
}

// ── Mitglied ──────────────────────────────────────────────────────────────────

function memberBack(form: FormData) {
  const g = needId(form, "g");
  const u = needId(form, "u");
  if (!g || !u) back("/dashboard/bot/mitglieder", { fehler: "Angaben fehlen." });
  return { g: g as string, u: u as string, url: `/dashboard/bot/mitglieder/${u}?g=${g}` };
}

export async function setMemberXp(form: FormData) {
  const { g, u, url } = memberBack(form);
  const mode = field(form, "mode", 8);
  const value = field(form, "value", 12);
  if (value === "") return back(url, { fehler: "Kein Wert angegeben." });
  back(url, await call("/api/site/member/xp", { g, u, [mode === "add" ? "addxp" : "setxp"]: value }));
}

export async function setMemberVoice(form: FormData) {
  const { g, u, url } = memberBack(form);
  back(url, await call("/api/site/member/voice", { g, u, hours: field(form, "hours", 10) }));
}

export async function setMemberRank(form: FormData) {
  const { g, u, url } = memberBack(form);
  back(url, await call("/api/site/member/setrank", { g, u, role_id: field(form, "role_id", 24) }));
}

export async function memberRole(form: FormData) {
  const { g, u, url } = memberBack(form);
  const op = field(form, "op", 8) === "remove" ? "remove" : "add";
  back(url, await call("/api/site/member/role", { g, u, role_id: field(form, "role_id", 24), op }));
}

// ── Moderation ────────────────────────────────────────────────────────────────

export async function deleteTicket(form: FormData) {
  const g = needId(form, "g");
  const channel_id = needId(form, "channel_id");
  if (!g || !channel_id) return back("/dashboard/bot/moderation", { fehler: "Angaben fehlen." });
  back(`/dashboard/bot/moderation?g=${g}`, await call("/api/site/ticket/delete", { g, channel_id }));
}
