import { memberRole, setMemberRank, setMemberVoice, setMemberXp } from "@/app/dashboard/bot/actions";
import { fmtDuration, fmtNum, type MemberDetail } from "@/lib/bot-types";

function Panel({ title, help, children }: { title: string; help?: string; children: React.ReactNode }) {
  return (
    <section className="dash-panel">
      <h2 className="font-sans text-base font-medium tracking-normal">{title}</h2>
      {help && <p className="dash-help mt-1">{help}</p>}
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}

export default function MemberView({ d, guildId }: { d: MemberDetail; guildId: string }) {
  const pct = d.progress.xp_next ? Math.round((d.progress.xp_in / d.progress.xp_next) * 100) : 100;
  const hidden = (
    <>
      <input type="hidden" name="g" value={guildId} />
      <input type="hidden" name="u" value={d.id} />
    </>
  );

  return (
    <>
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={d.avatar} alt="" className="h-14 w-14 rounded-full bg-[#24272c] object-cover" />
        <div>
          <h2 className="font-sans text-xl font-medium tracking-normal">{d.name}</h2>
          <p className="nums text-xs text-muted">ID {d.id}{d.rank ? ` · ${d.rank}` : ""}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Level", fmtNum(d.level)],
          ["XP", fmtNum(d.xp)],
          ["Nachrichten", fmtNum(d.messages)],
          ["Voice-Zeit", fmtDuration(d.seconds)],
        ].map(([label, value]) => (
          <div key={label} className="dash-panel">
            <p className="text-xs text-muted">{label}</p>
            <p className="nums mt-1 text-xl font-medium">{value}</p>
          </div>
        ))}
      </div>

      <div className="dash-panel mt-3">
        <p className="text-xs text-muted">Fortschritt zu Level {d.level + 1}</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#24272c]" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-aqua" style={{ width: `${pct}%` }} />
        </div>
        <p className="nums dash-help mt-2">{fmtNum(d.progress.xp_in)} / {fmtNum(d.progress.xp_next)} XP</p>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <Panel title="XP bearbeiten" help="Eine Änderung prüft auch gleich den Rang.">
          <form action={setMemberXp} className="flex flex-wrap items-end gap-2">
            {hidden}
            <input type="hidden" name="mode" value="set" />
            <div className="min-w-[8rem] flex-1">
              <label htmlFor="setxp" className="dash-label">XP setzen auf</label>
              <input id="setxp" name="value" type="number" min={0} placeholder={String(d.xp)} className="dash-input nums" />
            </div>
            <button type="submit" className="dash-btn">Setzen</button>
          </form>
          <form action={setMemberXp} className="flex flex-wrap items-end gap-2">
            {hidden}
            <input type="hidden" name="mode" value="add" />
            <div className="min-w-[8rem] flex-1">
              <label htmlFor="addxp" className="dash-label">XP dazugeben oder abziehen</label>
              <input id="addxp" name="value" type="number" placeholder="z.B. 500 oder -200" className="dash-input nums" />
            </div>
            <button type="submit" className="dash-btn-quiet">Anwenden</button>
          </form>
        </Panel>

        <Panel title="Voice-Zeit setzen" help={`Aktuell ${fmtDuration(d.seconds)}.`}>
          <form action={setMemberVoice} className="flex flex-wrap items-end gap-2">
            {hidden}
            <div className="min-w-[8rem] flex-1">
              <label htmlFor="hours" className="dash-label">Stunden</label>
              <input id="hours" name="hours" type="number" min={0} step="0.1" placeholder={(d.seconds / 3600).toFixed(1)} className="dash-input nums" />
            </div>
            <button type="submit" className="dash-btn">Setzen</button>
          </form>
        </Panel>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <Panel title="Rang setzen" help="Vergibt den Rang und entfernt die alten Rang-Rollen.">
          <form action={setMemberRank} className="flex flex-wrap items-end gap-2">
            {hidden}
            <div className="min-w-[8rem] flex-1">
              <label htmlFor="rank" className="dash-label">Rang</label>
              <select id="rank" name="role_id" className="dash-input">
                {d.rank_options.map((r) => (
                  <option key={r.role_id} value={r.role_id}>{r.label}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="dash-btn">Vergeben</button>
          </form>
        </Panel>

        <Panel title="Rollen">
          <div className="flex flex-wrap gap-1.5">
            {d.roles.length === 0 ? (
              <span className="text-sm text-muted">Keine Rollen.</span>
            ) : (
              d.roles.map((r) => (
                <span key={r.id} className="rounded-full bg-raised px-2.5 py-1 text-xs">{r.name}</span>
              ))
            )}
          </div>
          <form action={memberRole} className="flex flex-wrap items-end gap-2">
            {hidden}
            <div className="min-w-[10rem] flex-1">
              <label htmlFor="role" className="dash-label">Rolle</label>
              <select id="role" name="role_id" className="dash-input">
                {d.assignable_roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.has ? "✓ " : ""}{r.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" name="op" value="add" className="dash-btn">Geben</button>
            <button type="submit" name="op" value="remove" className="dash-btn-quiet">Entziehen</button>
          </form>
        </Panel>
      </div>
    </>
  );
}
