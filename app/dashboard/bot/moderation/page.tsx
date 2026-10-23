import ModerationView from "@/components/dashboard/bot/ModerationView";
import { BotDown, BotShell } from "@/components/dashboard/bot/Shell";
import { botFetch, type Moderation } from "@/lib/bot-api";
import { botContext } from "../context";

export const metadata = { title: "Moderation" };

type Search = Promise<{ g?: string; ok?: string; fehler?: string }>;

export default async function BotModerationPage({ searchParams }: { searchParams: Search }) {
  const { g, ok, fehler } = await searchParams;
  const ctx = await botContext(g);
  const help = "Tickets sowie Bans, Kicks und Timeouts mit Moderator, Grund und Zeit.";

  if (!ctx.health || !ctx.guild) {
    return (
      <BotShell title="Moderation" help={help}>
        <BotDown message={ctx.error ?? "Der Bot ist auf keinem Server."} />
      </BotShell>
    );
  }

  let content: React.ReactNode;
  try {
    const data = await botFetch<Moderation>(`/api/site/moderation?g=${ctx.guild.id}`, { user: ctx.who });
    content = <ModerationView data={data} guildId={ctx.guild.id} />;
  } catch (err) {
    content = <BotDown message={err instanceof Error ? err.message : "Unbekannter Fehler"} />;
  }

  return (
    <BotShell title="Moderation" help={help} guilds={ctx.health.guilds} current={ctx.guild.id} version={ctx.health.version} flash={{ ok, fehler }}>
      {content}
    </BotShell>
  );
}
