import { deleteTicket } from "@/app/dashboard/bot/actions";
import ConfirmSubmit from "@/components/dashboard/bot/ConfirmSubmit";
import type { Moderation } from "@/lib/bot-types";

const fmt = new Intl.DateTimeFormat("de-CH", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Zurich" });
const when = (ts: number) => fmt.format(new Date(ts * 1000));

const ACTION_TONE: Record<string, string> = {
  Ban: "text-danger",
  Kick: "text-[#d9a441]",
  Timeout: "text-[#d9a441]",
  Unban: "text-aqua",
  "Timeout entfernt": "text-aqua",
};

const STATUS: Record<string, { label: string; tone: string }> = {
  open: { label: "Offen", tone: "text-aqua" },
  close_requested: { label: "Schließung angefragt", tone: "text-[#d9a441]" },
  closed: { label: "Geschlossen", tone: "text-muted" },
};

export default function ModerationView({ data, guildId }: { data: Moderation; guildId: string }) {
  return (
    <>
      <section className="dash-panel !p-0">
        <h2 className="px-5 pt-5 font-sans text-base font-medium tracking-normal">Tickets</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead>
              <tr className="text-xs text-muted">
                <th className="px-5 py-3 font-medium">Nr.</th>
                <th className="px-3 py-3 font-medium">Anliegen</th>
                <th className="px-3 py-3 font-medium">Ersteller</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Geöffnet</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.tickets.map((t) => {
                const s = STATUS[t.status] ?? { label: t.status, tone: "text-muted" };
                return (
                  <tr key={t.channel_id} className="border-t border-[#24272c]">
                    <td className="nums px-5 py-2.5 font-medium">#{t.number}</td>
                    <td className="px-3 py-2.5">
                      {t.category}
                      {t.subject && <span className="text-muted"> · {t.subject}</span>}
                      {t.claimed_by && <span className="block text-xs text-muted">Betreut von {t.claimed_by}</span>}
                    </td>
                    <td className="px-3 py-2.5">{t.user_name}</td>
                    <td className={`px-3 py-2.5 ${s.tone}`}>{s.label}</td>
                    <td className="nums px-3 py-2.5 text-muted">{when(t.opened_ts)}</td>
                    <td className="px-5 py-2.5 text-right">
                      <span className="inline-flex items-center gap-3">
                        {t.channel_exists ? (
                          <a
                            href={`https://discord.com/channels/${guildId}/${t.channel_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted hover:text-ink"
                          >
                            In Discord
                          </a>
                        ) : (
                          <span className="text-muted">Kanal weg</span>
                        )}
                        <form action={deleteTicket}>
                          <input type="hidden" name="g" value={guildId} />
                          <input type="hidden" name="channel_id" value={t.channel_id} />
                          <ConfirmSubmit
                            message={`Ticket #${t.number} endgültig löschen (Kanal und Eintrag)?`}
                            className="text-danger underline-offset-4 hover:underline"
                          >
                            Löschen
                          </ConfirmSubmit>
                        </form>
                      </span>
                    </td>
                  </tr>
                );
              })}
              {data.tickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-6 text-center text-muted">Noch keine Tickets.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dash-panel mt-3 !p-0">
        <h2 className="px-5 pt-5 font-sans text-base font-medium tracking-normal">Moderations-Log</h2>
        <p className="dash-help px-5 pt-1">Die letzten 100 Bans, Kicks und Timeouts.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead>
              <tr className="text-xs text-muted">
                <th className="px-5 py-3 font-medium">Aktion</th>
                <th className="px-3 py-3 font-medium">Ziel</th>
                <th className="px-3 py-3 font-medium">Moderator</th>
                <th className="px-3 py-3 font-medium">Grund</th>
                <th className="px-5 py-3 font-medium">Wann</th>
              </tr>
            </thead>
            <tbody>
              {data.actions.map((a, i) => (
                <tr key={`${a.ts}-${i}`} className="border-t border-[#24272c]">
                  <td className={`px-5 py-2.5 font-medium ${ACTION_TONE[a.action] ?? ""}`}>{a.action}</td>
                  <td className="px-3 py-2.5">
                    {a.target_name ?? "unbekannt"}
                    {a.target_id && <span className="nums block text-xs text-muted">{a.target_id}</span>}
                  </td>
                  <td className="px-3 py-2.5">{a.moderator ?? "unbekannt"}</td>
                  <td className="px-3 py-2.5">{a.reason ?? <span className="text-muted">kein Grund</span>}</td>
                  <td className="nums whitespace-nowrap px-5 py-2.5 text-muted">{when(a.ts)}</td>
                </tr>
              ))}
              {data.actions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-muted">
                    Noch keine Moderations-Aktionen geloggt. Der Bot braucht dafür das Recht „Audit-Log ansehen“.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
