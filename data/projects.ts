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
  /** Ziel des Projekts in ein bis zwei Sätzen */
  goal: string;
  /** Was zum Projekt gehört: Bausteine mit kurzer Erklärung */
  includes: { title: string; text: string }[];
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
    goal: "Eine eigene Infrastruktur betreiben, auf der alle Aracle-Projekte laufen, und sie als Hosting auch für andere nutzbar machen.",
    includes: [
      { title: "Eigene Hardware", text: "Server im Glarnerland statt gemieteter Ressourcen, virtualisiert mit Proxmox." },
      { title: "Webhosting", text: "Websites und Web-Apps der eigenen Projekte." },
      { title: "Game-Server", text: "Minecraft-Server wie AracleSMP und weitere Community-Dienste." },
      { title: "Backups und Monitoring", text: "Speicher mit TrueNAS, Updates und Überwachung im laufenden Betrieb." },
    ],
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
    goal: "Eine eigenständige Schweizer Streetwear-Marke aufbauen, die die Motorrad-Kultur von der Rennstrecke in den Alltag trägt.",
    includes: [
      { title: "Idee und Positionierung", text: "Eine Marke aus der Motorrad-Szene, zwischen Rennstrecke und urbanem Street-Style." },
      { title: "Branding", text: "Die visuelle Identität der Marke, von Aracle entwickelt." },
      { title: "Content", text: "Bilder und Videos rund um Rennstrecke und Strasse, gespielt über den Kanal Swizzly." },
      { title: "Webshop", text: "Der eigene Online-Shop auf highside.ch." },
    ],
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
    goal: "Die Motorrad-Community auf TikTok und Instagram erreichen und gleichzeitig der Marke Highside eine Bühne geben.",
    includes: [
      { title: "Kurzvideos", text: "Motorrad-Content im Format für TikTok und Instagram." },
      { title: "Schnitt", text: "Produktion und Schnitt der Videos." },
      { title: "Social Media", text: "Pflege der Kanäle und Austausch mit der Community." },
      { title: "Verbindung zu Highside", text: "Der Kanal dient auch als Werbefläche für die Marke." },
    ],
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
    goal: "Ein eigenes Indie-Game entwickeln und auf Steam veröffentlichen.",
    includes: [
      { title: "Game Design", text: "Konzept und Spielmechanik." },
      { title: "Entwicklung", text: "Umsetzung des Spiels, aktuell in Arbeit." },
      { title: "Wishlist-Kampagne", text: "Erste Kampagne, damit das Spiel vor dem Release gefunden wird." },
    ],
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
    slug: "rexusmods",
    year: "2021",
    title: "RexusMods",
    tagline: "Mods for GTA V. Now taking flight.",
    pillar: "Creative Production",
    category: "3D, Mods",
    status: "Aktiv",
    owner: "Joel Nef & Tim Mockweiss",
    shortDescription:
      "Modifikationen für GTA V, neu erweitert um Add-ons für Flugsimulatoren.",
    longDescription:
      "RexusMods ist wieder aktiv. Angefangen mit 3D-Modelling für GTA V, von MLO-Maps bis zu Fahrzeuglackierungen. Jetzt kommen Add-ons für Flugsimulatoren dazu. Eine Zusammenarbeit von Joel Nef und Tim Mockweiss.",
    scope: ["3D-Modelling", "Texturen", "Flugsimulator-Add-ons"],
    goal: "Mods für GTA V weiterführen und das Projekt um Add-ons für Flugsimulatoren erweitern.",
    includes: [
      { title: "MLO-Maps", text: "Begehbare Innenräume für die Spielwelt von GTA V." },
      { title: "Fahrzeuglackierungen", text: "Eigene Designs für Fahrzeuge." },
      { title: "Flugsimulator-Add-ons", text: "Neuer Bereich, aktuell in Arbeit." },
    ],
    team: [
      { name: "Joel Nef", role: "Director", slug: "joel" },
      { name: "Tim Mockweiss", role: "3D", slug: "tim-mockweiss" },
    ],
    techStack: [],
    timeline: [
      { date: "2021", label: "Start mit Mods für GTA V" },
      { date: "2026", label: "Wieder aktiv, Erweiterung um Flugsimulator-Add-ons" },
    ],
    links: [],
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
    goal: "Mit sorgfältig produzierten Videos eine Community rund um Nintendo aufbauen.",
    includes: [
      { title: "Videoessays", text: "Längere, recherchierte Videos zu Nintendo-Themen." },
      { title: "Streams", text: "Live-Formate für die Community." },
      { title: "Schnitt", text: "Produktion und Schnitt der Videos." },
    ],
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
    goal: "Deutschsprachigen Fans von The Legend of Zelda einen gemeinsamen Ort geben.",
    includes: [
      { title: "Discord-Setup", text: "Aufbau und technische Pflege des Servers." },
      { title: "Community-Management", text: "Themen wie Theorien, Speedruns und Nostalgie." },
      { title: "Moderation", text: "Ein Ort, an dem man sich gerne austauscht." },
    ],
    team: [
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
    goal: "Minecraft spürbar schneller machen, ohne das Vanilla-Gefühl zu verändern.",
    includes: [
      { title: "Modpack-Kuration", text: "Auswahl von Mods, die vanilla-kompatibel bleiben." },
      { title: "Performance-Tuning", text: "Optimiert auf flüssiges Spielen." },
      { title: "Veröffentlichung", text: "Verfügbar auf Modrinth." },
      { title: "Server-Basis", text: "Grundlage des Aracle-Minecraft-Servers." },
    ],
    team: [{ name: "Joel Nef", role: "Director", slug: "joel" }],
    techStack: ["Minecraft", "Modrinth"],
    timeline: [{ date: "2023", label: "Erste Version auf Modrinth" }],
    links: [{ label: "Modrinth", url: "https://modrinth.com" }],
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
    goal: "Prüfen, wie sich der gestalterische Anspruch des Studios auf Immobilien übertragen lässt.",
    includes: [
      { title: "Fotografie", text: "Erste Testaufnahmen von Innenräumen." },
      { title: "Virtuelle Rundgänge", text: "Als Idee im Konzept vorgesehen." },
      { title: "Konzept", text: "In Planung, aktuell kein buchbares Angebot." },
    ],
    team: [],
    techStack: [],
    timeline: [{ date: "2025", label: "Konzeptphase" }],
    links: [],
    gallery: [
      { kind: "photo", src: `${H}/immo.jpg`, alt: "Wohnzimmer mit Holzdecke, Stufen und Essbereich", caption: "Testaufnahme", width: 1600, height: 1067 },
    ],
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
    goal: "Einen beständigen Ort schaffen, an dem Freunde und Mitglieder langfristig zusammen spielen.",
    includes: [
      { title: "Vanilla+", text: "Minecraft mit zusätzlichen Addons, nah am Original." },
      { title: "Server-Betrieb", text: "Läuft auf Aracle Cloud." },
      { title: "Community", text: "Für Freunde und ausgewählte Mitglieder." },
    ],
    team: [{ name: "Joel Nef", role: "Director", slug: "joel" }],
    techStack: ["Minecraft", "Aracle Cloud"],
    timeline: [{ date: "2025", label: "Start des Servers" }],
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
    goal: "Einen Ort für Fragen rund um Coding und technischen Support bieten.",
    includes: [
      { title: "Community", text: "Austausch unter Entwicklerinnen und Entwicklern." },
      { title: "Support", text: "Hilfe bei technischen Fragen." },
      { title: "Abschluss", text: "2023 offiziell eingestellt." },
    ],
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
