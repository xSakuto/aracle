// The Aracle Journey: Stationen seit 2017. Nur echte Ereignisse.
// `project` verlinkt auf eine Projektseite, falls es eine gibt.

export type JourneyTag = "Aktiv" | "In Entwicklung" | "Pausiert" | "Eingestellt" | "Kernmarke";

export interface JourneyItem {
  name: string;
  desc: string;
  tag?: JourneyTag;
  project?: string;
}

export interface JourneyStage {
  year: string;
  chapter: string;
  items: JourneyItem[];
}

export const journey: JourneyStage[] = [
  {
    year: "2017",
    chapter: "The first upload",
    items: [
      {
        name: "YouTube-Kanal xSakuto",
        desc: "Der Anfang: Content Creation auf YouTube, damals noch als Rex_HD. Der Grundstein für alles, was folgt.",
        project: "sakuto",
      },
    ],
  },
  {
    year: "2018",
    chapter: "Building a community",
    items: [
      {
        name: "RexArmy.de, der Ursprung von Aracle",
        desc: "Gründung durch Joel Nef und Yao Kaiser als Minecraft-Community-Server. Erste Erfahrungen mit Hosting und Serverbetrieb.",
      },
    ],
  },
  {
    year: "2019",
    chapter: "A network",
    items: [
      {
        name: "RexArmy wächst",
        desc: "Neuer Slogan «Dein Servernetzwerk» und die erste Ausrichtung auf mehrere Plattformen, mit Discord-Fokus auf Zelda-Content.",
      },
    ],
  },
  {
    year: "2020",
    chapter: "Learning to code",
    items: [
      {
        name: "RA Coding Community",
        desc: "Discord-Server für Coding-Support und Entwicklung des Discord-Bots «Sakumo».",
        tag: "Eingestellt",
      },
    ],
  },
  {
    year: "2021",
    chapter: "Craft",
    items: [
      {
        name: "Rebranding zu Sakuto",
        desc: "Der Kanal wird zu Sakuto. Erstes hochdeutsches Videoessay und der Schritt zu anspruchsvolleren Formaten.",
        project: "sakuto",
      },
      {
        name: "RexusMods",
        desc: "3D-Modelling für GTA V, von MLO-Maps bis zu Fahrzeuglackierungen. Zusammen mit Tim Mockweiss, heute wieder aktiv und um Flugsimulator-Add-ons erweitert.",
        tag: "Aktiv",
        project: "rexusmods",
      },
      {
        name: "Alcatros",
        desc: "Community für Coding und technischen Support, geführt von Yao Kaiser.",
        tag: "Eingestellt",
        project: "alcatros",
      },
    ],
  },
  {
    year: "2022",
    chapter: "Infrastructure",
    items: [
      {
        name: "Das erste Homelab",
        desc: "Eigene Hardware im Glarnerland. Der Anfang von dem, was heute Aracle Cloud ist.",
        tag: "Aktiv",
        project: "aracle-cloud-hosting",
      },
      {
        name: "Zelda DE",
        desc: "Gründung der grössten deutschsprachigen Zelda-Community auf Discord.",
        tag: "Aktiv",
        project: "zelda-de-server",
      },
    ],
  },
  {
    year: "2023",
    chapter: "Aracle",
    items: [
      {
        name: "Launch von aracle.ch",
        desc: "Aus vielen Projekten wird ein Studio. Aracle tritt als Creative Studio mit eigener Marke auf.",
        tag: "Kernmarke",
      },
      {
        name: "All the Clients",
        desc: "Vanilla+ Modpack für Minecraft, performance-optimiert und vollständig vanilla-kompatibel.",
        tag: "Aktiv",
        project: "all-the-clients",
      },
    ],
  },
  {
    year: "2024",
    chapter: "On the road",
    items: [
      {
        name: "Highside",
        desc: "Launch von highside.ch: Schweizer Bikerstreetwear als eigenständige Marke.",
        tag: "Aktiv",
        project: "highside",
      },
      {
        name: "Swizzly",
        desc: "Das erste Motorrad-Video auf TikTok und der Start des Content-Kanals.",
        tag: "Aktiv",
        project: "swizzly",
      },
      {
        name: "Aracle Cloud",
        desc: "Ausbau des Homelabs zur produktiven Cloud für alle eigenen Projekte.",
        tag: "Aktiv",
        project: "aracle-cloud-hosting",
      },
    ],
  },
  {
    year: "2025",
    chapter: "Next level",
    items: [
      {
        name: "Beer Game",
        desc: "Ein eigenes Indie-Game für Steam. Die Entwicklung läuft, eine Wishlist-Kampagne ist gestartet.",
        tag: "In Entwicklung",
        project: "beer-game",
      },
      {
        name: "AracleSMP",
        desc: "Langzeit-Server für Freunde und Mitglieder, betrieben auf Aracle Cloud.",
        tag: "Aktiv",
        project: "araclesmp",
      },
    ],
  },
];
