import Link from "next/link";
import AddMember from "@/components/dashboard/AddMember";
import Portrait from "@/components/Portrait";
import { projects } from "@/data/projects";
import { FULL_COLUMNS, requireAdmin, toProfile, type FullProfile } from "@/lib/session";

export default async function TeamAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ geloescht?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { geloescht } = await searchParams;
  const [{ data: rows }, { data: members }] = await Promise.all([
    supabase.from("profiles").select(FULL_COLUMNS).order("is_lead", { ascending: false }).order("sort").order("name"),
    supabase.from("project_members").select("profile_id, project_slug, role"),
  ]);
  const team: FullProfile[] = (rows ?? []).map((r) => toProfile(r as Parameters<typeof toProfile>[0], members ?? []));
  const titleOf = Object.fromEntries(projects.map((p) => [p.slug, p.title]));

  return (
    <div className="max-w-[72rem]">
      <h1 className="font-sans text-2xl font-medium tracking-normal">Team verwalten</h1>
      <p className="mt-1 text-muted">
        {team.length} Profile, {team.filter((m) => m.visible).length} davon auf der Website sichtbar.
      </p>
      {geloescht && <p role="status" className="mt-4 text-sm">Profil gelöscht.</p>}

      <section aria-labelledby="add-title" className="mt-8">
        <h2 id="add-title" className="mb-3 font-sans text-base font-medium tracking-normal">Neues Mitglied</h2>
        <AddMember />
      </section>

      <section aria-labelledby="list-title" className="mt-10">
        <h2 id="list-title" className="mb-3 font-sans text-base font-medium tracking-normal">Alle Profile</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#24272c] text-xs text-muted">
                <th scope="col" className="py-2 pr-4 font-normal">Person</th>
                <th scope="col" className="py-2 pr-4 font-normal">Projekte</th>
                <th scope="col" className="py-2 pr-4 font-normal">Login</th>
                <th scope="col" className="py-2 pr-4 font-normal">Website</th>
                <th scope="col" className="py-2 font-normal"><span className="sr-only">Aktion</span></th>
              </tr>
            </thead>
            <tbody>
              {team.map((m) => (
                <tr key={m.id} className="border-b border-[#1c1e22] transition-colors hover:bg-[#121316]">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 shrink-0 overflow-hidden rounded-full">
                        <Portrait name={m.name} photo={m.photo_url ?? undefined} accent={m.accent} className="!aspect-square" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {m.name}
                          {m.is_admin && <span className="ml-2 text-xs font-normal text-muted">Admin</span>}
                        </p>
                        <p className="text-xs text-muted">{m.role || "Ohne Rolle"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    {m.projects.length ? (
                      <span>{m.projects.map((p) => titleOf[p.slug] ?? p.slug).join(", ")}</span>
                    ) : (
                      <span className="text-muted">–</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    {m.user_id ? (
                      <span>Aktiv</span>
                    ) : m.email ? (
                      <span className="text-muted">Eingeladen</span>
                    ) : (
                      <span className="text-muted">Keine E-Mail</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">{m.visible ? "Sichtbar" : <span className="text-muted">Versteckt</span>}</td>
                  <td className="py-3 text-right">
                    <Link href={`/dashboard/team/${m.id}`} className="dash-btn-quiet h-8">
                      Bearbeiten
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
