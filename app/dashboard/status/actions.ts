"use server";

import { revalidatePath } from "next/cache";
import type { SaveState } from "@/app/dashboard/actions";
import { notify } from "@/lib/status/alerts";
import { requireAdmin } from "@/lib/session";

export type TestState = SaveState & { results?: { channel: string; ok: boolean; error?: string }[] };

// Schickt über alle eingerichteten Kanäle eine Testmeldung.
export async function sendTestAlert(): Promise<TestState> {
  await requireAdmin();
  const results = await notify({ service: "test", event: "test" }, "Test");
  if (!results.length) return { error: "Noch kein Kanal eingerichtet. Siehe Anleitung unten." };
  return { ok: results.every((r) => r.ok), results, at: Date.now() };
}

// Hinweis zu einer Störung, erscheint öffentlich auf /status
export async function saveIncidentNote(_prev: SaveState, form: FormData): Promise<SaveState> {
  const { supabase } = await requireAdmin();
  const id = Number(form.get("id"));
  const note = String(form.get("note") ?? "").trim().slice(0, 500);
  const { error } = await supabase.from("status_incidents").update({ note }).eq("id", id);
  if (error) return { error: `Speichern fehlgeschlagen: ${error.message}` };
  revalidatePath("/status");
  revalidatePath("/dashboard/status");
  return { ok: true, at: Date.now() };
}
