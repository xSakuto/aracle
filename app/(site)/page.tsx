import HeroReel from "@/components/home/HeroReel";
import WorkSeam from "@/components/home/WorkSeam";
import TeamPass from "@/components/home/TeamPass";
import StoryPass from "@/components/home/StoryPass";
import ServiceList from "@/components/home/ServiceList";
import VisitCard from "@/components/home/VisitCard";
import { getTeam } from "@/lib/team";

// Team kommt aus der Datenbank; alle 60 Sekunden frisch.
export const revalidate = 60;

const H = "/Brand_assets/images/heros";

const frames = [
  { src: "/Brand_assets/arcl-header.jpg", alt: "Klöntalersee im Kanton Glarus", caption: "Klöntalersee, Glarus" },
  { src: `${H}/highside.jpg`, alt: "Zwei Motorräder in Schräglage auf der Rennstrecke", caption: "Highside, Bikerstreetwear" },
  { src: `${H}/immo.jpg`, alt: "Wohnzimmer mit Holzdecke und Essbereich", caption: "Aracle Living, Immobilien" },
  { src: `${H}/cloudhosting.jpg`, alt: "Serverraum mit Racks und Arbeitsplatz", caption: "Aracle Cloud, eigene Server" },
];

const brands = [
  {
    slug: "highside",
    href: "/projekte/highside",
    title: "Highside",
    line: "Schweizer Bikerstreetwear, seit 2024",
    src: `${H}/highside.jpg`,
    alt: "Zwei Motorräder in Schräglage auf der Rennstrecke",
    detail: "62% 45%",
  },
  {
    slug: "living",
    href: "/living",
    title: "Living",
    line: "Immobilienfotografie und 360°-Touren, in Planung",
    src: `${H}/immo.jpg`,
    alt: "Wohnzimmer mit Holzdecke und Essbereich",
    detail: "70% 40%",
  },
  {
    slug: "cloud",
    href: "/hosting",
    title: "Cloud",
    line: "Hosting auf eigenen Servern, seit 2022",
    src: `${H}/cloudhosting.jpg`,
    alt: "Serverraum mit Racks und Arbeitsplatz",
    detail: "80% 50%",
  },
];

const services = [
  {
    name: "Video & Drohne",
    scope: "Konzept bis Schnitt",
    desc: "Social-Clips, Imagefilme und Luftaufnahmen. Wir planen, drehen und schneiden selbst, mit eigener Kamera- und Drohnenausrüstung.",
    src: "/Brand_assets/arcl-header.jpg",
    alt: "Luftbild über den Klöntalersee",
  },
  {
    name: "Design & Branding",
    scope: "Logo bis Auftritt",
    desc: "Logos, Farben, Schriften und alles, was eine Marke wiedererkennbar macht. Erprobt an unseren eigenen Marken wie Highside.",
    src: `${H}/highside.jpg`,
    alt: "Highside auf der Rennstrecke",
  },
  {
    name: "Web & Hosting",
    scope: "Eigene Server",
    desc: "Schnelle Websites und Web-Apps, betrieben auf unserer eigenen Infrastruktur. Updates, Backups und Monitoring inklusive.",
    src: `${H}/cloudhosting.jpg`,
    alt: "Serverraum von Aracle Cloud",
  },
  {
    name: "Immobilienfotografie",
    scope: "Fotos, 360°, Luftbild",
    desc: "Aracle Living zeigt Wohnungen und Häuser im besten Licht: Fotos, virtuelle Rundgänge und Drohnenbilder für die Vermarktung.",
    src: `${H}/immo.jpg`,
    alt: "Wohnzimmer, fotografiert von Aracle Living",
  },
  {
    name: "Social Content",
    scope: "TikTok, Instagram",
    desc: "Kurzvideos, die nach Mensch aussehen statt nach Werbung. Wie bei Swizzly, unserem eigenen Motorrad-Kanal.",
    src: `${H}/joel.jpg`,
    alt: "Joel Nef vor der Kamera",
  },
];

export default async function Home() {
  const team = await getTeam();
  return (
    <>
      <HeroReel frames={frames} />
      <WorkSeam projects={brands} />
      <ServiceList items={services} />
      <TeamPass members={team} />
      <StoryPass />
      <VisitCard />
    </>
  );
}
