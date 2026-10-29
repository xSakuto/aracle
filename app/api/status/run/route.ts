import { revalidatePath } from "next/cache";
import { FAILS_BEFORE_ALERT, SERVICES } from "@/data/status";
import { notify, type StatusEvent } from "@/lib/status/alerts";
import { runChecks } from "@/lib/status/checks";
import { supabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/server";

// Wird jede Minute von Supabase (pg_cron) aufgerufen, siehe supabase/2026-10-status.sql.
// Prüft alle Dienste, speichert das Ergebnis und verschickt Alarme bei Ausfall und Erholung.
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: Request) {
  const secret = req.headers.get("x-status-secret") ?? "";
  if (!supabaseConfigured || secret.length < 32) return new Response("forbidden", { status: 403 });

  const db = createPublicClient();
  // Geheimnis zuerst prüfen, damit Fremde keine Prüfungen auslösen können
  const { data: valid } = await db.rpc("status_secret_ok", { p_secret: secret });
  if (!valid) return new Response("forbidden", { status: 403 });

  const { data: botSecret } = await db.rpc("status_bot_secret", { p_secret: secret });
  const results = await runChecks(SERVICES, (botSecret as string | null) ?? null);

  const { data: events, error } = await db.rpc("record_status_run", {
    p_secret: secret,
    p_results: results,
    p_fails: FAILS_BEFORE_ALERT,
  });
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const changes = (events ?? []) as StatusEvent[];
  const sent = await Promise.all(
    changes.map(async (e) => ({
      ...e,
      sent: await notify(e, SERVICES.find((s) => s.id === e.service)?.name ?? e.service),
    })),
  );
  if (changes.length) revalidatePath("/status");

  return Response.json({ checked: results.length, down: results.filter((r) => !r.ok).map((r) => r.service), events: sent });
}
