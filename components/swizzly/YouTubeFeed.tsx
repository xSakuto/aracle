// Neueste Videos vom YouTube-Kanal, über den öffentlichen RSS-Feed von YouTube.
// Kein API-Schlüssel nötig. Wird alle 30 Minuten neu geholt.

type Video = { id: string; title: string; published: string };

function decode(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function loadVideos(channelId: string): Promise<Video[]> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    const xml = await res.text();
    const entries = xml.split("<entry>").slice(1, 7);
    return entries.map((e) => ({
      id: (e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) ?? [])[1] ?? "",
      title: decode((e.match(/<title>([^<]+)<\/title>/) ?? [])[1] ?? ""),
      published: (e.match(/<published>([^<]+)<\/published>/) ?? [])[1] ?? "",
    })).filter((v) => v.id);
  } catch {
    return [];
  }
}

export default async function YouTubeFeed({ channelId, handle, title = "Neueste Videos" }: { channelId: string; handle: string; title?: string }) {
  const videos = await loadVideos(channelId);
  if (videos.length === 0) return null;

  return (
    <section aria-labelledby="feed-title" className="wrap py-[var(--section)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="feed-title" className="head">{title}</h2>
        <a href={`https://www.youtube.com/${handle}`} target="_blank" rel="noopener noreferrer" className="link-under small">
          Alle auf YouTube <span aria-hidden>↗</span>
        </a>
      </div>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => (
          <li key={v.id}>
            <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" className="group block">
              <div className="overflow-hidden rounded-[var(--radius)] bg-[#0b1115]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                  alt=""
                  width={480}
                  height={360}
                  loading="lazy"
                  className="aspect-video w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-3 font-medium tracking-[-0.01em] group-hover:text-aqua">{v.title}</p>
              {v.published && (
                <p className="small mt-1 text-muted">
                  {new Date(v.published).toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric" })}
                </p>
              )}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
