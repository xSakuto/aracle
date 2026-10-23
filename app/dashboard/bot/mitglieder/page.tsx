import MemberTable from "@/components/dashboard/bot/MemberTable";
import { BotDown, BotShell } from "@/components/dashboard/bot/Shell";
import { botFetch, type MemberList } from "@/lib/bot-api";
import { botContext } from "../context";

export const metadata = { title: "Mitglieder" };

type Search = Promise<{ g?: string; ok?: string; fehler?: string }>;

export default async function BotMembersPage({ searchParams }: { searchParams: Search }) {
  const { g, ok, fehler } = await searchParams;
  const ctx = await botContext(g);
  const help = "XP, Voice-Zeit, Ränge und Rollen der Mitglieder.";

  if (!ctx.health || !ctx.guild) {
    return (
      <BotShell title="Mitglieder" help={help}>
        <BotDown message={ctx.error ?? "Der Bot ist auf keinem Server."} />
      </BotShell>
    );
  }

  let content: React.ReactNode;
  try {
    const data = await botFetch<MemberList>(`/api/site/members?g=${ctx.guild.id}`, { user: ctx.who });
    content = <MemberTable members={data.members} rankType={data.rank_type} guildId={ctx.guild.id} />;
  } catch (err) {
    content = <BotDown message={err instanceof Error ? err.message : "Unbekannter Fehler"} />;
  }

  return (
    <BotShell title="Mitglieder" help={help} guilds={ctx.health.guilds} current={ctx.guild.id} version={ctx.health.version} flash={{ ok, fehler }}>
      {content}
    </BotShell>
  );
}
