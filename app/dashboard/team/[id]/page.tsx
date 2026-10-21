import Link from "next/link";
import { notFound } from "next/navigation";
import ProfileForm from "@/components/dashboard/ProfileForm";
import { projects } from "@/data/projects";
import { FULL_COLUMNS, requireAdmin, toProfile } from "@/lib/session";
import { deleteMember, saveMember } from "../../actions";

export default async function EditMemberPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ neu?: string; fehler?: string }>;
}) {
  const { supabase, me } = await requireAdmin();
  const { id } = await params;
  const { neu, fehler } = await searchParams;
  const [{ data: row }, { data: members }] = await Promise.all([
    supabase.from("profiles").select(FULL_COLUMNS).eq("id", id).maybeSingle(),
    supabase.from("project_members").select("profile_id, project_slug, role").eq("profile_id", id),
  ]);
  if (!row) notFound();
  const profile = toProfile(row as Parameters<typeof toProfile>[0], members ?? []);
  const isMe = profile.id === me.id;

  return (
    <div className="max-w-[72rem]">
      <Link href="/dashboard/team" className="text-muted transition-colors hover:text-ink">
        Team verwalten
      </Link>
      <h1 className="mt-2 font-sans text-2xl font-medium tracking-normal">{profile.name}</h1>
      {neu && (
        <p role="status" className="mt-2 text-sm">
          Angelegt. Ergänze Projekte und hake «Auf der Teamseite zeigen» an, wenn alles stimmt.
        </p>
      )}
      {fehler === "selbst" && (
        <p role="alert" className="mt-2 text-sm text-danger">Dein eigenes Profil kannst du nicht löschen.</p>
      )}

      <div className="mt-8">
        <ProfileForm
          profile={profile}
          action={saveMember}
          admin
          projects={projects.map((p) => ({ slug: p.slug, title: p.title }))}
        />
      </div>

      {!isMe && (
        <section aria-labelledby="danger-title" className="mt-12 border-t border-[#24272c] pt-8">
          <h2 id="danger-title" className="font-sans text-base font-medium tracking-normal">Profil löschen</h2>
          <p className="dash-help mt-1 max-w-[36rem]">
            Entfernt {profile.name} von der Teamseite und aus allen Projekten. Das lässt sich nicht rückgängig machen.
          </p>
          <details className="mt-4">
            <summary className="dash-btn-quiet cursor-pointer list-none text-danger">Löschen …</summary>
            <form action={deleteMember} className="mt-3 flex flex-wrap items-center gap-3">
              <input type="hidden" name="id" value={profile.id} />
              <p className="text-sm">{profile.name} wirklich löschen?</p>
              <button type="submit" className="dash-btn bg-danger text-bg hover:bg-[#ffa395]">
                Ja, {profile.name} löschen
              </button>
            </form>
          </details>
        </section>
      )}
    </div>
  );
}
