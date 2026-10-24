"use client";

import { useMemo, useState, useTransition } from "react";
import Portrait from "@/components/Portrait";
import { BUDGETS, PROJECT_TYPES, budgetLabel, typeLabel } from "@/data/inquiry";
import { archiveInquiry, assignInquiry, restoreInquiry, unassignInquiry, updateInquiryNote } from "@/app/dashboard/anfragen/actions";

export type InquiryRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  project_type: string;
  description: string;
  budget: string | null;
  status: "neu" | "in_bearbeitung" | "archiviert";
  assigned_to: string | null;
  note: string;
};

export type Assignee = { id: string; name: string; photo: string | null; accent: string };

export type InquiryEvent = {
  inquiry_id: string;
  actor_name: string;
  action: "zugewiesen" | "in_inbox" | "archiviert" | "wiederhergestellt" | "notiz";
  detail: string;
  created_at: string;
};

const fmt = new Intl.DateTimeFormat("de-CH", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Zurich" });
const fmtShort = new Intl.DateTimeFormat("de-CH", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Zurich" });

const eventText = (e: InquiryEvent) => {
  switch (e.action) {
    case "zugewiesen":
      return `${e.actor_name} hat ${e.detail || "jemandem"} zugewiesen`;
    case "in_inbox":
      return `${e.actor_name} hat in die Inbox zurückgelegt`;
    case "archiviert":
      return `${e.actor_name} hat archiviert`;
    case "wiederhergestellt":
      return `${e.actor_name} hat aus dem Archiv geholt`;
    case "notiz":
      return `${e.actor_name} hat die Notiz bearbeitet`;
    default:
      return e.actor_name;
  }
};

// Management-Board für Anfragen: Inbox → auf eine Person ziehen (oder per Auswahl
// zuweisen) → In Bearbeitung mit Notizfeld → Archivieren. Drag & Drop ist die
// schnelle Variante am Desktop, jede Aktion geht aber auch über einen Button,
// damit es am Handy und ohne Maus genauso funktioniert.
export default function InquiryBoard({
  rows,
  assignees,
  events,
}: {
  rows: InquiryRow[];
  assignees: Assignee[];
  events: InquiryEvent[];
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");

  const eventsById = useMemo(() => {
    const map = new Map<string, InquiryEvent[]>();
    for (const e of events) {
      const list = map.get(e.inquiry_id) ?? [];
      list.push(e);
      map.set(e.inquiry_id, list);
    }
    return map;
  }, [events]);

  const q = search.trim().toLowerCase();
  const filtered = rows.filter((r) => {
    if (type && r.project_type !== type) return false;
    if (budget && r.budget !== budget) return false;
    if (!q) return true;
    return [r.name, r.company ?? "", r.email, r.description].some((f) => f.toLowerCase().includes(q));
  });
  const filterActive = Boolean(q || type || budget);

  const inbox = filtered.filter((r) => r.status !== "archiviert" && !r.assigned_to);
  const inProgress = filtered.filter((r) => r.status !== "archiviert" && r.assigned_to);
  const archived = filtered.filter((r) => r.status === "archiviert");
  const byId = Object.fromEntries(assignees.map((a) => [a.id, a]));

  function onDropAssign(id: string, personId: string) {
    startTransition(() => assignInquiry(id, personId));
  }
  function onDropInbox(id: string) {
    startTransition(() => unassignInquiry(id));
  }
  function onDropArchive(id: string) {
    startTransition(() => archiveInquiry(id));
  }

  function dropHandlers(onDrop: (id: string) => void) {
    return {
      onDragOver: (e: React.DragEvent) => e.preventDefault(),
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain") || dragId;
        if (id) onDrop(id);
        setDragId(null);
      },
    };
  }

  function Card({ r }: { r: InquiryRow }) {
    const [note, setNote] = useState(r.note);
    const log = (eventsById.get(r.id) ?? []).slice(0, 3);
    return (
      <li
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", r.id);
          setDragId(r.id);
        }}
        onDragEnd={() => setDragId(null)}
        className={`dash-panel cursor-grab select-none active:cursor-grabbing ${dragId === r.id ? "opacity-40" : ""}`}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="font-medium">
              {r.name}
              {r.company && <span className="ml-2 text-muted">{r.company}</span>}
            </p>
            <a href={`mailto:${r.email}`} className="text-sm text-aqua hover:underline">{r.email}</a>
          </div>
          <p className="nums text-xs text-muted">{fmt.format(new Date(r.created_at))}</p>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
          <span className="rounded-full bg-raised px-2 py-0.5">{typeLabel(r.project_type)}</span>
          <span className="rounded-full bg-raised px-2 py-0.5">{budgetLabel(r.budget)}</span>
        </div>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{r.description}</p>

        {r.status === "in_bearbeitung" && (
          <div className="mt-3 border-t border-[#24272c] pt-3">
            <label htmlFor={`note-${r.id}`} className="dash-label">Notiz</label>
            <textarea
              id={`note-${r.id}`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={() => {
                if (note !== r.note) startTransition(() => updateInquiryNote(r.id, note));
              }}
              placeholder="Stand, nächste Schritte, Absprachen…"
              className="dash-input !min-h-[3.5rem] text-sm"
            />
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#24272c] pt-3 text-xs">
          {r.status === "archiviert" ? (
            <button
              type="button"
              onClick={() => startTransition(() => restoreInquiry(r.id, Boolean(r.assigned_to)))}
              className="dash-btn-quiet h-8 text-xs"
            >
              Zurück in Inbox
            </button>
          ) : (
            <>
              <label className="sr-only" htmlFor={`assign-${r.id}`}>Zuweisen</label>
              <select
                id={`assign-${r.id}`}
                value={r.assigned_to ?? ""}
                onChange={(e) => (e.target.value ? onDropAssign(r.id, e.target.value) : onDropInbox(r.id))}
                className="dash-input h-8 max-w-[11rem] py-0 text-xs"
              >
                <option value="">Nicht zugewiesen</option>
                {assignees.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <button type="button" onClick={() => onDropArchive(r.id)} className="dash-btn-quiet h-8 text-xs">
                Archivieren
              </button>
            </>
          )}
        </div>

        {log.length > 0 && (
          <ul className="mt-3 flex flex-col gap-1 border-t border-[#24272c] pt-3 text-[0.6875rem] text-muted">
            {log.map((e, i) => (
              <li key={i}>
                {eventText(e)} · {fmtShort.format(new Date(e.created_at))}
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  function Column({
    title,
    hint,
    count,
    zone,
    children,
  }: {
    title: string;
    hint: string;
    count: number;
    zone?: ReturnType<typeof dropHandlers>;
    children: React.ReactNode;
  }) {
    return (
      <div {...zone} className="flex min-w-0 flex-col gap-3 rounded-[14px] border border-[#1c1e22] p-3">
        <div className="px-1">
          <p className="flex items-center gap-2 font-sans text-sm font-medium tracking-normal">
            {title} <span className="nums text-xs font-normal text-muted">{count}</span>
          </p>
          <p className="dash-help mt-0.5">{hint}</p>
        </div>
        <ul className="flex min-h-[3rem] flex-col gap-3">{children}</ul>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="inq-search">Suchen</label>
        <input
          id="inq-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Name, Firma, E-Mail, Text…"
          className="dash-input h-9 max-w-[16rem] text-sm"
        />
        <label className="sr-only" htmlFor="inq-type">Art</label>
        <select id="inq-type" value={type} onChange={(e) => setType(e.target.value)} className="dash-input h-9 max-w-[12rem] text-sm">
          <option value="">Alle Arten</option>
          {PROJECT_TYPES.map((t) => (
            <option key={t.key} value={t.key}>{t.label}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="inq-budget">Budget</label>
        <select id="inq-budget" value={budget} onChange={(e) => setBudget(e.target.value)} className="dash-input h-9 max-w-[11rem] text-sm">
          <option value="">Alle Budgets</option>
          {BUDGETS.map((b) => (
            <option key={b.key} value={b.key}>{b.label}</option>
          ))}
        </select>
        {filterActive && (
          <button type="button" onClick={() => { setSearch(""); setType(""); setBudget(""); }} className="dash-btn-quiet h-9 text-xs">
            Filter zurücksetzen
          </button>
        )}
        {filterActive && <p className="dash-help">{filtered.length} von {rows.length} Anfragen</p>}
      </div>

      <div className={`mt-4 grid gap-4 lg:grid-cols-3 ${pending ? "opacity-80" : ""}`}>
        <Column title="Inbox" hint="Neu, noch niemandem zugewiesen." count={inbox.length} zone={dropHandlers(onDropInbox)}>
          {inbox.length === 0 && <p className="dash-help px-1">Nichts Offenes.</p>}
          {inbox.map((r) => <Card key={r.id} r={r} />)}
        </Column>

        <div className="flex min-w-0 flex-col gap-3 rounded-[14px] border border-[#1c1e22] p-3">
          <div className="px-1">
            <p className="flex items-center gap-2 font-sans text-sm font-medium tracking-normal">
              In Bearbeitung <span className="nums text-xs font-normal text-muted">{inProgress.length}</span>
            </p>
            <p className="dash-help mt-0.5">Eine Karte auf eine Person unten ziehen weist sie zu.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {assignees.map((a) => (
              <div
                key={a.id}
                {...dropHandlers((id) => onDropAssign(id, a.id))}
                className={`flex items-center gap-2 rounded-full border border-dashed px-2.5 py-1.5 text-xs transition-colors ${
                  dragId ? "border-aqua/60 bg-aqua/5" : "border-[#2a2d32]"
                }`}
              >
                <div className="h-5 w-5 shrink-0 overflow-hidden rounded-full">
                  <Portrait name={a.name} photo={a.photo ?? undefined} accent={a.accent} className="!aspect-square" />
                </div>
                {a.name}
              </div>
            ))}
          </div>

          <ul className="flex min-h-[3rem] flex-col gap-4">
            {inProgress.length === 0 && <p className="dash-help px-1">Niemand arbeitet gerade an etwas.</p>}
            {assignees
              .filter((a) => inProgress.some((r) => r.assigned_to === a.id))
              .map((a) => (
                <li key={a.id}>
                  <p className="mb-2 flex items-center gap-2 px-1 text-xs text-muted">
                    <div className="h-4 w-4 shrink-0 overflow-hidden rounded-full">
                      <Portrait name={a.name} photo={a.photo ?? undefined} accent={a.accent} className="!aspect-square" />
                    </div>
                    {a.name}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {inProgress.filter((r) => r.assigned_to === a.id).map((r) => <Card key={r.id} r={r} />)}
                  </ul>
                </li>
              ))}
            {inProgress.some((r) => !byId[r.assigned_to ?? ""]) && (
              <li>
                <p className="mb-2 px-1 text-xs text-muted">Unbekannt zugewiesen</p>
                <ul className="flex flex-col gap-3">
                  {inProgress.filter((r) => !byId[r.assigned_to ?? ""]).map((r) => <Card key={r.id} r={r} />)}
                </ul>
              </li>
            )}
          </ul>
        </div>

        <Column title="Archiviert" hint="Erledigt oder nicht mehr relevant." count={archived.length} zone={dropHandlers(onDropArchive)}>
          {archived.length === 0 && <p className="dash-help px-1">Noch nichts archiviert.</p>}
          {archived.map((r) => <Card key={r.id} r={r} />)}
        </Column>
      </div>
    </>
  );
}
