import { SITE_URL } from "@/lib/site";
import { getPublishedNews } from "@/lib/news";

// Öffentlicher Feed für den Discord-Bot. Nur Veröffentlichtes, kurz zwischengespeichert.
export const revalidate = 60;

export async function GET() {
  const posts = await getPublishedNews(25);
  return Response.json(
    { posts: posts.map((p) => ({ ...p, url: `${SITE_URL}/news#${p.id}` })) },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
