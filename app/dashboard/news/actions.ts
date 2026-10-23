"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SaveState } from "@/app/dashboard/actions";
import { asHttpsUrl, asTemplate, asTopic, cleanItems, cleanLinks } from "@/data/news";
import { requireAdmin } from "@/lib/session";
import { zurichLocalToIso } from "@/lib/zurich-time";

function text(form: FormData, key: string, max: number) {
  return String(form.get(key) ?? "").trim().slice(0, max);
}

function parseJson(form: FormData, key: string): unknown {
  try {
    return JSON.parse(String(form.get(key) ?? "[]"));
  } catch {
    return [];
  }
}

function refresh() {
  revalidatePath("/news");
  revalidatePath("/api/news");
  revalidatePath("/dashboard/news");
}

const TABLE_MISSING =
  "Die Tabelle für News gibt es noch nicht. Führ supabase/2026-10-news.sql im Supabase SQL-Editor aus.";

function dbError(err: { code?: string; message: string }) {
  if (err.code === "42P01" || err.code === "PGRST205" || /news_posts/.test(err.message) && /does not exist|schema cache/i.test(err.message)) {
    return TABLE_MISSING;
  }
  return `Speichern fehlgeschlagen: ${err.message}`;
}

export async function saveNews(_prev: SaveState, form: FormData): Promise<SaveState> {
  const { supabase, me } = await requireAdmin();
  const id = text(form, "id", 64);
  const title = text(form, "title", 140);
  if (title.length < 3) return { error: "Der Titel braucht mindestens 3 Zeichen." };

  const template = asTemplate(form.get("template"));
  const fields = {
    topic: asTopic(form.get("topic")),
    template,
    title,
    body: text(form, "body", 4000),
    items: template === "changelog" ? cleanItems(parseJson(form, "items")) : [],
    links: cleanLinks(parseJson(form, "links")),
    image_url: asHttpsUrl(form.get("image_url")),
    published: form.get("published") === "on",
    publish_at: zurichLocalToIso(text(form, "publish_at", 16)) ?? new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase.from("news_posts").update(fields).eq("id", id);
    if (error) return { error: dbError(error) };
    refresh();
    return { ok: true, at: Date.now() };
  }

  const { data, error } = await supabase
    .from("news_posts")
    .insert({ ...fields, author_id: me.id })
    .select("id")
    .single();
  if (error) return { error: dbError(error) };
  refresh();
  redirect(`/dashboard/news/${data.id}?neu=1`);
}

export async function deleteNews(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(form, "id", 64);
  if (id) await supabase.from("news_posts").delete().eq("id", id);
  refresh();
  redirect("/dashboard/news?geloescht=1");
}
