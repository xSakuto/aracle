import Link from "next/link";
import NewsForm from "@/components/dashboard/NewsForm";
import { requireAdmin } from "@/lib/session";
import { isoToZurichLocal } from "@/lib/zurich-time";
import { saveNews } from "../actions";

export const metadata = { title: "Neue News" };

export default async function NewNewsPage() {
  await requireAdmin();
  return (
    <div className="max-w-[72rem]">
      <Link href="/dashboard/news" className="text-sm text-muted hover:text-ink">Zurück zu News</Link>
      <h1 className="mt-3 font-sans text-2xl font-medium tracking-normal">Neue News</h1>
      <div className="mt-8">
        <NewsForm
          action={saveNews}
          post={{
            id: "",
            topic: "aracle",
            template: "update",
            title: "",
            body: "",
            items: [],
            links: [],
            imageUrl: "",
            published: false,
            publishLocal: isoToZurichLocal(new Date().toISOString()),
          }}
        />
      </div>
    </div>
  );
}
