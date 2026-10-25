// Projekte. Einzige Quelle für Startseite, Übersicht, Detailseiten und Story.
// Die Team-Zuordnung kommt aus Supabase (project_members), `team` hier ist
// nur der Fallback ohne Datenbank.
// Regel: nur echte Angaben. Keine erfundenen Kunden, Zahlen oder Erfolge.

export type ProjectStatus = "Aktiv" | "In Entwicklung" | "Konzept" | "Pausiert" | "Eingestellt";

export type Pillar =
  | "Marken & Produkte"
  | "Kanäle"
  | "Communitys & Server"
  | "Cloud & Hosting";

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
  /** Kleines Logo für Listen und Credits (quadratisch oder breit, transparent) */
  mark?: string;
  /** Weisse/helle Logo-Variante fürs Überlagern auf Fotos (Kacheln, Selected work). Fällt sonst auf `mark` zurück. */
  markTile?: string;
  /** Eigene Landing Page statt der Projektseite */
  landing?: string;
  /** Startjahr */
  year: string;
}

const H = "/Brand_assets/images/heros";
const STEAM = "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3438570";

export const projects: Project[] = [
  {
    slug: "aracle-cloud-hosting",
    mark: "/images/cloud/aracle-cloud-hosting-logo.png",
    markTile: "/images/cloud/aracle-cloud-hosting-logo.png",
    landing: "/hosting",
    year: "2022",
    title: "Aracle Cloud",
    tagline: "Own hardware. Swiss hosting.",
    pillar: "Cloud & Hosting",
    category: "Hosting, Infrastruktur",
    status: "Aktiv",
    owner: "Tim Mockweiss & Joel Nef",
    coverImage: "/images/cloud/server-rack.webp",
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
      { kind: "photo", src: "/images/cloud/server-rack.webp", alt: "Nahaufnahme eines Server-Racks", width: 1920, height: 1278 },
    ],
    featured: true,
  },
  {
    slug: "highside",
    mark: "/images/highside/highside-h.png",
    markTile: "/images/highside/highside-logo-white.png",
    landing: "/highside",
    year: "2024",
    title: "Highside",
    tagline: "Swiss biker streetwear. Built for the curve.",
    pillar: "Marken & Produkte",
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
    slug: "milvia",
    mark: "/images/milvia/milvia-mark.png",
    markTile: "/images/milvia/milvia-mark.png",
    coverImage: "/images/milvia/forest.webp",
    year: "2026",
    title: "Milvia",
    tagline: "Your companion through the RS.",
    pillar: "Marken & Produkte",
    category: "App, Flutter",
    status: "Aktiv",
    owner: "Joel Nef",
    shortDescription:
      "Inoffizielle Companion-App für RS und WK: Reglemente, Armeewissen, Vorbereitung und ein Kompaniebau-Game.",
    longDescription:
      "Milvia ist eine inoffizielle Begleit-App für Rekrutenschule und Wiederholungskurs. Original-Reglemente zum Nachlesen und Durchsuchen, Dienstgrade und Abkürzungen zum Nachschlagen, der Fitnesstest zum Festhalten, Packliste und Marschbefehl zur Vorbereitung, dazu ein eigenes Kompaniebau-Game. Läuft im Browser, auf dem Handy wie am Computer.",
    scope: ["App-Entwicklung", "Branding", "Content"],
    goal: "Angehörigen der Schweizer Armee RS und WK mit einer App erleichtern, die Wissen und Vorbereitung an einem Ort bündelt, ohne die Armee offiziell zu vertreten.",
    includes: [
      { title: "Reglemente", text: "Original-Reglemente als PDF, mit Zoom, Volltextsuche und gemerkter letzter Seite." },
      { title: "Armeewissen", text: "Dienstgrade erkennen, die Laufbahn erkunden und Abkürzungen im Glossar nachschlagen, dazu der Kader-Corner mit Auszügen aus den Reglementen." },
      { title: "Vorbereitung", text: "Fitnesstest-Resultate festhalten und den Fortschritt verfolgen, dazu Packliste und Marschbefehl." },
      { title: "Meine Kompanie", text: "Ein Bauspiel: eigene Kompanie benennen, Rekruten ausbilden und den Waffenplatz ausbauen. Spielregeln sind frei erfunden, Fortschritt bleibt lokal auf dem Gerät." },
    ],
    team: [{ name: "Joel Nef", role: "Director", slug: "joel" }],
    techStack: ["Flutter", "Dart"],
    timeline: [{ date: "2026", label: "Launch milvia.ch" }],
    links: [{ label: "milvia.ch", url: "https://milvia.ch" }, { label: "Über Milvia", url: "https://milvia.ch/ueber/" }],
  },
  {
    slug: "swizzly",
    landing: "/swizzly",
    year: "2024",
    title: "Swizzly",
    tagline: "Motorcycle content, made for the feed.",
    pillar: "Kanäle",
    category: "Content, Social Media",
    status: "Aktiv",
    owner: "Joel Nef",
    coverImage: "/images/swizzly/ktm-mountain.webp",
    shortDescription:
      "Motorrad, Entertainment und RS-Content auf YouTube, TikTok und Instagram.",
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
    links: [
      { label: "YouTube", url: "https://www.youtube.com/@swizzly690" },
      { label: "TikTok", url: "https://www.tiktok.com/@swizzly690" },
      { label: "Instagram", url: "https://www.instagram.com/swizzly690" },
    ],
    featured: true,
  },
  {
    slug: "beer-game",
    mark: "/images/beer/beer-logo.png",
    markTile: "/images/beer/beer-logo.png",
    landing: "/beer",
    year: "2025",
    title: "Beer Game",
    tagline: "A tiny online tavern for up to four.",
    pillar: "Marken & Produkte",
    category: "Game Dev",
    status: "In Entwicklung",
    owner: "Joel Nef",
    coverImage: "/images/beer/rusty-mug.webp",
    shortDescription:
      "The Rusty Mug: kleine Online-Taverne für bis zu vier Leute. Free to Play, bald auf Steam.",
    longDescription:
      "Ihr seid Fässer und Bierkrüge mit Wackelaugen. Bier zapfen, anstossen, Roulette, Blackjack, Meiern und Darts spielen und euch Bierdeckel an den Kopf werfen. BEER: The Rusty Mug erscheint als Free-to-Play-Spiel auf Steam, entwickelt und veröffentlicht von Aracle.",
    scope: ["Game Design", "Entwicklung", "Steam-Seite"],
    goal: "Ein eigenes kleines Online-Spiel für Freunde entwickeln und auf Steam veröffentlichen.",
    includes: [
      { title: "Online für bis zu vier", text: "Eine kleine Taverne, in der man sich mit Freunden trifft." },
      { title: "Minispiele", text: "Roulette, Blackjack, Würfel und Darts." },
      { title: "Steam", text: "Free to Play, Release noch offen." },
    ],
    team: [{ name: "Joel Nef", role: "Director", slug: "joel" }],
    techStack: [],
    timeline: [
      { date: "2025", label: "Start der Entwicklung" },
      { date: "2025", label: "Steam-Seite und Wishlist-Kampagne" },
    ],
    links: [{ label: "BEER auf Steam", url: "https://store.steampowered.com/app/3438570/BEER/" }],
    gallery: [
      { kind: "photo", src: `${STEAM}/48eb3cf7ccce60b595cfff2c1ef7276b9f36577d/page_bg_raw.jpg`, alt: "Hintergrundgrafik von BEER", width: 1438, height: 810 },
      { kind: "photo", src: "https://shared.fastly.steamstatic.com/community_assets/images/apps/3438570/f0f9748dfe6288dd476a861f66ec17b619f20a26.jpg", alt: "Community-Grafik von BEER", width: 1438, height: 810 },
    ],
    featured: true,
  },
  {
    slug: "rexusmods",
    mark: "/images/rexusmods/rexusmods-logo.png",
    landing: "/rexusmods",
    year: "2021",
    title: "RexusMods",
    tagline: "Mods for GTA V. Now taking flight.",
    pillar: "Marken & Produkte",
    category: "3D, Mods",
    status: "Aktiv",
    owner: "Joel Nef & Tim Mockweiss",
    coverImage: "/images/rexusmods/ambulanz-glarus-front.webp",
    shortDescription:
      "Modifikationen für GTA V, neu erweitert um Add-ons für Flugsimulatoren.",
    longDescription:
      "RexusMods ist wieder aktiv. Angefangen mit 3D-Modelling für GTA V, von MLO-Maps bis zu Fahrzeuglackierungen. Jetzt kommen Add-ons für Flugsimulatoren dazu. Eine Zusammenarbeit von Joel Nef und Tim Mockweiss.",
    scope: ["3D-Modelling", "Texturen", "Flugsimulator-Add-ons"],
    goal: "Mods für GTA V weiterführen und das Projekt um Add-ons für Flugsimulatoren erweitern.",
    includes: [
      { title: "Gebäude", text: "Eigene Gebäude für FiveM, etwa Jagd- und Forstschutz." },
      { title: "Lackierungen", text: "Rettungsdienst Glarus, Weazel News, Sprinter Schweizer Post." },
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
    links: [{ label: "Sprinter Schweizer Post auf GTA5-Mods", url: "https://www.gta5-mods.com/de/vehicles/mercedes-benz-sprinter-schweizer-post-rexusmods" }],
  },
  {
    slug: "sakuto",
    mark: "/images/sakuto/sakuto-ice.png",
    markTile: "/images/sakuto/sakuto-ice.png",
    year: "2021",
    title: "Sakuto",
    tagline: "Video essays, streams and Nintendo culture.",
    pillar: "Kanäle",
    category: "Content, Gaming",
    status: "Aktiv",
    owner: "Joel Nef",
    coverImage: "/images/sakuto/sakuto-header.webp",
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
    landing: "/zelda-de",
    mark: "/images/zelda/zelda-de-logo.png",
    markTile: "/images/zelda/zelda-de-logo-trim.png",
    year: "2022",
    title: "Zelda DE",
    tagline: "A community for Hyrule, in German.",
    pillar: "Communitys & Server",
    category: "Community, Discord",
    status: "Aktiv",
    owner: "Lars & Joel Nef",
    coverImage: "/images/zelda/zelda-cover.png",
    shortDescription:
      "Grösste deutsche Zelda-Community auf Discord: Theorien, Spiele, Speedruns und Nostalgie.",
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
    links: [{ label: "Regelwerk", url: "/zelda-de/regelwerk" }],
  },
  {
    slug: "all-the-clients",
    mark: "/images/atc/atc-logo.png",
    markTile: "/images/atc/atc-logo-tile.png",
    coverImage: "/images/atc/atc-world.webp",
    year: "2023",
    title: "All the Clients",
    tagline: "Vanilla+, tuned for performance.",
    pillar: "Communitys & Server",
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
    links: [{ label: "All the Clients auf Modrinth", url: "https://modrinth.com/modpack/mc-atc" }],
  },
  {
    slug: "aracle-living",
    year: "2025",
    title: "Aracle Living",
    tagline: "A concept for real estate visuals.",
    pillar: "Marken & Produkte",
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
    mark: "/images/smp/vanilla-logo.png",
    markTile: "/images/smp/vanilla-logo-tile.png",
    coverImage: "/images/smp/smp-world.webp",
    landing: "/smp",
    year: "2025",
    title: "AracleSMP",
    tagline: "A long-term server for friends.",
    pillar: "Communitys & Server",
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
    pillar: "Communitys & Server",
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

/** Wohin ein Projekt verlinkt: eigene Landing Page, sonst die Projektseite. */
export const projectHref = (p: Pick<Project, "slug" | "landing">) => p.landing ?? `/projekte/${p.slug}`;
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const STATUS_ORDER: ProjectStatus[] = ["Aktiv", "In Entwicklung", "Konzept", "Pausiert", "Eingestellt"];

export const PILLARS: Pillar[] = [
  "Marken & Produkte",
  "Kanäle",
  "Communitys & Server",
  "Cloud & Hosting",
];

/** Vorheriges und nächstes Projekt in der Reihenfolge oben, im Kreis. */
export function neighbours(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  const n = projects.length;
  return { prev: projects[(i - 1 + n) % n], next: projects[(i + 1) % n] };
}
