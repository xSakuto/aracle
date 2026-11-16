import { Row } from "@/components/dashboard/bot/OverviewView";
import { fmtDuration, fmtNum, type GlobalBoard } from "@/lib/bot-types";

// Ranglisten über alle Server zusammen. Aktionen gibt es hier keine, die gehören zu einem einzelnen Server.
export default function GlobalView({ data }: { data: GlobalBoard }) {
  return (
    <>
      <div className="dash-panel">
        <p className="text-xs text-muted">Voice gesamt, alle Server</p>
        <p className="nums mt-1 text-2xl font-medium">{fmtDuration(data.voice_total_seconds)}</p>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <section className="dash-panel">
          <h2 className="font-sans text-base font-medium tracking-normal">Top XP, global</h2>
          {data.top_xp.length === 0 ? (
            <p className="dash-help mt-2">Noch keine Daten.</p>
          ) : (
            <ul className="mt-2 divide-y divide-[#24272c]">
              {data.top_xp.map((p, i) => (
                <Row key={p.id} i={i} p={p} value={`Level ${p.level} · ${fmtNum(p.xp)} XP`} />
              ))}
            </ul>
          )}
        </section>
        <section className="dash-panel">
          <h2 className="font-sans text-base font-medium tracking-normal">Top Voice, global</h2>
          {data.top_voice.length === 0 ? (
            <p className="dash-help mt-2">Noch keine Daten.</p>
          ) : (
            <ul className="mt-2 divide-y divide-[#24272c]">
              {data.top_voice.map((p, i) => (
                <Row key={p.id} i={i} p={p} value={fmtDuration(p.seconds)} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
