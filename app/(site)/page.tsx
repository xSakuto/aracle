import Intro from "@/components/home/Intro";
import Marquee from "@/components/home/Marquee";
import Manifesto from "@/components/home/Manifesto";
import BrandRun from "@/components/home/BrandRun";
import ServiceFlood from "@/components/home/ServiceFlood";
import TeamDeck from "@/components/home/TeamDeck";
import Numbers from "@/components/home/Numbers";
import Outro from "@/components/home/Outro";
import { projects } from "@/data/projects";
import { getTeam } from "@/lib/team";

// Team kommt aus der Datenbank; alle 60 Sekunden frisch.
export const revalidate = 60;

const H = "/Brand_assets/images/heros";

const services = [
  { name: "Video", desc: "Social-Clips, Imagefilme und Luftaufnahmen mit eigener Drohne. Geplant, gedreht und geschnitten im Haus.", src: "/Brand_assets/arcl-header.jpg" },
  { name: "Design", desc: "Logo, Farben, Schrift und alles, was eine Marke wiedererkennbar macht. Erprobt an Highside.", src: `${H}/highside.jpg` },
  { name: "Web", desc: "Schnelle Websites und Web-Apps, sauber gebaut und einfach zu pflegen. Wie diese hier.", src: `${H}/joel.jpg` },
  { name: "Hosting", desc: "Auf eigenen Servern in der Schweiz. Updates, Backups und Monitoring inklusive.", src: `${H}/cloudhosting.jpg` },
  { name: "Immobilien", desc: "Fotos, 360°-Rundgänge und Luftbilder für die Vermarktung, mit Aracle Living.", src: `${H}/immo.jpg` },
];

export default async function Home() {
  const team = await getTeam();
  return (
    <>
      <Intro />
      <Marquee />
      <Manifesto />
      <BrandRun
        total={projects.length}
        brands={[
          { title: "Highside", line: "Schweizer Bikerstreetwear. Gemacht für die Kurve.", href: "/projekte/highside", src: `${H}/highside.jpg`, alt: "Zwei Motorräder in Schräglage auf der Rennstrecke" },
          { title: "Living", line: "Immobilien im besten Licht: Fotos, 360°-Touren, Luftbilder.", href: "/living", src: `${H}/immo.jpg`, alt: "Wohnzimmer mit Holzdecke, Stufen und Essbereich" },
          { title: "Cloud", line: "Hosting auf eigenen Servern, mitten in den Alpen.", href: "/hosting", src: `${H}/cloudhosting.jpg`, alt: "Serverraum mit Racks und Arbeitsplatz" },
        ]}
      />
      <ServiceFlood items={services} />
      <TeamDeck members={team} />
      <Marquee reverse tilt={2} />
      <Numbers people={team.length} projects={projects.length} />
      <Outro />
    </>
  );
}
