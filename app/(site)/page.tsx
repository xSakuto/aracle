import Hero from "@/components/home/Hero";
import BrandTiles from "@/components/home/BrandTiles";
import Services from "@/components/home/Services";
import TeamStrip from "@/components/home/TeamStrip";
import Facts from "@/components/home/Facts";
import ContactTile from "@/components/home/ContactTile";
import { projects } from "@/data/projects";
import { getTeam } from "@/lib/team";

// Team kommt aus der Datenbank; alle 60 Sekunden frisch.
export const revalidate = 60;

const H = "/Brand_assets/images/heros";

export default async function Home() {
  const team = await getTeam();
  return (
    <>
      <Hero />
      <BrandTiles
        big={{
          title: "Highside",
          tagline: "Schweizer Bikerstreetwear. Gemacht für die Kurve.",
          href: "/projekte/highside",
          cta: "Zusammenarbeiten",
          src: `${H}/highside.jpg`,
          alt: "Zwei Motorräder in Schräglage auf der Rennstrecke",
        }}
        halves={[
          {
            title: "Aracle Living",
            tagline: "Immobilien im besten Licht.",
            href: "/living",
            cta: "Objekt anfragen",
            src: `${H}/immo.jpg`,
            alt: "Wohnzimmer mit Holzdecke, Stufen und Essbereich",
          },
          {
            title: "Aracle Cloud",
            tagline: "Hosting auf eigenen Servern.",
            href: "/hosting",
            cta: "Hosting anfragen",
            src: `${H}/cloudhosting.jpg`,
            alt: "Serverraum mit Racks und Arbeitsplatz",
          },
        ]}
      />
      <Services />
      <TeamStrip members={team} />
      <Facts people={team.length} projects={projects.length} />
      <ContactTile />
    </>
  );
}
