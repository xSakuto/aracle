import Link from "next/link";
import { templateOf, topicOf } from "@/data/news";
import { NEWS_COLUMNS, type NewsRow } from "@/lib/news";
import { requireAdmin } from "@/lib/session";

const fmt = new Intl.DateTimeFormat("de-CH", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Zurich" });

function state(r: NewsRow) {
  if (!r.published) return { label: "Entwurf", tone: "text-muted" };
  if (new Date(r.publish_at).getTime() > Date.now()) return { label: "Geplant", tone: "text-[#d9a441]" };
  return { label: "Veröffentlicht", tone: "text-aqua" };
}

export default async function NewsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ geloescht?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { geloescht } = await searchParams;
  const { data, error } = await supabase
    .from("news_posts")
    .select(NEWS_COLUMNS)
    .order("publish_at", { ascending: false })
    .limit(100);
  const rows = (data ?? []) as unknown as NewsRow[];
  const missing = error && (error.code === "42P01" || error.code === "PGRST205" || /news_posts/.test(error.message));

  return (
    <div className="max-w-[72rem]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-medium tracking-normal">News</h1>
          <p className="mt-1 text-muted">
            Beiträge erscheinen auf /news und werden vom Discord-Bot automatisch gepostet.
          </p>
        </div>
        <Link href="/dashboard/news/neu" className="dash-btn">Neue News</Link>
      </div>

      {geloescht && <p className="mt-4 text-sm text-muted">Beitrag gelöscht.</p>}

      {missing ? (
        <div className="dash-panel mt-8">
          <p className="font-medium">Datenbank noch nicht vorbereitet</p>
          <p className="dash-help mt-1">
            Führ <code>supabase/2026-10-news.sql</code> einmal im Supabase SQL-Editor aus, dann geht es hier los.
          </p>
        </div>
      ) : error ? (
        <p role="alert" className="mt-4 text-sm text-danger">News konnten nicht geladen werden: {error.message}</p>
      ) : rows.length === 0 ? (
        <div className="dash-panel mt-8">
          <p className="font-medium">Noch keine News</p>
          <p className="dash-help mt-1">Mit „Neue News“ schreibst du den ersten Beitrag.</p>
        </div>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {rows.map((r) => {
            const s = state(r);
            const topic = topicOf(r.topic);
            return (
              <li key={r.id}>
                <Link
                  href={`/dashboard/news/${r.id}`}
                  className="dash-panel flex flex-wrap items-center justify-between gap-3 transition-colors hover:bg-[#161f25]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.title}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                      <span className="flex items-center gap-1.5">
                        <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: topic.accent }} />
                        {topic.label}
                      </span>
                      <span>{templateOf(r.template).label}</span>
                      <span className="nums">{fmt.format(new Date(r.publish_at))}</span>
                    </p>
                  </div>
                  <span className={`text-xs ${s.tone}`}>{s.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
