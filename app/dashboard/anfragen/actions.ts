"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";

const STATES = ["neu", "in_bearbeitung", "erledigt"];

export async function setInquiryStatus(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "");
  if (!id || !STATES.includes(status)) return;
  await supabase.from("inquiries").update({ status }).eq("id", id);
  revalidatePath("/dashboard/anfragen");
}
