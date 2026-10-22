import Manifesto from "@/components/home/Manifesto";
import BrandRun from "@/components/home/BrandRun";
import Services from "@/components/home/Services";
import TeamDeck from "@/components/home/TeamDeck";
import Numbers from "@/components/home/Numbers";
import Outro from "@/components/home/Outro";
import { featuredProjects, projects } from "@/data/projects";
import { getTeam } from "@/lib/team";

// Startseite unterhalb des Heros, geteilt zwischen Startseite und Hero-Vorschauen.
export default async function HomeBody() {
  const team = await getTeam();
  return (
    <>
      <Manifesto />
      <BrandRun items={featuredProjects} total={projects.length} />
      <Services />
      <TeamDeck members={team} />
      <Numbers people={team.length} projects={projects.length} />
      <Outro />
    </>
  );
}
