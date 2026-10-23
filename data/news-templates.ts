import type { TemplateKey } from "@/data/news";

// Ausgangstexte für den Editor. Eckige Klammern sind Platzhalter zum Überschreiben.
// Kürzel wie :tools: werden beim Speichern zu Emojis. Die Signatur kommt automatisch dazu.

export interface NewsTemplate {
  id: string;
  label: string;
  kind: TemplateKey;
  /** Für welche Themen die Vorlage angeboten wird, "all" = für alle */
  topics: string[] | "all";
  title: string;
  body: string;
}

const CREATORS = ["swizzly", "sakuto", "highside"];

export const NEWS_TEMPLATES: NewsTemplate[] = [
  // Vanilla, der Minecraft-Server
  {
    id: "vanilla-stoerung",
    label: "Störung",
    kind: "status",
    topics: ["vanilla"],
    title: ":tools: STATUS-UPDATE: STÖRUNG",
    body:
      "Geschätzte User,\n" +
      "bei **play.aracle.ch** besteht aktuell eine Störung. Wir arbeiten an der Behebung und melden uns, sobald wieder alles läuft.\n\n" +
      "Vielen Dank für eure Geduld!",
  },
  {
    id: "vanilla-behoben",
    label: "Störung behoben",
    kind: "status",
    topics: ["vanilla"],
    title: ":tools: STATUS-UPDATE: STÖRUNG BEHOBEN",
    body:
      "Geschätzte User,\n" +
      "die Störung bei der **play.aracle.ch** Domain wurde erfolgreich behoben! Ihr könnt ab sofort wieder wie gewohnt über die Haupt-Adresse joinen.\n" +
      "Die temporäre Adresse (`[temporäre Adresse]`) wird theoretisch nicht mehr benötigt.\n\n" +
      "Vielen Dank für eure Geduld!",
  },
  {
    id: "vanilla-wartung",
    label: "Wartung",
    kind: "status",
    topics: ["vanilla"],
    title: ":construction: WARTUNG: [Datum]",
    body:
      "Geschätzte User,\n" +
      "am **[Datum]** führen wir von **[Uhrzeit]** bis **[Uhrzeit]** Wartungsarbeiten durch. In dieser Zeit ist der Server nicht erreichbar.\n\n" +
      "Vielen Dank für euer Verständnis!",
  },
  {
    id: "vanilla-update",
    label: "Server-Update",
    kind: "changelog",
    topics: ["vanilla"],
    title: ":package: Server-Update [Version]",
    body:
      "Der Server läuft jetzt auf **[Version]**.\n\n" +
      "```ini\n[Updated]   [Was wurde aktualisiert]\n[Added]     [Was ist neu]\n[Fixed]     [Was wurde behoben]\n```",
  },

  // All The Clients, das Modpack
  {
    id: "atc-update",
    label: "Update mit Changelog",
    kind: "changelog",
    topics: ["atc"],
    title: ":tools: [Titel] - [Minecraft-Version] v[x.y] Update :gear:",
    body:
      "**[Eine Zeile, worum es geht]** :tada:\n" +
      "With the **v[x.y] update** for Minecraft [Minecraft-Version], we’ve shifted our focus to [Schwerpunkt]. [Ein, zwei Sätze mehr.] :shield::sparkles:\n\n" +
      "```ini\n" +
      "[Updated]   All available mods updated to the latest versions\n" +
      "[Tested]    [Was wurde getestet]\n" +
      "[Optimized] [Was wurde verbessert]\n" +
      "[Fixed]     [Was wurde behoben]\n" +
      "```\n\n" +
      ":rocket: **Time for an upgrade!** [Ein Satz zum Aufruf.]\n" +
      "- [Modrinth Page](https://modrinth.com/modpack/mc-atc)",
  },
  {
    id: "atc-hotfix",
    label: "Hotfix",
    kind: "changelog",
    topics: ["atc"],
    title: ":bandage: Hotfix - v[x.y.z]",
    body:
      "A small hotfix is live and fixes the following:\n\n" +
      "```ini\n[Fixed]     [Was wurde behoben]\n[Fixed]     [Was wurde behoben]\n```\n\n" +
      "Update via the launcher or on Modrinth:\n- [Modrinth Page](https://modrinth.com/modpack/mc-atc)",
  },

  // Swizzly, Sakuto, Highside (Creator)
  {
    id: "creator-video",
    label: "Neues Video",
    kind: "video",
    topics: CREATORS,
    title: ":clapper: NEUES VIDEO: [Titel]",
    body:
      "Ab sofort online: **[Titel]**\n" +
      "[Ein, zwei Sätze, worum es geht.]\n\n" +
      ":point_right: [Video ansehen](https://youtube.com/watch?v=)",
  },
  {
    id: "creator-post",
    label: "Neuer Beitrag (Instagram / TikTok)",
    kind: "video",
    topics: CREATORS,
    title: ":camera_with_flash: NEUER BEITRAG",
    body:
      "[Ein, zwei Sätze zum Beitrag.]\n\n" +
      "- [Instagram](https://instagram.com/)\n" +
      "- [TikTok](https://tiktok.com/)",
  },
  {
    id: "creator-live",
    label: "Stream live",
    kind: "video",
    topics: ["sakuto", "swizzly"],
    title: ":red_circle: LIVE: [Titel]",
    body:
      "Wir sind live! [Was gespielt oder gemacht wird.]\n\n" +
      ":point_right: [Zum Stream](https://twitch.tv/xsakuto)",
  },
  {
    id: "creator-collab",
    label: "Collab",
    kind: "update",
    topics: CREATORS,
    title: ":handshake: COLLAB: [mit wem]",
    body:
      "Zusammen mit **[Name]** ist etwas Neues entstanden: [Titel].\n\n" +
      ":point_right: [Jetzt ansehen](https://)",
  },

  // Aracle, allgemein
  {
    id: "aracle-ankuendigung",
    label: "Ankündigung",
    kind: "update",
    topics: ["aracle"],
    title: ":loudspeaker: [Titel]",
    body: "[Was gibt es Neues? Zwei, drei Sätze reichen.]\n\n- [Mehr erfahren](https://aracle.ch)",
  },
  {
    id: "aracle-wartung",
    label: "Wartung / Störung",
    kind: "status",
    topics: ["aracle"],
    title: ":tools: STATUS-UPDATE: [Dienst]",
    body:
      "Geschätzte Community,\n" +
      "[Was ist los, was ist betroffen, bis wann.]\n\n" +
      "Vielen Dank für eure Geduld!",
  },
  {
    id: "aracle-release",
    label: "Neues Projekt / Release",
    kind: "update",
    topics: ["aracle"],
    title: ":rocket: [Projektname] ist da",
    body:
      "**[Projektname]** ist ab sofort verfügbar. [Ein, zwei Sätze, was es kann.]\n\n" +
      "- [Zum Projekt](https://aracle.ch/projekte)",
  },

  // Für jedes Thema
  {
    id: "allgemein-update",
    label: "Einfaches Update",
    kind: "update",
    topics: "all",
    title: ":sparkles: [Titel]",
    body: "[Was gibt es Neues?]",
  },
];

export const templatesFor = (topic: string) =>
  NEWS_TEMPLATES.filter((t) => t.topics === "all" || t.topics.includes(topic));
