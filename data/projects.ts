// Projekte. Einzige Quelle für Startseite, Übersicht, Detailseiten und Story.
// Die Team-Zuordnung kommt aus Supabase (project_members), `team` hier ist
// nur der Fallback ohne Datenbank.
// Regel: nur echte Angaben. Keine erfundenen Kunden, Zahlen oder Erfolge.

export type ProjectStatus = "Aktiv" | "In Entwicklung" | "Konzept" | "Pausiert" | "Eingestellt";

export type Pillar =
  | "Creative Production"
  | "Digital Experiences"
  | "Cloud & Infrastructure"
  | "Community & Gaming";

export type GalleryItem =
  | { kind: "photo"; src: string; alt: string; caption?: string; width: number; height: number }
  /** PLATZHALTER: grafisches Mockup, bis echte Bilder vorliegen. Später durch "photo" ersetzen. */
  | { kind: "placeholder"; motif: "tee" | "hoodie" | "patch" | "label" | "wordmark"; caption: string };

export interface Project {
  slug: string;
  title: string;
  /** Eine Zeile, die das Projekt auf den Punkt bringt */
  tagline: string;
  pillar: Pillar;
  category: string;
  status: ProjectStatus;
  owner: string;
  coverImage?: string;
  shortDescription: string;
  longDescription: string;
  /** Was Aracle konkret beiträgt (Rollen, Disziplinen) */
  scope: string[];
  team: { name: string; role: string; slug: string }[];
  techStack: string[];
  timeline: { date: string; label: string }[];
  links: { label: string; url: string }[];
  gallery?: GalleryItem[];
  featured?: boolean;
  /** Startjahr */
  year: string;
}

const H = "/Brand_assets/images/heros";

