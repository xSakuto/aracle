"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SaveState } from "@/app/dashboard/actions";
import { asHttpsUrl, asTemplate, asTopic, defaultSignature } from "@/data/news";
import { getDiscordEmojis } from "@/lib/discord-emojis";
import { convertShortcodes } from "@/lib/emoji";
import { requireAdmin } from "@/lib/session";
import { zurichLocalToIso } from "@/lib/zurich-time";

function text(form: FormData, key: string, max: number) {
  return String(form.get(key) ?? "").trim().slice(0, max);
}

function refresh() {
  revalidatePath("/news");
  revalidatePath("/api/news");
  revalidatePath("/dashboard/news");
}

const TABLE_MISSING =
  "Die Tabelle für News gibt es noch nicht. Führ supabase/2026-10-news.sql und 2026-10-news-v2.sql im Supabase SQL-Editor aus.";

function dbError(err: { code?: string; message: string }) {
  if (err.code === "42P01" || err.code === "PGRST205" || err.code === "42703" || /news_posts/.test(err.message) && /does not exist|schema cache/i.test(err.message)) {
    return TABLE_MISSING;
  }
  return `Speichern fehlgeschlagen: ${err.message}`;
}

export async function saveNews(_prev: SaveState, form: FormData): Promise<SaveState> {
  const { supabase, me } = await requireAdmin();
  const id = text(form, "id", 64);

  // Kürzel wie :tools: und Server-Emojis werden hier zu dem, was Discord anzeigt.
  const emojis = await getDiscordEmojis(supabase);
  const convert = (s: string) => convertShortcodes(s, emojis);

  const title = convert(text(form, "title", 600));
  const body = convert(text(form, "body", 8000));

  // Die Signatur ändert nur die Leitung. Alle anderen bekommen immer ihre eigene, egal was das Formular schickt.
  let signature: string;
  if (me.is_lead) {
    signature = convert(text(form, "signature", 160));
  } else if (id) {
    const { data: current } = await supabase.from("news_posts").select("signature").eq("id", id).maybeSingle();
    signature = current?.signature ?? "";
  } else {
    signature = defaultSignature(me.slug, me.name, me.is_lead);
  }
  if (title.length < 3) return { error: "Der Titel braucht mindestens 3 Zeichen." };
  if (title.length > 300) return { error: "Der Titel ist zu lang (höchstens 300 Zeichen, Emojis zählen mit)." };
  if (body.length > 4000) return { error: `Der Text ist zu lang: ${body.length} von 4000 Zeichen (Emojis zählen mit).` };
  if (signature.length > 80) return { error: "Die Signatur ist zu lang." };

  const fields = {
    topic: asTopic(form.get("topic")),
    template: asTemplate(form.get("template")),
    title,
    body,
    signature: signature || null,
    use_embed: form.get("use_embed") === "on",
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
