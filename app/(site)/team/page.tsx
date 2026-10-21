import Link from "next/link";
import TeamDirectory from "@/components/TeamDirectory";
import { projects } from "@/data/projects";
import { getTeam } from "@/lib/team";

export const revalidate = 60;

export const metadata = {
  title: "Team · Aracle",
  description: "Die Leute hinter Aracle und woran sie arbeiten.",
};

export default async function TeamPage() {
  const team = await getTeam();
  return (
    <div className="wrap pb-[var(--section)] pt-32 md:pt-40">
      <h1 className="display" data-rise>
        Das Team
      </h1>
      <p className="lead mt-8 max-w-[40rem]" data-rise style={{ ["--i" as string]: 1 }}>
        Ein kleines Studio aus Glarus. Jede und jeder führt eigene Bereiche und
        Projekte, und alle packen dort mit an, wo es gerade brennt.
      </p>

      <TeamDirectory
        members={team}
        projects={projects.map((p) => ({ slug: p.slug, title: p.title }))}
      />

      <section
        aria-labelledby="join-title"
        className="mt-[var(--section)] grid grid-cols-12 gap-x-8 gap-y-6 bg-field px-[var(--margin)] py-16 md:-mx-[var(--margin)] md:py-24"
      >
        <h2 id="join-title" className="head col-span-12 md:col-span-6">
          Du willst mitmachen?
        </h2>
        <div className="col-span-12 md:col-span-5 md:col-start-8">
          <p>
            Du kannst etwas richtig gut, Video, Design, Code oder Community, und
            hast Lust auf echte Projekte? Schreib uns, was du machst.
          </p>
          <Link href="/kontakt" className="btn mt-8">
            Bewerbung schicken
          </Link>
        </div>
      </section>
    </div>
  );
}
