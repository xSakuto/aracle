import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { supabaseConfigured } from "@/lib/supabase/config";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Team-Login · Aracle",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ weiter?: string; fehler?: string }>;
}) {
  const { weiter, fehler } = await searchParams;
  const next = weiter?.startsWith("/dashboard") ? weiter : "/dashboard";

  if (supabaseConfigured) {
    const supabase = await createSessionClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect(next);
  }

  return (
    <div data-shape="word" className="wrap pb-16 pt-28">
    <div className="inner grid min-h-[70svh] grid-cols-12 items-center gap-x-3 md:gap-x-8 gap-y-12">
      <div className="col-span-12 md:col-span-6">
        <h1 className="display" data-split="load">
          Team-Login
        </h1>
        <p className="lead mt-5 max-w-[30rem] text-muted" data-rise style={{ ["--i" as string]: 1 }}>
          Für alle im Aracle-Team: Profil, Foto und Social-Links selbst pflegen.
          Kein Passwort nötig, du bekommst einen Code per E-Mail.
        </p>
      </div>
      <div className="col-span-12 md:col-span-5 md:col-start-8" data-rise style={{ ["--i" as string]: 2 }}>
        <div className="tile p-8">
          {supabaseConfigured ? (
            <LoginForm next={next} linkError={fehler === "link"} />
          ) : (
            <p>
              Der Login ist noch nicht eingerichtet: Es fehlen die
              Supabase-Zugangsdaten in den Umgebungsvariablen.
            </p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
