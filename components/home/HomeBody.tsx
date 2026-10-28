import Manifesto from "@/components/home/Manifesto";
import BrandRun from "@/components/home/BrandRun";
import WorkGrid from "@/components/home/WorkGrid";
import TeamDeck from "@/components/home/TeamDeck";
import Numbers from "@/components/home/Numbers";
import Outro from "@/components/home/Outro";
import { getProjects } from "@/lib/projects";
import { getTeam } from "@/lib/team";

// Startseite unterhalb des Heros, geteilt zwischen Startseite und Hero-Vorschauen.
export default async function HomeBody() {
  const [team, projects] = await Promise.all([getTeam(), getProjects()]);
  const featuredProjects = projects.filter((p) => p.featured);
  return (
    <>
      <Manifesto />
      <BrandRun items={featuredProjects} total={projects.length} />
      <WorkGrid items={projects.filter((p) => !p.featured)} total={projects.length} />
      <TeamDeck members={team} />
      <Numbers people={team.length} projects={projects.length} />
      <Outro />
    </>
  );
}
