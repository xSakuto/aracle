"use client";

import { useActionState, useState } from "react";
import { saveIncidentNote, sendTestAlert, type TestState } from "@/app/dashboard/status/actions";

export function TestAlert() {
  const [state, setState] = useState<TestState>({});
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <button
        type="button"
        disabled={busy}
        className="dash-btn"
        onClick={async () => {
          setBusy(true);
          setState(await sendTestAlert());
          setBusy(false);
        }}
      >
        {busy ? "Sendet…" : "Test-Alarm senden"}
      </button>
      <div aria-live="polite" className="mt-3 text-sm">
        {state.error && <p className="text-danger">{state.error}</p>}
        {state.results && (
          <ul className="flex flex-col gap-1">
            {state.results.map((r) => (
              <li key={r.channel} className={r.ok ? "text-aqua" : "text-danger"}>
                {r.channel}: {r.ok ? "verschickt" : `fehlgeschlagen${r.error ? ` (${r.error})` : ""}`}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function IncidentNote({ id, note }: { id: number; note: string }) {
  const [state, action, pending] = useActionState(saveIncidentNote, {});
  return (
    <form action={action} className="mt-3 flex flex-col gap-2">
      <input type="hidden" name="id" value={id} />
      <label htmlFor={`note-${id}`} className="dash-label !mb-0">Hinweis auf der Statusseite</label>
      <textarea id={`note-${id}`} name="note" maxLength={500} rows={2} defaultValue={note} placeholder="z. B. Stromausfall im Glarnerland, wir sind dran." className="dash-input" />
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="dash-btn-quiet">Hinweis speichern</button>
        <span aria-live="polite" className="text-sm">
          {state.error ? <span className="text-danger">{state.error}</span> : state.ok ? <span className="text-muted">Gespeichert</span> : null}
        </span>
      </div>
    </form>
  );
}
