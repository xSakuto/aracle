// Statische Team-Daten. Werden nur genutzt, solange Supabase nicht
// eingerichtet ist, und dienen als Vorlage für supabase/seed.sql.
import type { Social } from "@/data/socials";

export interface StaticMember {
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

export const team: StaticMember[] = [
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
    accent: "#6bbf59",
    initials: "TM",
    socials: [{ type: "discord", url: DISCORD }],
  },
  {
    slug: "noah",
    name: "Noah",
    role: "Web-Developer",
    bio: "Web-Entwickler im Studio. Bringt technisches Know-how für Web- und Softwareprojekte ein und unterstützt bei der Umsetzung.",
    accent: "#5aa9e6",
    initials: "N",
    socials: [{ type: "discord", url: DISCORD }],
  },



];
