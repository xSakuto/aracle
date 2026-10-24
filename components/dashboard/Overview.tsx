import Link from "next/link";
import { botFetch, pickGuild, type Health, type Moderation } from "@/lib/bot-api";
import type { FullProfile, Permission } from "@/lib/session";
import { createSessionClient } from "@/lib/supabase/server";

type Tile = { label: string; value: string; href: string };

async function inquiryTile(supabase: Awaited<ReturnType<typeof createSessionClient>>): Promise<Tile> {
  const { count } = await supabase.from("inquiries").select("id", { count: "exact", head: true }).neq("status", "archiviert");
  return { label: "Offene Anfragen", value: String(count ?? 0), href: "/dashboard/anfragen" };
}

async function newsTile(supabase: Awaited<ReturnType<typeof createSessionClient>>): Promise<Tile> {
  const { count } = await supabase.from("news_posts").select("id", { count: "exact", head: true }).eq("published", false);
  return { label: "News-Entwürfe", value: String(count ?? 0), href: "/dashboard/news" };
}

async function botTile(who: string): Promise<Tile | null> {
  try {
    const health = await botFetch<Health>("/api/site/health", { user: who });
    const guild = pickGuild(health.guilds);
    if (!guild) return null;
    const mod = await botFetch<Moderation>(`/api/site/moderation?g=${guild.id}`, { user: who });
    const open = mod.tickets.filter((t) => t.status !== "closed").length;
    return { label: "Offene Tickets", value: String(open), href: "/dashboard/bot/moderation" };
  } catch {
    return null;
  }
}

// Kleiner Überblick auf der Startseite, nur für die Bereiche, die diese Person auch sehen darf.
export default async function Overview({ me }: { me: FullProfile }) {
  const supabase = await createSessionClient();
  const can = (perm: Permission) => me.is_admin || me.permissions.includes(perm);

  const tiles = (
    await Promise.all([
      can("anfragen") ? inquiryTile(supabase) : null,
      can("news") ? newsTile(supabase) : null,
      can("bot") ? botTile(me.email ?? me.id) : null,
    ])
  ).filter((t): t is Tile => Boolean(t));

  if (tiles.length === 0) return null;

  return (
    <div className="mb-8 grid gap-3 sm:grid-cols-3">
      {tiles.map((t) => (
        <Link
          key={t.label}
          href={t.href}
          className="dash-panel flex flex-col gap-1 transition-colors hover:bg-[#17191c]"
        >
          <span className="nums text-2xl font-medium">{t.value}</span>
          <span className="text-sm text-muted">{t.label}</span>
        </Link>
      ))}
    </div>
  );
}
