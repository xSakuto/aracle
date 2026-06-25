// Projekte (Inhalte aus der alten Seite übernommen — bei Bedarf anpassen).
export type ProjectStatus = "Aktiv" | "In Planung" | "Pausiert" | "Eingestellt";

export interface Project {
  slug: string;
  title: string;
  category: string;
  status: ProjectStatus;
  owner: string;
  coverImage: string;
  shortDescription: string;
  longDescription: string;
  team: { name: string; role: string; slug: string }[];
  techStack: string[];
  timeline: { date: string; label: string }[];
  links: { label: string; url: string }[];
  featured?: boolean;
}

const PLACEHOLDER = "/Brand_assets/arcl-header.jpg";

export const projects: Project[] = [
  {
    slug: "aracle-cloud-hosting",
    title: "Aracle Cloud Hosting",
    category: "Cloud · Tech",
    status: "Aktiv",
    owner: "Tim Mockweiss & Joel Nef",
    coverImage: "/Brand_assets/images/heros/cloudhosting.jpg",
    shortDescription:
      "Zentrale Infrastruktur für alle Aracle-Projekte: Hosting, Server-Management und technische Basis.",
    longDescription:
      "Die technische Basis des gesamten Studios: Hosting, Server-Management und Infrastruktur für alle Projekte. Eigene Hardware, verwaltet direkt aus dem Aracle-Netzwerk heraus.",
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
    featured: true,
  },
  {
    slug: "highside",
    title: "Highside",
    category: "Fashion · Brand",
    status: "Aktiv",
    owner: "Joel Nef",
    coverImage: "/Brand_assets/images/heros/highside.jpg",
    shortDescription:
      "Schweizer Bikerstreetwear rund um Motorrad-Kultur und urbanen Street-Style.",
    longDescription:
      "Schweizer Bikerstreetwear-Brand. Eigenständige Marke rund um Motorrad-Kultur und urbanen Street-Style. Joel trägt die volle Verantwortung, von der Idee bis zum Shop.",
    team: [{ name: "Joel Nef", role: "Director", slug: "joel" }],
    techStack: [],
    timeline: [{ date: "2024", label: "Launch highside.ch" }],
    links: [{ label: "highside.ch", url: "https://highside.ch" }],
    featured: true,
  },
  {
    slug: "aracle-immo",
    title: "Aracle Immo",
    category: "Photography",
    status: "In Planung",
    owner: "Jan Waser",
    coverImage: "/Brand_assets/images/heros/immo.jpg",
    shortDescription:
      "Professionelle Immobilienfotografie und 360°-Aufnahmen für den Markt.",
    longDescription:
      "Professionelle Immobilienfotografie und 360°-Aufnahmen für den Immobilienmarkt. Eigenständige Leitung durch Jan Waser unter dem Aracle-Dach.",
    team: [{ name: "Jan Waser", role: "Lead", slug: "jan-waser" }],
    techStack: [],
    timeline: [{ date: "2025", label: "In Planung" }],
    links: [],
    featured: true,
  },
  {
    slug: "swizzly",
    title: "Swizzly",
    category: "Content · Media",
    status: "Aktiv",
    owner: "Joel Nef",
    coverImage: PLACEHOLDER,
    shortDescription:
      "TikTok-Bike-Content mit Fokus auf Advertisement für Highside.ch.",
    longDescription:
      "TikTok-Bike-Content mit Fokus auf Advertisement für Highside.ch. Verbindet Community und Brand durch authentischen Motorrad-Content.",
    team: [{ name: "Joel Nef", role: "Director", slug: "joel" }],
    techStack: [],
    timeline: [],
    links: [],
  },
  {
    slug: "sakuto",
    title: "Sakuto",
    category: "Content · Gaming",
    status: "Aktiv",
    owner: "Joel Nef",
    coverImage: PLACEHOLDER,
    shortDescription:
      "Nintendo-Content, Videoessays und Streams. Herzstück der Creator-Sparte.",
    longDescription:
      "Nintendo-Content, Videoessays und Streams. Herzstück der Aracle-Creator-Sparte mit Fokus auf Community-Aufbau und hochwertige Unterhaltung.",
    team: [{ name: "Joel Nef", role: "Director", slug: "joel" }],
    techStack: [],
    timeline: [{ date: "2021", label: "Rebranding zu Sakuto" }],
    links: [],
  },
  {
    slug: "zelda-de-server",
    title: "Zelda DE Server",
    category: "Community",
    status: "Aktiv",
    owner: "Lars & Joel Nef",
    coverImage: PLACEHOLDER,
    shortDescription:
      "Grösste deutsche Legend-of-Zelda-Community auf Discord.",
    longDescription:
      "Grösste deutsche The-Legend-of-Zelda-Community auf Discord. Fokus auf Theorien, Speedruns und Nostalgie, mit technischer Pflege und Community-Management.",
    team: [
      { name: "Lars", role: "Community", slug: "lars" },
      { name: "Joel Nef", role: "Director", slug: "joel" },
    ],
    techStack: [],
    timeline: [],
    links: [],
  },
  {
    slug: "all-the-clients",
    title: "All the Clients",
    category: "Gaming",
    status: "Aktiv",
    owner: "Joel Nef",
    coverImage: PLACEHOLDER,
    shortDescription:
      "Performance-fokussiertes Vanilla+ Minecraft-Modpack auf Modrinth.",
    longDescription:
      "Vanilla+ Minecraft-Modpack. Performance-fokussiert und zu 100% vanilla-kompatibel. Verfügbar auf Modrinth, für eine engagierte Spieler-Community entwickelt.",
    team: [{ name: "Joel Nef", role: "Director", slug: "joel" }],
    techStack: ["Minecraft", "Modrinth"],
    timeline: [],
    links: [{ label: "Modrinth", url: "https://modrinth.com" }],
  },
  {
    slug: "araclesmp",
    title: "AracleSMP",
    category: "Gaming · Community",
    status: "Aktiv",
    owner: "Joel Nef",
    coverImage: PLACEHOLDER,
    shortDescription:
      "Langzeit Vanilla+ Multiplayer-Server für enge Freunde und Mitglieder.",
    longDescription:
      "Langzeit-Vanilla+-Multiplayer-Server mit zusätzlichen Addons. Community-orientiertes Langzeitprojekt für enge Freunde und ausgewählte Mitglieder.",
    team: [{ name: "Joel Nef", role: "Director", slug: "joel" }],
    techStack: ["Minecraft"],
    timeline: [],
    links: [],
  },
  {
    slug: "noreply",
    title: "NoReply",
    category: "Game Dev",
    status: "Pausiert",
    owner: "Joel Nef",
    coverImage: PLACEHOLDER,
    shortDescription:
      "Multiplayer-Indie-Game. Entwicklung aktuell pausiert.",
    longDescription:
      "Multiplayer-Indie-Game. Entwicklung aktuell pausiert, da kein aktiver Entwickler verfügbar ist. Konzept und Assets sind vorhanden.",
    team: [{ name: "Joel Nef", role: "Director", slug: "joel" }],
    techStack: [],
    timeline: [],
    links: [],
  },
  {
    slug: "rexusmods",
    title: "RexusMods",
    category: "3D · Design",
    status: "Pausiert",
    owner: "Joel Nef & Tim Mockweiss",
    coverImage: PLACEHOLDER,
    shortDescription:
      "3D-Modelling für GTA V: MLO-Maps und Fahrzeuglackierungen.",
    longDescription:
      "3D-Modelling für GTA V: MLO-Maps und Fahrzeuglackierungen. Aktuell auf Eis gelegt, kein aktiver Betrieb.",
    team: [
      { name: "Joel Nef", role: "Director", slug: "joel" },
      { name: "Tim Mockweiss", role: "3D", slug: "tim-mockweiss" },
    ],
    techStack: [],
    timeline: [],
    links: [],
  },
  {
    slug: "alcatros",
    title: "Alcatros",
    category: "Community",
    status: "Eingestellt",
    owner: "Yao Kaiser",
    coverImage: PLACEHOLDER,
    shortDescription: "Coding- & Support-Community. Offiziell eingestellt 2023.",
    longDescription:
      "Coding- & Support-Community. Geführt von Yao Kaiser, Joel sekundär beteiligt. Offiziell eingestellt 2023.",
    team: [{ name: "Yao Kaiser", role: "Lead", slug: "yao-kaiser" }],
    techStack: [],
    timeline: [{ date: "2023", label: "Eingestellt" }],
    links: [],
  },
  {
    slug: "beer-game",
    title: "Beer Game",
    category: "Game Dev",
    status: "Eingestellt",
    owner: "Joel Nef",
    coverImage: PLACEHOLDER,
    shortDescription:
      "Steam-Indie-Game, nach 3 Monaten Entwicklung eingestellt.",
    longDescription:
      "Steam-Release geplant, Wishlist-Kampagne gestartet. Nach 3 Monaten Entwicklung eingestellt, die Steam-Page wurde nie veröffentlicht.",
    team: [{ name: "Joel Nef", role: "Director", slug: "joel" }],
    techStack: [],
    timeline: [],
    links: [],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);

export const STATUS_ORDER: ProjectStatus[] = [
  "Aktiv",
  "In Planung",
  "Pausiert",
  "Eingestellt",
];
