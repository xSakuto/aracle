import Link from "next/link";
import { botFetch, pickGuild, type Health, type Overview } from "@/lib/bot-api";
import { fmtNum } from "@/lib/bot-types";

function Head({ state, tone }: { state: string; tone: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 className="flex items-center gap-2 font-sans text-base font-medium tracking-normal">
        Discord-Bot
        <span className={`dash-pill ${tone}`}>
          <span aria-hidden className="dash-dot" />
          <span className="text-ink">{state}</span>
        </span>
      </h2>
      <Link href="/dashboard/bot" className="text-xs text-muted transition-colors hover:text-ink">
        Öffnen
      </Link>
    </div>
  );
}

export function BotWidgetSkeleton() {
  return (
    <section className="dash-panel" role="status" aria-label="Discord-Bot lädt">
      <Head state="Wird abgefragt" tone="text-muted" />
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="dash-skeleton h-12 !rounded-[8px] !bg-raised" />
        ))}
      </div>
    </section>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="nums mt-0.5 text-lg font-medium">{value}</p>
    </div>
  );
}

// Kurzstatus des Bots für die Übersicht. Kurze Wartezeit, damit ein ausgeschalteter
// Heimserver die Seite nicht blockiert.
export default async function BotWidget({ who }: { who: string }) {
  try {
    const health = await botFetch<Health>("/api/site/health", { user: who, timeoutMs: 6000 });
    const guild = pickGuild(health.guilds);
    if (!guild) {
      return (
        <section className="dash-panel">
          <Head state="Online" tone="text-aqua" />
          <p className="dash-help mt-2">Der Bot läuft, ist aber auf keinem Server.</p>
        </section>
      );
    }
    const { stats } = await botFetch<Overview>(`/api/site/overview?g=${guild.id}`, { user: who, timeoutMs: 6000 });
    return (
      <section className="dash-panel">
        <Head state="Online" tone="text-aqua" />
        <p className="dash-help mt-1">
          {guild.name}
          {health.version ? `, Bot v${health.version}` : ""}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4">
          <Mini label="Mitglieder" value={fmtNum(stats.members)} />
          <Mini label="Im Voice" value={fmtNum(stats.in_voice)} />
          <Mini label="Counting" value={`${fmtNum(stats.counting.streak)} (Rekord ${fmtNum(stats.counting.record)})`} />
          <Mini label="Wortkette" value={`${fmtNum(stats.wordchain.streak)} (Rekord ${fmtNum(stats.wordchain.record)})`} />
        </div>
      </section>
    );
  } catch (err) {
    return (
      <section className="dash-panel">
        <Head state="Nicht erreichbar" tone="text-danger" />
        <p className="dash-help mt-2">{err instanceof Error ? err.message : "Unbekannter Fehler"}</p>
      </section>
    );
  }
}
