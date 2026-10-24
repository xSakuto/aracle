import { signOut } from "@/app/(site)/login/actions";
import Overview from "@/components/dashboard/Overview";
import ProfileForm from "@/components/dashboard/ProfileForm";
import SocialIcon from "@/components/SocialIcon";
import { projects } from "@/data/projects";
import { requireMember } from "@/lib/session";
import { linkDiscord, saveOwnProfile, unlinkDiscord } from "./actions";

const discordErrors: Record<string, string> = {
  "discord-link": "Discord-Verknüpfung hat nicht geklappt. Versuch es nochmal.",
  "discord-manual":
    "Verknüpfen ist in Supabase noch nicht aktiviert (Authentication → Settings → \"Allow manual linking\").",
  "discord-unlink": "Trennen hat nicht geklappt. Versuch es nochmal.",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ fehler?: string }>;
}) {
  const { user, me } = await requireMember();
  const { fehler } = await searchParams;
  const discordIdentity = user.identities?.find((i) => i.provider === "discord");

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
        <Overview me={me} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-[#1c1e22] p-5">
        <div className="flex items-center gap-3">
          <SocialIcon type="discord" className="h-6 w-6 shrink-0 text-[#5865F2]" />
          <div>
            <p className="font-medium">Discord-Login</p>
            <p className="text-sm text-muted">
              {discordIdentity
                ? `Verknüpft${me.discord_username ? ` als ${me.discord_username}` : ""}. Du kannst dich auch mit Discord einloggen.`
                : "Noch nicht verknüpft. Danach kannst du dich auch direkt mit Discord einloggen."}
            </p>
          </div>
        </div>
        {discordIdentity ? (
          <form action={unlinkDiscord}>
            <button type="submit" className="dash-btn-quiet">Trennen</button>
          </form>
        ) : (
          <form action={linkDiscord}>
            <button type="submit" className="dash-btn-quiet">Verknüpfen</button>
          </form>
        )}
      </div>
      {fehler && discordErrors[fehler] && (
        <p role="alert" className="small mt-3 text-danger">{discordErrors[fehler]}</p>
      )}

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
