import Link from "next/link";
import { STATUS_GROUPS } from "@/data/status";
import UptimeBars from "@/components/status/UptimeBars";
import { pct } from "@/lib/status/format";
import { duration } from "@/lib/status/alerts";
import { getStatus, type Incident, type ServiceStatus } from "@/lib/status/data";

export const revalidate = 60;

export const metadata = {
  title: "Status",
  description: "Laufen die Dienste von Aracle? Website, Discord-Bot, Minecraft-Server und Apps, jede Minute geprüft.",
  alternates: { canonical: "/status" },
};

const dateTime = new Intl.DateTimeFormat("de-CH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" });

function ago(iso: string) {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return "gerade eben";
  if (min === 1) return "vor 1 Minute";
  if (min < 60) return `vor ${min} Minuten`;
  return `vor ${Math.round(min / 60)} Std.`;
}

const STATE = {
  up: { label: "Läuft", dot: "bg-aqua", text: "text-aqua" },
  down: { label: "Ausgefallen", dot: "bg-danger", text: "text-danger" },
  unknown: { label: "Noch keine Daten", dot: "bg-muted", text: "text-muted" },
  planned: { label: "Startet bald", dot: "border border-muted bg-transparent", text: "text-muted" },
} as const;

// Statusseite: ein Satz, ob alles läuft, darunter jeder Dienst mit 90 Tagen
// Verlauf und am Ende die Störungen. Geprüft wird jede Minute von aussen.
export default async function StatusPage() {
  const { ready, services, incidents, lastRun } = await getStatus();
  const down = services.filter((s) => s.state === "down");
  // Läuft die Überwachung selbst noch? Mehr als 5 Minuten ohne Prüfung ist verdächtig.
  const stale = Boolean(lastRun && Date.now() - new Date(lastRun).getTime() > 5 * 60_000);
  const nameOf = Object.fromEntries(services.map((s) => [s.id, s.name]));

  const headline = !ready
    ? { text: "Überwachung wird eingerichtet.", tone: "text-ink", dot: "bg-muted" }
    : down.length === 0
      ? { text: "Alles läuft.", tone: "text-ink", dot: "bg-aqua" }
      : down.length === 1
        ? { text: `${down[0].name} ist ausgefallen.`, tone: "text-ink", dot: "bg-danger" }
        : { text: `${down.length} Dienste sind ausgefallen.`, tone: "text-ink", dot: "bg-danger" };

  return (
    <div className="pb-[var(--section)]">
      <header className="wrap pt-28 md:pt-36">
        <p className="kicker text-aqua" data-rise>Status</p>
        <h1 className={`mega mt-5 flex items-center gap-[0.25em] ${headline.tone}`} data-rise>
          <span aria-hidden className="relative inline-flex h-[0.32em] w-[0.32em] shrink-0">
            {ready && <span className={`status-ping absolute inset-0 rounded-full ${headline.dot}`} />}
            <span className={`relative inline-flex h-full w-full rounded-full ${headline.dot}`} />
          </span>
          <span>{headline.text}</span>
        </h1>
        <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-line pt-5" data-rise style={{ ["--i" as string]: 1 }}>
          <p className="max-w-[52ch] text-ink/80">
            {ready
              ? "Jede Minute prüft ein Server ausserhalb unseres Netzwerks, ob die Dienste antworten. Fällt etwas aus, erfahren wir es sofort."
              : "Sobald die Überwachung läuft, steht hier, ob alle Dienste erreichbar sind."}
          </p>
          {lastRun && (
            <p className={`small ${stale ? "text-glow" : "text-muted"}`}>
              {stale ? "Letzte Prüfung " : "Zuletzt geprüft "}
              <time dateTime={lastRun}>{ago(lastRun)}</time>
              {stale && ", die Überwachung hängt gerade"}
            </p>
          )}
        </div>
      </header>

      {down.some((s) => s.openIncident) && (
        <section aria-label="Aktuelle Störungen" className="wrap mt-12">
          <ul className="flex flex-col gap-3">
            {down.map((s) => (
              <li key={s.id} className="rounded-[var(--radius)] border border-danger/40 bg-danger/[0.06] p-5">
                <p className="font-semibold tracking-[-0.015em]">{s.name} ist nicht erreichbar</p>
                {s.openIncident && (
                  <p className="small mt-1 text-ink/80">
                    Seit {dateTime.format(new Date(s.openIncident.startedAt))} ({duration(s.openIncident.startedAt, new Date().toISOString())})
                    {s.openIncident.detail && <span className="block text-muted">{s.openIncident.detail}</span>}
                  </p>
                )}
                {s.openIncident?.note && <p className="mt-3 max-w-[60ch] text-ink/90">{s.openIncident.note}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {STATUS_GROUPS.map((g) => {
        const list = services.filter((s) => s.group === g);
        if (!list.length) return null;
        return (
          <section key={g} aria-labelledby={`g-${g}`} className="wrap mt-16 md:mt-20">
            <h2 id={`g-${g}`} className="small text-muted">{g}</h2>
            <ul className="mt-3 border-b border-line">
              {list.map((s) => <ServiceRow key={s.id} s={s} />)}
            </ul>
          </section>
        );
      })}

      <section aria-labelledby="stoerungen" className="wrap mt-[var(--section)] grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 id="stoerungen" className="head">Störungen.</h2>
          <p className="small mt-3 max-w-[30ch] text-muted">Alle Ausfälle der letzten 90 Tage, ab zwei Minuten am Stück.</p>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          {incidents.length === 0 ? (
            <p className="text-ink/80">{ready ? "Keine Störungen in den letzten 90 Tagen." : "Noch keine Daten."}</p>
          ) : (
            <IncidentList items={incidents} nameOf={nameOf} />
          )}
        </div>
      </section>

      <p className="wrap small mt-[var(--section)] text-muted">
        Etwas funktioniert nicht und steht hier nicht? <Link href="/kontakt" className="link">Sag uns Bescheid</Link>.
      </p>
    </div>
  );
}

function ServiceRow({ s }: { s: ServiceStatus }) {
  const st = STATE[s.state];
  return (
    <li className="grid gap-x-8 gap-y-4 border-t border-line py-6 md:grid-cols-12 md:items-center">
      <div className="md:col-span-4">
        <p className="flex items-center gap-2.5">
          <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${st.dot}`} />
          {s.href ? (
            s.href.startsWith("/") ? (
              <Link href={s.href} className="font-semibold tracking-[-0.015em] transition-colors hover:text-aqua">{s.name}</Link>
            ) : (
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-semibold tracking-[-0.015em] transition-colors hover:text-aqua">{s.name}</a>
            )
          ) : (
            <span className="font-semibold tracking-[-0.015em]">{s.name}</span>
          )}
        </p>
        <p className="small mt-1 pl-[1.125rem] text-muted">{s.description}</p>
      </div>
      <div className="md:col-span-6">
        <UptimeBars days={s.days} label={s.name} />
      </div>
      <dl className="flex gap-6 md:col-span-2 md:flex-col md:gap-1 md:text-right">
        <div>
          <dt className="sr-only">Zustand</dt>
          <dd className={`text-[0.9375rem] ${st.text}`}>
            {st.label}
            {s.state === "up" && s.lastCheck?.latency != null && <span className="nums ml-2 text-muted">{s.lastCheck.latency} ms</span>}
          </dd>
        </div>
        <div>
          <dt className="sr-only">Verfügbarkeit 90 Tage</dt>
          <dd className="small nums text-muted">{s.state === "planned" ? "noch nicht in Betrieb" : s.uptime90 === null ? "–" : `${pct(s.uptime90)} in 90 Tagen`}</dd>
        </div>
        {s.state === "up" && s.lastCheck?.detail && (
          <div>
            <dt className="sr-only">Details</dt>
            <dd className="small text-muted">{s.lastCheck.detail}</dd>
          </div>
        )}
      </dl>
    </li>
  );
}

function IncidentList({ items, nameOf }: { items: Incident[]; nameOf: Record<string, string> }) {
  return (
    <ol className="border-b border-line">
      {items.slice(0, 20).map((i) => (
        <li key={i.id} className="grid gap-1 border-t border-line py-4 sm:grid-cols-[1fr_auto] sm:gap-6">
          <div>
            <p className="font-semibold tracking-[-0.015em]">
              {nameOf[i.service] ?? i.service}
              {!i.resolvedAt && <span className="small ml-2 font-normal text-danger">läuft noch</span>}
            </p>
            <p className="small mt-0.5 text-muted">
              {dateTime.format(new Date(i.startedAt))}
              {i.detail && `, ${i.detail}`}
            </p>
            {i.note && <p className="mt-2 max-w-[56ch] text-[0.9375rem] text-ink/85">{i.note}</p>}
          </div>
          <p className="small nums text-muted sm:text-right">
            {i.resolvedAt ? duration(i.startedAt, i.resolvedAt) : duration(i.startedAt, new Date().toISOString())}
          </p>
        </li>
      ))}
    </ol>
  );
}
