// Dienste, die auf /status überwacht werden. Neue Dienste einfach hier ergänzen.
// Geprüft wird jede Minute von aussen (Supabase ruft /api/status/run auf), damit
// ein Ausfall des Heimservers auch dann auffällt, wenn dort gar nichts mehr läuft.

export type CheckKind =
  /** Seite muss mit 2xx/3xx antworten, optional mit bestimmtem Text */
  | { type: "http"; url: string; contains?: string }
  /** Discord-Bot: /api/site/health, signiert mit dem Bot-Geheimnis */
  | { type: "bot"; url: string }
  /** Minecraft-Server, über die öffentliche Abfrage von mcsrvstat.us */
  | { type: "minecraft"; host: string };

export interface Service {
  id: string;
  name: string;
  /** Kurz, was der Dienst ist. Steht auf der Statusseite. */
  description: string;
  group: "Website & Apps" | "Community" | "Infrastruktur";
  check: CheckKind;
  /** false: wird überwacht und alarmiert, aber nicht öffentlich gezeigt */
  public: boolean;
  /** Link zum Dienst auf der Statusseite */
  href?: string;
}

export const SERVICES: Service[] = [
  {
    id: "website",
    name: "aracle.ch",
    description: "Website und Team-Bereich",
    group: "Website & Apps",
    check: { type: "http", url: "https://aracle.ch/robots.txt" },
    public: true,
    href: "https://aracle.ch",
  },
  {
    id: "milvia",
    name: "Milvia",
    description: "Web-App für RS und WK",
    group: "Website & Apps",
    check: { type: "http", url: "https://milvia.ch" },
    public: true,
    href: "https://milvia.ch",
  },
  {
    id: "highside",
    name: "highside.ch",
    description: "Shop und Website von Highside",
    group: "Website & Apps",
    check: { type: "http", url: "https://highside.ch" },
    public: true,
    href: "https://highside.ch",
  },
  {
    id: "discord-bot",
    name: "Discord-Bot",
    description: "Moderation, Ränge und News auf den Discord-Servern",
    group: "Community",
    check: { type: "bot", url: "https://bot.aracle.ch/api/site/health" },
    public: true,
  },
  {
    id: "minecraft",
    name: "AracleSMP",
    description: "Minecraft-Server play.aracle.ch",
    group: "Community",
    check: { type: "minecraft", host: "play.aracle.ch" },
    public: true,
    href: "/smp",
  },
  // Weitere Dienste aus dem Homelab, sobald sie eine öffentliche Adresse haben, z. B.:
  // { id: "panel", name: "Game-Panel", description: "Pterodactyl", group: "Infrastruktur",
  //   check: { type: "http", url: "https://panel.aracle.cloud" }, public: true },
  // { id: "vault", name: "Vaultwarden", description: "Passwörter", group: "Infrastruktur",
  //   check: { type: "http", url: "https://vault.aracle.cloud/alive" }, public: false },
];

export const STATUS_GROUPS = ["Website & Apps", "Community", "Infrastruktur"] as const;

/** Nach so vielen Fehlschlägen in Folge gilt ein Dienst als ausgefallen (je eine Minute). */
export const FAILS_BEFORE_ALERT = 2;
