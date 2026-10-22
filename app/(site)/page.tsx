import Intro from "@/components/home/Intro";
import Manifesto from "@/components/home/Manifesto";
import BrandRun from "@/components/home/BrandRun";
import Services from "@/components/home/Services";
import TeamDeck from "@/components/home/TeamDeck";
import Numbers from "@/components/home/Numbers";
import Outro from "@/components/home/Outro";
import AlpineLines from "@/components/alpine/AlpineLines";
import { featuredProjects, projects } from "@/data/projects";
import { getTeam } from "@/lib/team";

// Team kommt aus der Datenbank; alle 60 Sekunden frisch.
export const revalidate = 60;

export default async function Home() {
  const team = await getTeam();
  return (
    <>
      <Intro />
      <Manifesto />
      <BrandRun items={featuredProjects} total={projects.length} />
      <AlpineLines height={110} layers={3} seed={19} draw="scroll" className="opacity-60" />
      <Services />
      <TeamDeck members={team} />
      <Numbers people={team.length} projects={projects.length} />
      <Outro />
    </>
  );
}
