// Team-Daten (Entwurf — Bios/Rollen bei Bedarf anpassen). Wir wachsen 🙂
export type SocialType = "x" | "discord" | "instagram";
export interface Social {
  type: SocialType;
  url: string;
}
export interface Member {
  slug: string;
  name: string;
  role: string;
  bio: string;
  accent: string;
  initials: string;
  photo?: string;
  lead?: boolean;
  socials: Social[];
}

const DISCORD = "https://discord.gg/BgpKdzBYtD";

export const team: Member[] = [
  {
    slug: "joel",
    name: "Joel Nef",
    role: "Gründer & Director",
    bio: "Gründer und Leitung von Aracle. Verantwortlich für Strategie, Markenführung und eigene Projekte wie Highside, Sakuto und Swizzly.",
    accent: "#00ffff",
    initials: "JN",
    photo: "/Brand_assets/images/heros/joel.jpg",
    lead: true,
    socials: [
      { type: "x", url: "https://x.com/AracleCH" },
      { type: "discord", url: DISCORD },
      { type: "instagram", url: "https://www.instagram.com/aracle.ch/" },
    ],
  },
  {
    slug: "tim-mockweiss",
    name: "Tim Mockweiss",
    role: "Developer & Co-Director",
    bio: "Entwickler und Co-Director. Verantwortlich für Cloud-Infrastruktur, Server-Systeme und die technische Umsetzung der Projekte.",
    accent: "#22c55e",
    initials: "TM",
    socials: [{ type: "discord", url: DISCORD }],
  },
  {
    slug: "noah",
    name: "Noah",
    role: "Web-Developer",
    bio: "Web-Entwickler im Studio. Bringt technisches Know-how für Web- und Softwareprojekte ein und unterstützt bei der Umsetzung.",
    accent: "#38bdf8",
    initials: "N",
    socials: [{ type: "discord", url: DISCORD }],
  },
  {
    slug: "jan-waser",
    name: "Jan Waser",
    role: "Creative & Photography",
    bio: "Creative bei Aracle. Zuständig für Grafik, Design und visuelle Gestaltung sowie die Leitung von Aracle Immo.",
    accent: "#3b82f6",
    initials: "JW",
    socials: [
      { type: "instagram", url: "https://www.instagram.com/aracle.ch/" },
      { type: "discord", url: DISCORD },
    ],
  },
  {
    slug: "lars",
    name: "Lars",
    role: "Community",
    bio: "Betreut die Community rund um den Zelda DE Server. Theorien, Speedruns und das Miteinander auf Discord.",
    accent: "#a855f7",
    initials: "L",
    socials: [{ type: "discord", url: DISCORD }],
  },
  {
    slug: "tim-mod",
    name: "Tim",
    role: "Community & Moderation",
    bio: "Hält die Community zusammen. Verantwortlich für Moderation, Support und das Miteinander auf den Aracle-Kanälen.",
    accent: "#f59e0b",
    initials: "T",
    socials: [{ type: "discord", url: DISCORD }],
  },
];
