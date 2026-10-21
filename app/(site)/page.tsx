import Intro from "@/components/home/Intro";
import Marquee from "@/components/home/Marquee";
import Manifesto from "@/components/home/Manifesto";
import BrandRun from "@/components/home/BrandRun";
import Services from "@/components/home/Services";
import TeamDeck from "@/components/home/TeamDeck";
import Numbers from "@/components/home/Numbers";
import Outro from "@/components/home/Outro";
import { projects } from "@/data/projects";
import { getTeam } from "@/lib/team";

// Team kommt aus der Datenbank; alle 60 Sekunden frisch.
export const revalidate = 60;

const H = "/Brand_assets/images/heros";

const services = [
  { name: "Video & Drohne", desc: "Social-Clips, Imagefilme und Luftaufnahmen mit eigener Drohne. Geplant, gedreht und geschnitten im Haus.", src: "/Brand_assets/arcl-header.jpg" },
  { name: "Design & Branding", desc: "Logo, Farben, Schrift und alles, was eine Marke wiedererkennbar macht.", src: `${H}/joel.jpg` },
  { name: "Web", desc: "Schnelle Websites und Web-Apps, sauber gebaut und einfach zu pflegen. Wie diese hier.", src: `${H}/cloudhosting.jpg` },
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
        items={[
          { title: "Highside", line: "Schweizer Bikerstreetwear, gemacht für die Kurve.", meta: "Fashion, seit 2024", href: "/projekte/highside", tone: "glow" },
          { title: "Aracle Living", line: "Immobilien im besten Licht: Fotos, 360°-Touren, Luftbilder.", meta: "Fotografie, 2025", href: "/living", src: `${H}/immo.jpg`, alt: "Wohnzimmer mit Holzdecke, Stufen und Essbereich" },
          { title: "Aracle Cloud", line: "Hosting auf eigenen Servern, mitten im Glarnerland.", meta: "Infrastruktur, seit 2022", href: "/hosting", src: `${H}/cloudhosting.jpg`, alt: "Serverraum mit Racks und Arbeitsplatz" },
          { title: "Swizzly", line: "Motorrad-Content auf TikTok und Instagram.", meta: "Content, seit 2024", href: "/projekte/swizzly", tone: "slate" },
          { title: "Zelda DE", line: "Die grösste deutsche Zelda-Community auf Discord.", meta: "Community, seit 2022", href: "/projekte/zelda-de-server", tone: "glacier" },
          { title: "All the Clients", line: "Vanilla+ Minecraft-Modpack auf Modrinth.", meta: "Gaming, seit 2023", href: "/projekte/all-the-clients", tone: "slate" },
        ]}
      />
      <Services items={services} />
      <TeamDeck members={team} />
      <Numbers people={team.length} projects={projects.length} />
      <Marquee reverse />
      <Outro />
    </>
  );
}
