import Link from "next/link";
import MemberView from "@/components/dashboard/bot/MemberView";
import { BotDown, BotShell } from "@/components/dashboard/bot/Shell";
import { botFetch, type MemberDetail } from "@/lib/bot-api";
import { botContext } from "../../context";

export const metadata = { title: "Mitglied verwalten" };

export default async function BotMemberPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ g?: string; ok?: string; fehler?: string }>;
}) {
  const { id } = await params;
  const { g, ok, fehler } = await searchParams;
  const ctx = await botContext(g);

  if (!ctx.health || !ctx.guild) {
    return (
      <BotShell title="Mitglied verwalten">
        <BotDown message={ctx.error ?? "Der Bot ist auf keinem Server."} />
      </BotShell>
    );
  }

  let content: React.ReactNode;
  if (!/^\d{1,20}$/.test(id)) {
    content = <BotDown message="Ungültige Mitglieds-ID." />;
  } else {
    try {
      const d = await botFetch<MemberDetail>(`/api/site/member?g=${ctx.guild.id}&u=${id}`, { user: ctx.who });
      content = <MemberView d={d} guildId={ctx.guild.id} />;
    } catch (err) {
      content = <BotDown message={err instanceof Error ? err.message : "Unbekannter Fehler"} />;
    }
  }

  return (
    <BotShell title="Mitglied verwalten" guilds={ctx.health.guilds} current={ctx.guild.id} version={ctx.health.version} flash={{ ok, fehler }}>
      <Link href={`/dashboard/bot/mitglieder?g=${ctx.guild.id}`} className="-mt-3 mb-6 block text-sm text-muted hover:text-ink">
        Zurück zur Liste
      </Link>
      {content}
    </BotShell>
  );
}
