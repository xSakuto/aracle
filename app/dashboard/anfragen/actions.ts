"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/session";

function refresh() {
  revalidatePath("/dashboard/anfragen");
}

// Auf eine Person ziehen: weist zu und schiebt die Anfrage in "In Bearbeitung".
export async function assignInquiry(id: string, assignedTo: string) {
  const { supabase } = await requirePermission("anfragen");
  if (!id || !assignedTo) return;
  await supabase.from("inquiries").update({ assigned_to: assignedTo, status: "in_bearbeitung" }).eq("id", id);
  refresh();
}

// Zurück in die Inbox: niemandem zugewiesen, wieder "neu".
export async function unassignInquiry(id: string) {
  const { supabase } = await requirePermission("anfragen");
  if (!id) return;
  await supabase.from("inquiries").update({ assigned_to: null, status: "neu" }).eq("id", id);
  refresh();
}

export async function archiveInquiry(id: string) {
  const { supabase } = await requirePermission("anfragen");
  if (!id) return;
  await supabase.from("inquiries").update({ status: "archiviert" }).eq("id", id);
  refresh();
}

// Aus dem Archiv zurück: mit Zuweisung in Bearbeitung, sonst in die Inbox.
export async function restoreInquiry(id: string, hadAssignee: boolean) {
  const { supabase } = await requirePermission("anfragen");
  if (!id) return;
  await supabase.from("inquiries").update({ status: hadAssignee ? "in_bearbeitung" : "neu" }).eq("id", id);
  refresh();
}

export async function updateInquiryNote(id: string, note: string) {
  const { supabase } = await requirePermission("anfragen");
  if (!id) return;
  await supabase.from("inquiries").update({ note: note.slice(0, 2000) }).eq("id", id);
  refresh();
}
