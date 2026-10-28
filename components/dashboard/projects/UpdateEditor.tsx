"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { deleteUpdate, saveUpdate } from "@/app/dashboard/projekte/actions";

export type UpdateDraft = {
  id?: string;
  version: string;
  title: string;
  body: string;
  published: boolean;
  publishedLocal: string;
  authorName?: string;
};

const fmt = new Intl.DateTimeFormat("de-CH", { dateStyle: "medium", timeZone: "Europe/Zurich" });

// Ein Changelog-Eintrag: geschlossen als Zeile, offen als kleines Formular.
function Entry({ slug, entry, open: initialOpen, onDone }: { slug: string; entry: UpdateDraft; open?: boolean; onDone?: () => void }) {
  const [open, setOpen] = useState(Boolean(initialOpen));
  const [state, action, pending] = useActionState(saveUpdate, {});
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      if (!entry.id) form.current?.reset();
      setOpen(Boolean(!entry.id && initialOpen));
      onDone?.();
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="dash-panel flex w-full flex-wrap items-center justify-between gap-3 text-left transition-colors hover:bg-[#161f25]"
      >
        <span className="min-w-0">
          <span className="block truncate font-medium">
            {entry.version && <span className="nums mr-2 rounded-full bg-raised px-2 py-0.5 text-xs">{entry.version}</span>}
            {entry.title}
          </span>
          <span className="mt-1 block text-xs text-muted">
            {fmt.format(new Date(entry.publishedLocal))}
            {entry.authorName && `, von ${entry.authorName}`}
          </span>
        </span>
        <span className={`text-xs ${entry.published ? "text-aqua" : "text-muted"}`}>{entry.published ? "Veröffentlicht" : "Entwurf"}</span>
      </button>
    );
  }

  return (
    <div className="dash-panel">
      <form ref={form} action={action} className="flex flex-col gap-4">
        <input type="hidden" name="project_slug" value={slug} />
        {entry.id && <input type="hidden" name="id" value={entry.id} />}
        <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
          <div>
            <label htmlFor={`v-${entry.id ?? "neu"}`} className="dash-label">Version</label>
            <input id={`v-${entry.id ?? "neu"}`} name="version" maxLength={30} defaultValue={entry.version} placeholder="z. B. 0.4" className="dash-input nums" />
          </div>
          <div>
            <label htmlFor={`t-${entry.id ?? "neu"}`} className="dash-label">Titel</label>
            <input id={`t-${entry.id ?? "neu"}`} name="title" required minLength={2} maxLength={140} defaultValue={entry.title} placeholder="Was ist neu?" className="dash-input" />
          </div>
        </div>
        <div>
          <label htmlFor={`b-${entry.id ?? "neu"}`} className="dash-label">Details</label>
          <textarea id={`b-${entry.id ?? "neu"}`} name="body" maxLength={4000} rows={5} defaultValue={entry.body} placeholder={"- Neu: …\n- Behoben: …"} className="dash-input" />
          <p className="dash-help mt-1">Markdown wie bei den News: Listen mit «-», **fett**, Links.</p>
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor={`d-${entry.id ?? "neu"}`} className="dash-label">Datum</label>
            <input id={`d-${entry.id ?? "neu"}`} name="published_at" type="datetime-local" required defaultValue={entry.publishedLocal} className="dash-input nums" />
          </div>
          <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm">
            <input type="checkbox" name="published" defaultChecked={entry.published} className="h-4 w-4 accent-[var(--color-aqua)]" />
            Veröffentlicht
          </label>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-sm">
            {state.error ? <span className="text-danger">{state.error}</span> : pending ? <span className="text-muted">Speichert…</span> : null}
          </p>
          <div className="flex gap-2">
            {entry.id && (
              <button type="button" className="dash-btn-quiet" onClick={() => setOpen(false)}>Schliessen</button>
            )}
            <button type="submit" disabled={pending} className="dash-btn">{entry.id ? "Speichern" : "Eintrag veröffentlichen"}</button>
          </div>
        </div>
      </form>
      {entry.id && (
        <form
          action={deleteUpdate}
          className="mt-3 border-t border-[#24272c] pt-3"
          onSubmit={(e) => {
            if (!window.confirm("Diesen Eintrag löschen?")) e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={entry.id} />
          <input type="hidden" name="project_slug" value={slug} />
          <button type="submit" className="text-sm text-danger hover:underline">Eintrag löschen</button>
        </form>
      )}
    </div>
  );
}

export default function UpdateEditor({ slug, entries, nowLocal }: { slug: string; entries: UpdateDraft[]; nowLocal: string }) {
  return (
    <div className="flex flex-col gap-3">
      <Entry slug={slug} entry={{ version: "", title: "", body: "", published: true, publishedLocal: nowLocal }} open />
      {entries.length > 0 && <p className="dash-help mt-4">Bisherige Einträge</p>}
      {entries.map((e) => (
        <Entry key={e.id} slug={slug} entry={e} />
      ))}
    </div>
  );
}
