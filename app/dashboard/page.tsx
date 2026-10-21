import { signOut } from "@/app/(site)/login/actions";
import ProfileForm from "@/components/dashboard/ProfileForm";
import { projects } from "@/data/projects";
import { requireMember } from "@/lib/session";
import { saveOwnProfile } from "./actions";

export default async function DashboardPage() {
  const { user, me } = await requireMember();

  if (!me) {
    return (
      <div className="max-w-[36rem]">
        <h1 className="font-sans text-2xl font-medium tracking-normal">Kein Profil verknüpft</h1>
        <p className="mt-3">
          Du bist als {user.email} eingeloggt, aber diese Adresse ist keinem
          Teamprofil zugeordnet. Bitte Joel, sie in deinem Profil einzutragen.
        </p>
        <form action={signOut} className="mt-6">
          <button type="submit" className="dash-btn-quiet">Abmelden</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-[72rem]">
      <h1 className="font-sans text-2xl font-medium tracking-normal">Mein Profil</h1>
      <p className="mt-1 text-muted">
        Änderungen sind nach dem Speichern innert einer Minute auf der Teamseite sichtbar.
      </p>
      <div className="mt-8">
        <ProfileForm
          profile={me}
          action={saveOwnProfile}
          projects={projects.map((p) => ({ slug: p.slug, title: p.title }))}
        />
      </div>
    </div>
  );
}
