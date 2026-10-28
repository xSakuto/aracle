import Link from "next/link";
import NewProject from "@/components/dashboard/projects/NewProject";
import { getProjectRows, mergeProjects } from "@/lib/projects";
import { requireMember } from "@/lib/session";
import { redirect } from "next/navigation";

const fmt = new Intl.DateTimeFormat("de-CH", { dateStyle: "medium", timeZone: "Europe/Zurich" });

// Übersicht im Dashboard: mit der Berechtigung "projekte" alle Projekte,
// sonst nur die eigenen (dort darf man den Changelog führen).
export default async function ProjectsAdminPage() {
  const { supabase, me } = await requireMember();
  if (!me) redirect("/dashboard");
  const canEdit = me.is_admin || me.permissions.includes("projekte");

  const rows = await getProjectRows();
  const all = mergeProjects(rows.map((r) => ({ ...r, hidden: false })));
  const hidden = new Set(rows.filter((r) => r.hidden).map((r) => r.slug));
  const edited = new Map(rows.map((r) => [r.slug, r.updated_at]));
  const mine = new Set(me.projects.map((p) => p.slug));
  const list = canEdit ? all : all.filter((p) => mine.has(p.slug));

  const { data: counts, error } = await supabase.from("project_updates").select("project_slug");
  const missing = Boolean(error);
  const updateCount = (counts ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.project_slug] = (acc[r.project_slug] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-[72rem]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-medium tracking-normal">Projekte</h1>
          <p className="mt-1 text-muted">
            {canEdit
              ? "Texte, Bilder und Status der Projekte pflegen und den Changelog führen."
              : "Für deine Projekte kannst du hier den Changelog führen."}
          </p>
        </div>
        {canEdit && !missing && <NewProject />}
      </div>

      {missing && (
        <div className="dash-panel mt-8">
          <p className="font-medium">Datenbank noch nicht vorbereitet</p>
          <p className="dash-help mt-1">
            Führ <code>supabase/2026-10-projects.sql</code> einmal im Supabase SQL-Editor aus. Bis dahin zeigt die Website die Projekte aus dem Code.
          </p>
        </div>
      )}

      {list.length === 0 ? (
        <div className="dash-panel mt-8">
          <p className="font-medium">Noch keinem Projekt zugeordnet</p>
          <p className="dash-help mt-1">Sobald dich Joel einem Projekt zuordnet, kannst du hier Einträge schreiben.</p>
        </div>
      ) : (
        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {list.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/dashboard/projekte/${p.slug}`}
                className="dash-panel flex items-center gap-4 transition-colors hover:bg-[#161f25]"
              >
                <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[8px] bg-raised">
                  {p.mark ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.mark} alt="" width={44} height={44} className="max-h-8 max-w-8 bg-transparent object-contain" />
                  ) : (
                    <span className="text-xs font-semibold text-muted">{p.title.slice(0, 2)}</span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{p.title}</span>
                  <span className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-muted">
                    <span className={p.status === "Aktiv" ? "text-aqua" : ""}>{p.status}</span>
                    <span className="nums">{updateCount[p.slug] ?? 0} Einträge</span>
                    {edited.has(p.slug) && <span>bearbeitet {fmt.format(new Date(edited.get(p.slug)!))}</span>}
                    {hidden.has(p.slug) && <span className="text-[#d9a441]">versteckt</span>}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
