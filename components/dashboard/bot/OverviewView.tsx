import { resetGame, syncRanks } from "@/app/dashboard/bot/actions";
import ConfirmSubmit from "@/components/dashboard/bot/ConfirmSubmit";
import { fmtDuration, fmtNum, type Overview, type Person } from "@/lib/bot-types";

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="dash-panel">
      <p className="text-xs text-muted">{label}</p>
      <p className="nums mt-1 text-2xl font-medium">{value}</p>
      {sub && <p className="dash-help mt-0.5">{sub}</p>}
    </div>
  );
}

function Row({ i, p, value }: { i: number; p: Person; value: string }) {
  return (
    <li className="flex items-center gap-3 py-2">
      <span className="nums w-5 text-right text-xs text-muted">{i + 1}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.avatar} alt="" loading="lazy" className="h-7 w-7 shrink-0 rounded-full bg-[#24272c] object-cover" />
      <span className="min-w-0 flex-1 truncate">{p.name}</span>
      <span className="nums shrink-0 text-sm text-muted">{value}</span>
    </li>
  );
}

export default function OverviewView({ data }: { data: Overview }) {
  const { stats, guild } = data;
  const gid = guild.id;
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Mitglieder" value={fmtNum(stats.members)} />
        <Stat label="Im Voice" value={fmtNum(stats.in_voice)} />
        {guild.rank_type === "voice" && <Stat label="Voice gesamt" value={fmtDuration(stats.voice_total_seconds)} />}
        <Stat label="Counting" value={fmtNum(stats.counting.streak)} sub={`Rekord ${fmtNum(stats.counting.record)}`} />
        <Stat label="Wortkette" value={fmtNum(stats.wordchain.streak)} sub={`Rekord ${fmtNum(stats.wordchain.record)}`} />
        <Stat label="One Word" value={fmtNum(stats.oneword.streak)} sub={`Rekord ${fmtNum(stats.oneword.record)}`} />
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <section className="dash-panel">
          <h2 className="font-sans text-base font-medium tracking-normal">Top XP</h2>
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
          <h2 className="font-sans text-base font-medium tracking-normal">Top Voice</h2>
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

      <section className="dash-panel mt-6">
        <h2 className="font-sans text-base font-medium tracking-normal">Ränge abgleichen</h2>
        <p className="dash-help mt-1">
          Prüft alle Mitglieder und korrigiert die Rang-Rollen. Das passiert sonst automatisch bei jeder Nachricht.
        </p>
        <form action={syncRanks} className="mt-4">
          <input type="hidden" name="g" value={gid} />
          <ConfirmSubmit message="Alle Ränge aller Mitglieder prüfen und korrigieren?">Ränge synchronisieren</ConfirmSubmit>
        </form>
      </section>

      <section className="dash-panel mt-3">
        <h2 className="font-sans text-base font-medium tracking-normal">Spiele zurücksetzen</h2>
        <p className="dash-help mt-1">Setzt die aktuelle Serie auf 0. Der Rekord bleibt erhalten.</p>
        <form action={resetGame} className="mt-4 flex flex-wrap gap-2">
          <input type="hidden" name="g" value={gid} />
          <ConfirmSubmit message="Counting zurücksetzen?" name="game" value="counting">Counting</ConfirmSubmit>
          <ConfirmSubmit message="Wortkette zurücksetzen?" name="game" value="wordchain">Wortkette</ConfirmSubmit>
          <ConfirmSubmit message="One Word zurücksetzen?" name="game" value="oneword">One Word</ConfirmSubmit>
        </form>
      </section>
    </>
  );
}
