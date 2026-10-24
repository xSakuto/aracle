"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/session";
import type { FullProfile } from "@/lib/session";

function refresh() {
  revalidatePath("/dashboard/anfragen");
}

async function logEvent(
  supabase: Awaited<ReturnType<typeof requirePermission>>["supabase"],
  me: FullProfile,
  inquiryId: string,
  action: "zugewiesen" | "in_inbox" | "archiviert" | "wiederhergestellt" | "notiz",
  detail = "",
) {
  await supabase.from("inquiry_events").insert({ inquiry_id: inquiryId, actor_id: me.id, actor_name: me.name, action, detail });
}

// Auf eine Person ziehen: weist zu und schiebt die Anfrage in "In Bearbeitung".
export async function assignInquiry(id: string, assignedTo: string) {
  const { supabase, me } = await requirePermission("anfragen");
  if (!id || !assignedTo) return;
  await supabase.from("inquiries").update({ assigned_to: assignedTo, status: "in_bearbeitung" }).eq("id", id);
  const { data: person } = await supabase.from("profiles").select("name").eq("id", assignedTo).maybeSingle();
  await logEvent(supabase, me, id, "zugewiesen", person?.name ?? "");
  refresh();
}

// Zurück in die Inbox: niemandem zugewiesen, wieder "neu".
export async function unassignInquiry(id: string) {
  const { supabase, me } = await requirePermission("anfragen");
  if (!id) return;
  await supabase.from("inquiries").update({ assigned_to: null, status: "neu" }).eq("id", id);
  await logEvent(supabase, me, id, "in_inbox");
  refresh();
}

export async function archiveInquiry(id: string) {
  const { supabase, me } = await requirePermission("anfragen");
  if (!id) return;
  await supabase.from("inquiries").update({ status: "archiviert" }).eq("id", id);
  await logEvent(supabase, me, id, "archiviert");
  refresh();
}

// Aus dem Archiv zurück: mit Zuweisung in Bearbeitung, sonst in die Inbox.
export async function restoreInquiry(id: string, hadAssignee: boolean) {
  const { supabase, me } = await requirePermission("anfragen");
  if (!id) return;
  await supabase.from("inquiries").update({ status: hadAssignee ? "in_bearbeitung" : "neu" }).eq("id", id);
  await logEvent(supabase, me, id, "wiederhergestellt");
  refresh();
}

export async function updateInquiryNote(id: string, note: string) {
  const { supabase, me } = await requirePermission("anfragen");
  if (!id) return;
  await supabase.from("inquiries").update({ note: note.slice(0, 2000) }).eq("id", id);
  await logEvent(supabase, me, id, "notiz");
  refresh();
}
