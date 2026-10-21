import PageIntro from "@/components/PageIntro";
import FeatureList from "@/components/FeatureList";
import CtaBand from "@/components/CtaBand";

export const metadata = {
  title: "Aracle Cloud · Hosting aus Glarus",
  description:
    "Eigene Server, sauber betrieben: Hosting für Websites, Game-Server und Community-Projekte, aus der Schweiz.",
};

const features = [
  { name: "Webhosting", desc: "Schnelle, sichere Umgebungen für Websites und Web-Apps." },
  { name: "Game- & Community-Server", desc: "Minecraft, Discord-Bots und mehr, stabil rund um die Uhr." },
  { name: "Verwaltung & Sicherheit", desc: "Updates, Backups und Monitoring. Wir kümmern uns darum." },
  { name: "Unser Stack", desc: "Proxmox, UniFi, TrueNAS und Docker auf eigener Hardware." },
];

export default function HostingPage() {
  return (
    <>
      <PageIntro
        title="Aracle Cloud"
        lead="Die technische Basis des Studios: eigene Server, sauber betrieben. Hosting für Web, Game-Server und Community-Projekte, aus der Schweiz."
        image={{
          src: "/Brand_assets/images/heros/cloudhosting.jpg",
          alt: "Serverraum mit Racks und Arbeitsplatz",
          width: 1600,
          height: 1067,
        }}
      />
      <FeatureList
        title="Was wir betreiben"
        intro="Angefangen 2022 als Homelab, heute die produktive Infrastruktur hinter allen Aracle-Projekten."
        items={features}
      />
      <CtaBand
        title="Projekt hosten?"
        text="Sag uns, was laufen soll und wie viele Leute es nutzen. Wir richten dir die passende Umgebung ein."
        action="Anfrage schicken"
      />
    </>
  );
}
