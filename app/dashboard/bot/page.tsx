import GlobalView from "@/components/dashboard/bot/GlobalView";
import OverviewView from "@/components/dashboard/bot/OverviewView";
import { BotDown, BotShell } from "@/components/dashboard/bot/Shell";
import { BotApiError, botFetch, GLOBAL_SCOPE, type GlobalBoard, type Overview } from "@/lib/bot-api";
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

  const global = g === GLOBAL_SCOPE;
  let content: React.ReactNode;
  try {
    if (global) {
      content = <GlobalView data={await botFetch<GlobalBoard>("/api/site/global", { user: ctx.who })} />;
    } else {
      const data = await botFetch<Overview>(`/api/site/overview?g=${ctx.guild.id}`, { user: ctx.who });
      content = <OverviewView data={data} />;
    }
  } catch (err) {
    content =
      global && err instanceof BotApiError && err.status === 404 ? (
        <div className="dash-panel">
          <p className="font-medium">Globale Rangliste noch nicht verfügbar</p>
          <p className="dash-help mt-1">Der Bot kennt diese Abfrage noch nicht. Sie muss auf dem Bot-Server eingespielt werden.</p>
        </div>
      ) : (
        <BotDown message={err instanceof Error ? err.message : "Unbekannter Fehler"} />
      );
  }

  return (
    <BotShell title="Discord-Bot" help={help} guilds={ctx.health.guilds} current={global ? GLOBAL_SCOPE : ctx.guild.id} version={ctx.health.version} flash={{ ok, fehler }}>
      {content}
    </BotShell>
  );
}
