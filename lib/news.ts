import { asTemplate, type NewsPost } from "@/data/news";
import { supabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/server";

// Der Autor kommt über author_id aus dem Teamprofil (öffentlich lesbar: Name und Slug).
export const NEWS_COLUMNS =
  "id, topic, template, title, body, signature, use_embed, image_url, published, publish_at, created_at, author:profiles(name, slug)";

export type NewsRow = {
  id: string;
  topic: string;
  template: string;
  title: string;
  body: string;
  signature: string | null;
  use_embed: boolean;
  image_url: string | null;
  published: boolean;
  publish_at: string;
  created_at: string;
  author: { name: string; slug: string } | null;
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
    imageUrl: r.image_url,
    author: r.author ?? null,
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
    return (data as unknown as NewsRow[]).map(rowToPost);
  } catch (err) {
    console.error("News aus Supabase nicht ladbar:", err);
    return [];
  }
}
