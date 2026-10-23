import OverviewView from "@/components/dashboard/bot/OverviewView";
import { BotDown, BotShell } from "@/components/dashboard/bot/Shell";
import { botFetch, type Overview } from "@/lib/bot-api";
import { botContext } from "./context";

export const metadata = { title: "Discord-Bot" };

type Search = Promise<{ g?: string; ok?: string; fehler?: string }>;

export default async function BotOverviewPage({ searchParams }: { searchParams: Search }) {
  const { g, ok, fehler } = await searchParams;
  const ctx = await botContext(g);
  const help = "Statistiken, Ranglisten und Aktionen für die Discord-Server.";

  if (!ctx.health || !ctx.guild) {
    return (
      <BotShell title="Discord-Bot" help={help}>
        <BotDown message={ctx.error ?? "Der Bot ist auf keinem Server."} />
      </BotShell>
    );
  }

  let content: React.ReactNode;
  try {
    const data = await botFetch<Overview>(`/api/site/overview?g=${ctx.guild.id}`, { user: ctx.who });
    content = <OverviewView data={data} />;
  } catch (err) {
    content = <BotDown message={err instanceof Error ? err.message : "Unbekannter Fehler"} />;
  }

  return (
    <BotShell title="Discord-Bot" help={help} guilds={ctx.health.guilds} current={ctx.guild.id} version={ctx.health.version} flash={{ ok, fehler }}>
      {content}
    </BotShell>
  );
}
