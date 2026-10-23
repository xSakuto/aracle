import { asTemplate, type NewsPost } from "@/data/news";
import { supabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/server";

export const NEWS_COLUMNS =
  "id, topic, template, title, body, signature, use_embed, published, publish_at, created_at";

export type NewsRow = {
  id: string;
  topic: string;
  template: string;
  title: string;
  body: string;
  signature: string | null;
  use_embed: boolean;
  published: boolean;
  publish_at: string;
  created_at: string;
};

export function rowToPost(r: NewsRow): NewsPost {
  return {
    id: r.id,
    topic: r.topic,
    template: asTemplate(r.template),
    title: r.title,
    body: r.body,
    signature: r.signature ?? "",
    useEmbed: r.use_embed,
    publishedAt: r.publish_at,
  };
}

// Öffentliche News, neueste zuerst. Ohne Datenbank oder Tabelle bleibt die Liste leer.
export async function getPublishedNews(limit = 50): Promise<NewsPost[]> {
  if (!supabaseConfigured) return [];
  try {
    const { data, error } = await createPublicClient()
      .from("news_posts")
      .select(NEWS_COLUMNS)
      .eq("published", true)
      .lte("publish_at", new Date().toISOString())
      .order("publish_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data as NewsRow[]).map(rowToPost);
  } catch (err) {
    console.error("News aus Supabase nicht ladbar:", err);
    return [];
  }
}
