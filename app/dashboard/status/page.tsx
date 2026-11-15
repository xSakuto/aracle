import Link from "next/link";
import { IncidentNote, TestAlert } from "@/components/dashboard/StatusTools";
import { SERVICES } from "@/data/status";
import { configuredChannels, duration } from "@/lib/status/alerts";
import { requireAdmin } from "@/lib/session";

const fmt = new Intl.DateTimeFormat("de-CH", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Zurich" });

type Row = { id: number; service: string; started_at: string; resolved_at: string | null; detail: string; note: string };

export default async function StatusAdminPage() {
  const { supabase } = await requireAdmin();
  const channels = configuredChannels();
  const { data, error } = await supabase
    .from("status_incidents")
    .select("id, service, started_at, resolved_at, detail, note")
    .order("started_at", { ascending: false })
    .limit(20);
  const rows = (data ?? []) as Row[];
  const nameOf = Object.fromEntries(SERVICES.map((s) => [s.id, s.name]));

  return (
    <div className="max-w-[60rem]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-medium tracking-normal">Status & Alarm</h1>
          <p className="mt-1 text-muted">Jede Minute geprüft. Fällt ein Dienst zwei Minuten am Stück aus, kommt ein Alarm.</p>
        </div>
        <Link href="/status" target="_blank" className="dash-btn-quiet">Statusseite ansehen ↗</Link>
      </div>

      <section className="dash-panel mt-8">
        <h2 className="font-sans text-base font-medium tracking-normal">Alarm-Kanäle</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {Object.entries(channels).map(([name, on]) => (
            <li key={name} className="flex items-center gap-2 text-sm">
              <span aria-hidden className={`h-2 w-2 rounded-full ${on ? "bg-aqua" : "bg-[#3a3f47]"}`} />
              {name}
              <span className="text-muted">{on ? "eingerichtet" : "nicht eingerichtet"}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 border-t border-[#24272c] pt-5">
          <TestAlert />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-sans text-lg font-medium tracking-normal">Störungen</h2>
        {error ? (
          <div className="dash-panel mt-4">
            <p className="font-medium">Datenbank noch nicht vorbereitet</p>
            <p className="dash-help mt-1">Führ <code>supabase/2026-10-status.sql</code> einmal im Supabase SQL-Editor aus.</p>
          </div>
        ) : rows.length === 0 ? (
          <p className="mt-4 text-muted">Noch keine Störungen.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {rows.map((r) => (
              <li key={r.id} className="dash-panel">
                <p className="font-medium">
                  {nameOf[r.service] ?? r.service}
                  <span className={`ml-2 text-xs ${r.resolved_at ? "text-muted" : "text-danger"}`}>
                    {r.resolved_at ? `behoben nach ${duration(r.started_at, r.resolved_at)}` : "läuft noch"}
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted">
                  {fmt.format(new Date(r.started_at))}
                  {r.detail && `, ${r.detail}`}
                </p>
                <IncidentNote id={r.id} note={r.note} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="dash-panel mt-10 text-sm leading-relaxed">
        <h2 className="font-sans text-base font-medium tracking-normal">Kanäle einrichten</h2>
        <p className="dash-help mt-1">In Vercel unter Settings, Environment Variables setzen und neu deployen.</p>
        <dl className="mt-4 flex flex-col gap-4">
          <div>
            <dt className="font-medium">E-Mail</dt>
            <dd className="text-muted"><code>STATUS_ALERT_EMAIL</code> = deine Adresse (mehrere mit Komma). Resend ist schon eingerichtet.</dd>
          </div>
          <div>
            <dt className="font-medium">WhatsApp</dt>
            <dd className="text-muted">
              Auf callmebot.com unter «WhatsApp API» die aktuelle Bot-Nummer als Kontakt speichern und ihr
              «I allow callmebot to send me messages» schreiben.
              Den Key aus der Antwort als <code>CALLMEBOT_APIKEY</code>, deine Nummer als <code>CALLMEBOT_PHONE</code> (z. B. +41791234567).
            </dd>
          </div>
          <div>
            <dt className="font-medium">Push aufs Handy</dt>
            <dd className="text-muted">
              App «ntfy» installieren, einen langen, zufälligen Kanalnamen abonnieren und ihn als <code>NTFY_TOPIC</code> setzen.
              Kommt auch nachts durch, wenn du kritische Meldungen erlaubst.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Discord</dt>
            <dd className="text-muted"><code>STATUS_DISCORD_WEBHOOK</code> = Webhook-Adresse eines privaten Kanals. Hilft nicht, wenn Discord selbst weg ist.</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
