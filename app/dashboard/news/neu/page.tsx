import Link from "next/link";
import NewsForm from "@/components/dashboard/NewsForm";
import { defaultSignature } from "@/data/news";
import { getDiscordEmojis } from "@/lib/discord-emojis";
import { requireAdmin } from "@/lib/session";
import { isoToZurichLocal } from "@/lib/zurich-time";
import { saveNews } from "../actions";

export const metadata = { title: "Neue News" };

export default async function NewNewsPage() {
  const { supabase, me } = await requireAdmin();
  const emojis = await getDiscordEmojis(supabase);
  const signature = defaultSignature(me.slug, me.name, me.is_lead);
  return (
    <div className="max-w-[80rem]">
      <Link href="/dashboard/news" className="text-sm text-muted hover:text-ink">Zurück zu News</Link>
      <h1 className="mt-3 font-sans text-2xl font-medium tracking-normal">Neue News</h1>
      <div className="mt-8">
        <NewsForm
          action={saveNews}
          emojis={emojis}
          defaultSignature={signature}
          canEditSignature={me.is_lead}
          post={{
            id: "",
            topic: "aracle",
            template: "update",
            title: "",
            body: "",
            signature,
            useEmbed: false,
            published: false,
            publishLocal: isoToZurichLocal(new Date().toISOString()),
          }}
        />
      </div>
    </div>
  );
}