export const projects: Project[] = [
  {
    slug: "highside",
    year: "2024",
    title: "Highside",
    tagline: "Swiss biker streetwear. Built for the curve.",
    pillar: "Creative Production",
    category: "Fashion, Brand",
    status: "Aktiv",
    owner: "Joel Nef",
    coverImage: `${H}/highside.jpg`,
    shortDescription:
      "Schweizer Bikerstreetwear rund um Motorrad-Kultur und urbanen Street-Style.",
    longDescription:
      "Highside ist eine eigenständige Schweizer Streetwear-Marke aus der Motorrad-Szene. Sie verbindet die Kultur auf der Rennstrecke mit urbanem Street-Style. Aracle verantwortet die Marke vollständig: Idee, Branding, Content und Shop.",
    scope: ["Brand Identity", "Content Production", "Social Media", "Webshop"],
    team: [{ name: "Joel Nef", role: "Director", slug: "joel" }],
    techStack: [],
    timeline: [
      { date: "2024", label: "Launch highside.ch" },
      { date: "2024", label: "Start Swizzly als Content-Kanal für die Marke" },
    ],
    links: [{ label: "highside.ch", url: "https://highside.ch" }],
    gallery: [
      { kind: "photo", src: `${H}/highside.jpg`, alt: "Zwei Motorräder in Schräglage auf der Rennstrecke", caption: "Die Welt von Highside: Rennstrecke, Kurve, Schräglage.", width: 1600, height: 1067 },
      // PLATZHALTER: durch echte Produktfotos ersetzen
      { kind: "placeholder", motif: "tee", caption: "Produktbild folgt: T-Shirt" },
      { kind: "placeholder", motif: "hoodie", caption: "Produktbild folgt: Hoodie" },
      { kind: "placeholder", motif: "patch", caption: "Detail folgt: Patch" },
      { kind: "placeholder", motif: "label", caption: "Detail folgt: Label" },
    ],
    featured: true,
  },
  {
    slug: "aracle-cloud-hosting",
    year: "2022",
    title: "Aracle Cloud",
    tagline: "Own hardware. Swiss hosting.",
    pillar: "Cloud & Infrastructure",
    category: "Hosting, Infrastruktur",
    status: "Aktiv",
    owner: "Tim Mockweiss & Joel Nef",
    coverImage: `${H}/cloudhosting.jpg`,
    shortDescription:
      "Hosting und Server-Infrastruktur auf eigener Hardware. Die technische Basis aller Aracle-Projekte.",
    longDescription:
      "Aracle Cloud ist die technische Basis des Studios: Hosting, Server-Management und Infrastruktur auf eigener Hardware, verwaltet direkt aus dem Aracle-Netzwerk. Was als Homelab begann, betreibt heute die Websites, Game-Server und Dienste der eigenen Projekte.",
    scope: ["Server-Betrieb", "Webhosting", "Game-Server", "Backups & Monitoring"],
    team: [
      { name: "Tim Mockweiss", role: "Developer", slug: "tim-mockweiss" },
      { name: "Joel Nef", role: "Director", slug: "joel" },
    ],
    techStack: ["Proxmox", "UniFi", "TrueNAS", "Docker"],
    timeline: [
      { date: "2022", label: "Erstes Homelab" },
      { date: "2024", label: "Ausbau zur produktiven Cloud" },
    ],
    links: [],
    gallery: [
      { kind: "photo", src: `${H}/cloudhosting.jpg`, alt: "Serverraum mit Racks und Arbeitsplatz", width: 1600, height: 1067 },
    ],
    featured: true,
  },
  {
    slug: "swizzly",
    year: "2024",
    title: "Swizzly",
    tagline: "Motorcycle content, made for the feed.",
    pillar: "Creative Production",
    category: "Content, Social Media",
    status: "Aktiv",
    owner: "Joel Nef",
    shortDescription:
      "Motorrad-Content auf TikTok und Instagram, eng verbunden mit Highside.",
    longDescription:
      "Swizzly ist der Content-Kanal rund ums Motorrad auf TikTok und Instagram. Er verbindet Community und Marke durch authentischen Content und dient gleichzeitig als Werbefläche für Highside.",
    scope: ["Kurzvideo", "Schnitt", "Social Media"],
    team: [{ name: "Joel Nef", role: "Director", slug: "joel" }],
    techStack: [],
    timeline: [{ date: "2024", label: "Erstes Motorrad-Video auf TikTok" }],
    links: [],
    featured: true,
  },
  {
    slug: "beer-game",
    year: "2025",
    title: "Beer Game",
    tagline: "An indie game in the making.",
    pillar: "Digital Experiences",
    category: "Game Dev",
    status: "In Entwicklung",
    owner: "Joel Nef",
    shortDescription:
      "Indie-Game für Steam, aktuell in Entwicklung.",
    longDescription:
      "Ein eigenes Indie-Game mit geplantem Release auf Steam. Die Entwicklung läuft, eine Wishlist-Kampagne ist gestartet. Weitere Details folgen, sobald die Steam-Seite online ist.",
    scope: ["Game Design", "Entwicklung", "Kampagne"],
    team: [{ name: "Joel Nef", role: "Director", slug: "joel" }],
    techStack: [],
    timeline: [
      { date: "2025", label: "Start der Entwicklung" },
      { date: "2025", label: "Wishlist-Kampagne gestartet" },
    ],
    links: [],
    featured: true,
  },
  {
    slug: "sakuto",
    year: "2021",
    title: "Sakuto",
    tagline: "Video essays, streams and Nintendo culture.",
    pillar: "Creative Production",
    category: "Content, Gaming",
    status: "Aktiv",
    owner: "Joel Nef",
    shortDescription:
      "Nintendo-Content, Videoessays und Streams. Herzstück der Creator-Sparte.",
    longDescription:
      "Sakuto ist der Kanal, aus dem Aracle hervorgegangen ist. Nintendo-Content, Videoessays und Streams, mit Fokus auf Community-Aufbau und sorgfältig produzierte Unterhaltung.",
    scope: ["Videoessays", "Streaming", "Schnitt"],
    team: [{ name: "Joel Nef", role: "Director", slug: "joel" }],
    techStack: [],
    timeline: [
      { date: "2017", label: "Start als YouTube-Kanal xSakuto" },
      { date: "2021", label: "Rebranding zu Sakuto, erstes Videoessay" },
    ],
    links: [],
  },
  {
    slug: "zelda-de-server",
    year: "2022",
    title: "Zelda DE",
    tagline: "A community for Hyrule, in German.",
    pillar: "Community & Gaming",
    category: "Community, Discord",
    status: "Aktiv",
    owner: "Lars & Joel Nef",
    shortDescription:
      "Grösste deutsche Legend-of-Zelda-Community auf Discord.",
    longDescription:
      "Die grösste deutschsprachige The-Legend-of-Zelda-Community auf Discord. Im Fokus stehen Theorien, Speedruns und Nostalgie. Aracle übernimmt die technische Pflege und das Community-Management.",
    scope: ["Community-Management", "Discord-Setup", "Moderation"],
    team: [
      { name: "Lars", role: "Community", slug: "lars" },
      { name: "Joel Nef", role: "Director", slug: "joel" },
    ],
    techStack: ["Discord"],
    timeline: [{ date: "2022", label: "Gründung der Community" }],
    links: [],
  },
  {
    slug: "all-the-clients",
    year: "2023",
    title: "All the Clients",
    tagline: "Vanilla+, tuned for performance.",
    pillar: "Community & Gaming",
    category: "Minecraft-Modpack",
    status: "Aktiv",
    owner: "Joel Nef",
    shortDescription:
      "Performance-fokussiertes Vanilla+ Minecraft-Modpack auf Modrinth.",
    longDescription:
      "Ein Vanilla+ Modpack für Minecraft: performance-optimiert und vollständig vanilla-kompatibel. Veröffentlicht auf Modrinth und Grundlage des Aracle-Minecraft-Servers.",
    scope: ["Modpack-Kuration", "Performance-Tuning", "Server-Betrieb"],
    team: [{ name: "Joel Nef", role: "Director", slug: "joel" }],
    techStack: ["Minecraft", "Modrinth"],
    timeline: [{ date: "2023", label: "Erste Version auf Modrinth" }],
    links: [{ label: "Modrinth", url: "https://modrinth.com" }],
  },
  {
    slug: "araclesmp",
    year: "2025",
    title: "AracleSMP",
    tagline: "A long-term server for friends.",
    pillar: "Community & Gaming",
    category: "Minecraft-Server",
    status: "Aktiv",
    owner: "Joel Nef",
    shortDescription:
      "Langzeit Vanilla+ Multiplayer-Server für Freunde und Mitglieder.",
    longDescription:
      "Ein Vanilla+ Multiplayer-Server mit zusätzlichen Addons, gedacht als Langzeitprojekt für Freunde und ausgewählte Mitglieder. Betrieben auf Aracle Cloud.",
    scope: ["Server-Betrieb", "Community"],
    team: [{ name: "Joel Nef", role: "Director", slug: "joel" }],
    techStack: ["Minecraft", "Aracle Cloud"],
    timeline: [{ date: "2025", label: "Start des Servers" }],
    links: [],
  },
  {
    slug: "aracle-living",
    year: "2025",
    title: "Aracle Living",
    tagline: "A concept for real estate visuals.",
    pillar: "Creative Production",
    category: "Konzept",
    status: "Konzept",
    owner: "Jan Waser",
    coverImage: `${H}/immo.jpg`,
    shortDescription:
      "Konzept für Immobilienfotografie und virtuelle Rundgänge. Noch kein buchbares Angebot.",
    longDescription:
      "Aracle Living ist ein Konzept, das den gestalterischen Anspruch des Studios auf Immobilien überträgt: Fotografie und virtuelle Rundgänge. Das Projekt ist in Planung und wird aktuell nicht als Dienstleistung angeboten.",
    scope: ["Fotografie", "Konzept"],
    team: [{ name: "Jan Waser", role: "Lead", slug: "jan-waser" }],
    techStack: [],
    timeline: [{ date: "2025", label: "Konzeptphase" }],
    links: [],
    gallery: [
      { kind: "photo", src: `${H}/immo.jpg`, alt: "Wohnzimmer mit Holzdecke, Stufen und Essbereich", caption: "Testaufnahme", width: 1600, height: 1067 },
    ],
  },
  {
    slug: "rexusmods",
    year: "2021",
    title: "RexusMods",
    tagline: "3D work for GTA V.",
    pillar: "Creative Production",
    category: "3D, Design",
    status: "Pausiert",
    owner: "Joel Nef & Tim Mockweiss",
    shortDescription:
      "3D-Modelling für GTA V: MLO-Maps und Fahrzeuglackierungen.",
    longDescription:
      "3D-Modelling für GTA V, von MLO-Maps bis zu Fahrzeuglackierungen. Eine Zusammenarbeit von Joel Nef und Tim Mockweiss, aktuell pausiert.",
    scope: ["3D-Modelling", "Texturen"],
    team: [
      { name: "Joel Nef", role: "Director", slug: "joel" },
      { name: "Tim Mockweiss", role: "3D", slug: "tim-mockweiss" },
    ],
    techStack: [],
    timeline: [{ date: "2021", label: "Start" }],
    links: [],
  },
  {
    slug: "alcatros",
    year: "2021",
    title: "Alcatros",
    tagline: "Coding help, community-driven.",
    pillar: "Community & Gaming",
    category: "Community",
    status: "Eingestellt",
    owner: "Yao Kaiser",
    shortDescription: "Coding- und Support-Community. Eingestellt 2023.",
    longDescription:
      "Eine Community für technischen Support und Coding-Fragen, geführt von Yao Kaiser, mit Joel als Mitwirkendem. 2023 offiziell eingestellt.",
    scope: ["Community", "Support"],
    team: [{ name: "Yao Kaiser", role: "Lead", slug: "yao-kaiser" }],
    techStack: [],
    timeline: [
      { date: "2021", label: "Gründung" },
      { date: "2023", label: "Eingestellt" },
    ],
    links: [],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const STATUS_ORDER: ProjectStatus[] = ["Aktiv", "In Entwicklung", "Konzept", "Pausiert", "Eingestellt"];

export const PILLARS: Pillar[] = [
  "Creative Production",
  "Digital Experiences",
  "Cloud & Infrastructure",
  "Community & Gaming",
];

/** Vorheriges und nächstes Projekt in der Reihenfolge oben, im Kreis. */
export function neighbours(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  const n = projects.length;
  return { prev: projects[(i - 1 + n) % n], next: projects[(i + 1) % n] };
}
