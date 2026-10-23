import Link from "next/link";
import { signOut } from "@/app/(site)/login/actions";
import Portrait from "@/components/Portrait";
import DashNav from "@/components/dashboard/DashNav";
import { requireMember } from "@/lib/session";

export const metadata = {
  title: "Team-Bereich",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, me } = await requireMember();

  return (
    <div className="min-h-svh text-[0.875rem] tracking-normal md:grid md:grid-cols-[15rem_1fr]">
      <aside className="flex flex-col border-[#1c1e22] px-3 py-5 md:sticky md:top-0 md:h-svh md:border-r">
        <Link href="/dashboard" className="flex items-baseline gap-2 px-3 transition-opacity hover:opacity-80">
          <span className="font-display text-xl">Aracle</span>
          <span className="text-muted">Team</span>
        </Link>

        <DashNav admin={Boolean(me?.is_admin)} />
        <form action={signOut} className="mt-1 md:hidden">
          <button type="submit" className="flex h-8 items-center rounded-[6px] px-3 text-muted hover:text-ink">
            Abmelden
          </button>
        </form>

        <div className="mt-auto hidden md:block">
          <Link
            href="/"
            className="flex h-8 items-center rounded-[6px] px-3 text-muted transition-colors hover:bg-[#1c1e22] hover:text-ink"
          >
            Zur Website
          </Link>
          <div className="mt-3 flex items-center gap-3 px-3">
            <div className="w-8 shrink-0 overflow-hidden rounded-full">
              <Portrait name={me?.name ?? user.email ?? "?"} photo={me?.photo_url ?? undefined} accent={me?.accent ?? "#00ffff"} className="!aspect-square" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{me?.name ?? "Ohne Profil"}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
          </div>
          <form action={signOut} className="mt-2 px-1">
            <button type="submit" className="flex h-8 w-full items-center rounded-[6px] px-2 text-muted transition-colors hover:bg-[#1c1e22] hover:text-ink">
              Abmelden
            </button>
          </form>
        </div>
      </aside>

      <main id="inhalt" className="px-4 pb-16 pt-6 md:px-10 md:pt-9">{children}</main>
    </div>
  );
}
