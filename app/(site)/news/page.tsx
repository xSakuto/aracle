import NewsFeed from "@/components/news/NewsFeed";
import { getPublishedNews } from "@/lib/news";

export const revalidate = 60;

export const metadata = {
  alternates: { canonical: "/news" },
  title: "News",
  description: "Neuigkeiten, Updates und neue Videos aus allen Aracle-Projekten.",
};

export default async function NewsPage() {
  const posts = await getPublishedNews();

  return (
    <div className="wrap pb-[var(--section)] pt-28 md:pt-36">
      <div className="inner">
        {/* Der Titel braucht die volle Breite: in einer schmaleren Spalte wird der Schlusspunkt abgeschnitten. */}
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-12">
            <p className="kicker text-aqua" data-rise>News</p>
            <h1 className="mega mt-5" data-split="load">Neuigkeiten.</h1>
          </div>
          <p className="text-ink/80 md:col-span-6 lg:col-span-5" data-rise style={{ ["--i" as string]: 2 }}>
            Updates, Status und neue Videos aus allen Projekten, an einem Ort.
          </p>
        </div>
        <NewsFeed posts={posts} />
      </div>
    </div>
  );
}
