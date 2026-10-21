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
      <div data-shape="helix" className="wrap pb-[var(--section)] pt-28 md:pt-36">
        <div className="inner">
          <div className="text-center">
            <h1 className="display" data-split="load">
              Das Team.
            </h1>
            <p className="lead mx-auto mt-5 max-w-[36rem] text-muted" data-rise style={{ ["--i" as string]: 1 }}>
              Ein kleines Studio aus Glarus. Jede und jeder führt eigene Bereiche,
              und alle packen dort mit an, wo es gerade brennt.
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
