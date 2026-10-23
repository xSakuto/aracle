import Markdown, { Inline } from "@/components/news/Markdown";
import { templateOf, topicOf, type NewsPost } from "@/data/news";

const date = new Intl.DateTimeFormat("de-CH", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Zurich" });

export default function NewsFeed({ posts }: { posts: NewsPost[] }) {
  if (posts.length === 0) {
    return <p className="mt-16 text-muted md:mt-24">Noch keine News. Hier erscheint bald das Erste.</p>;
  }
  return (
    <ol className="mt-16 md:mt-24">
      {posts.map((p) => {
        const topic = topicOf(p.topic);
        return (
          <li key={p.id} id={p.id} className="grid gap-4 border-t border-line py-10 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-3">
              <p className="nums text-[0.8125rem] text-muted">{date.format(new Date(p.publishedAt))}</p>
              <p className="mt-2 flex items-center gap-2 text-[0.8125rem]">
                <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: topic.accent }} />
                {topic.label}
              </p>
              {p.template !== "update" && (
                <p className="mt-1 text-[0.8125rem] text-muted">{templateOf(p.template).label}</p>
              )}
            </div>

            <article className="min-w-0 md:col-span-9 md:max-w-[46rem]">
              <h2 className="font-sans text-2xl font-medium leading-snug tracking-[-0.02em]">
                <Inline text={p.title} />
              </h2>
              {p.body && <Markdown text={p.body} />}
              {p.signature && (
                <p className="mt-6 text-ink/85">
                  Cheers,
                  <br />
                  <strong className="font-semibold">
                    <Inline text={p.signature} />
                  </strong>
                </p>
              )}
            </article>
          </li>
        );
      })}
    </ol>
  );
}
