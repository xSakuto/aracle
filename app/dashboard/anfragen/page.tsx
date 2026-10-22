import { budgetLabel, typeLabel } from "@/data/inquiry";
import { requireAdmin } from "@/lib/session";
import { setInquiryStatus } from "./actions";

const statusLabel: Record<string, string> = { neu: "Neu", in_bearbeitung: "In Bearbeitung", erledigt: "Erledigt" };

type Row = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  project_type: string;
  description: string;
  budget: string | null;
  status: string;
};

export default async function InquiriesPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("inquiries")
    .select("id, created_at, name, email, company, project_type, description, budget, status")
    .order("created_at", { ascending: false })
    .limit(200);
  const rows = (data ?? []) as Row[];
  const fmt = new Intl.DateTimeFormat("de-CH", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Zurich" });
  const open = rows.filter((r) => r.status !== "erledigt").length;

  return (
    <div className="max-w-[72rem]">
      <h1 className="font-sans text-2xl font-medium tracking-normal">Anfragen</h1>
      <p className="mt-1 text-muted">
        {rows.length} Anfragen, davon {open} offen.
      </p>
      {error && <p role="alert" className="mt-4 text-sm text-danger">Anfragen konnten nicht geladen werden: {error.message}</p>}

      {rows.length === 0 && !error ? (
        <div className="dash-panel mt-8">
          <p className="font-medium">Noch keine Anfragen</p>
          <p className="dash-help mt-1">Sobald jemand das Formular auf /kontakt absendet, erscheint die Anfrage hier.</p>
        </div>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {rows.map((r) => (
            <li key={r.id} className="dash-panel">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {r.name}
                    {r.company && <span className="ml-2 text-muted">{r.company}</span>}
                  </p>
                  <a href={`mailto:${r.email}`} className="text-sm text-aqua hover:underline">{r.email}</a>
                </div>
                <p className="nums text-xs text-muted">{fmt.format(new Date(r.created_at))}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-raised px-2.5 py-1">{typeLabel(r.project_type)}</span>
                <span className="rounded-full bg-raised px-2.5 py-1">{budgetLabel(r.budget)}</span>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{r.description}</p>
              <form action={setInquiryStatus} className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#24272c] pt-3">
                <input type="hidden" name="id" value={r.id} />
                <span className="text-xs text-muted">Status: {statusLabel[r.status] ?? r.status}</span>
                {Object.keys(statusLabel)
                  .filter((s) => s !== r.status)
                  .map((s) => (
                    <button key={s} type="submit" name="status" value={s} className="dash-btn-quiet h-8 text-xs">
                      {statusLabel[s]}
                    </button>
                  ))}
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
