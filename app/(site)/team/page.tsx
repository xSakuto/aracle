import TeamDirectory from "@/components/TeamDirectory";
import CtaBand from "@/components/CtaBand";
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
    <>
      <div className="wrap pb-[var(--section)] pt-28 md:pt-36">
        <div className="inner">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="kicker text-aqua" data-rise>Team</p>
              <h1 className="mega mt-5" data-split="load">The people.</h1>
            </div>
            <p className="text-ink/80 md:col-span-4" data-rise style={{ ["--i" as string]: 2 }}>
              Ein kleines Studio aus dem Glarnerland. Jede und jeder führt eigene
              Bereiche und packt dort mit an, wo es gerade nötig ist.
            </p>
          </div>
          <TeamDirectory
            members={team}
            projects={projects.map((p) => ({ slug: p.slug, title: p.title }))}
          />
        </div>
      </div>
      <CtaBand
        title="Du willst mitmachen?"
        text="Du kannst etwas richtig gut, Video, Design, Code oder Community, und hast Lust auf echte Projekte? Schreib uns."
        action="Bewerbung schicken"
      />
    </>
  );
}
