import Link from "next/link";
import { notFound } from "next/navigation";
import NewsForm from "@/components/dashboard/NewsForm";
import { defaultSignature } from "@/data/news";
import { getDiscordEmojis } from "@/lib/discord-emojis";
import { NEWS_COLUMNS, rowToPost, type NewsRow } from "@/lib/news";
import { requireAdmin } from "@/lib/session";
import { isoToZurichLocal } from "@/lib/zurich-time";
import { deleteNews, saveNews } from "../actions";

export const metadata = { title: "News bearbeiten" };

export default async function EditNewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ neu?: string }>;
}) {
  const { supabase, me } = await requireAdmin();
  const { id } = await params;
  const { neu } = await searchParams;

  const { data } = await supabase.from("news_posts").select(NEWS_COLUMNS).eq("id", id).maybeSingle();
  if (!data) notFound();
  const row = data as NewsRow;
  const post = rowToPost(row);
  const emojis = await getDiscordEmojis(supabase);

  return (
    <div className="max-w-[80rem]">
      <Link href="/dashboard/news" className="text-sm text-muted hover:text-ink">Zurück zu News</Link>
      <h1 className="mt-3 font-sans text-2xl font-medium tracking-normal">News bearbeiten</h1>
      {neu && <p className="mt-2 text-sm text-muted">Angelegt. Als Entwurf gespeichert, bis du sie veröffentlichst.</p>}
      <p className="dash-help mt-2">
        Änderungen nach dem Veröffentlichen aktualisieren die Webseite. Bereits gepostete Discord-Nachrichten
        bleiben unverändert.
      </p>

      <div className="mt-8">
        <NewsForm
          action={saveNews}
          emojis={emojis}
          defaultSignature={defaultSignature(me.slug, me.name, me.is_lead)}
          canEditSignature={me.is_lead}
          post={{
            id: row.id,
            topic: post.topic,
            template: post.template,
            title: post.title,
            body: post.body,
            signature: post.signature,
            useEmbed: post.useEmbed,
            published: row.published,
            publishLocal: isoToZurichLocal(row.publish_at),
          }}
        />
      </div>

      <details className="mt-12 border-t border-[#24272c] pt-6">
        <summary className="w-fit cursor-pointer text-sm text-danger underline-offset-4 hover:underline">
          Beitrag löschen
        </summary>
        <form action={deleteNews} className="mt-4 flex flex-wrap items-center gap-4">
          <input type="hidden" name="id" value={row.id} />
          <p className="dash-help">Das lässt sich nicht rückgängig machen. Bereits gepostete Discord-Nachrichten bleiben bestehen.</p>
          <button type="submit" className="dash-btn-quiet">Ja, endgültig löschen</button>
        </form>
      </details>
    </div>
  );
}
