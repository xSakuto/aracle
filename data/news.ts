// Themen, Vorlagenarten und Signatur für News. Gleiche Schlüssel wie der Discord-Bot.

export const TOPICS = [
  { key: "aracle", label: "Aracle", accent: "#8fd6d3" },
  { key: "swizzly", label: "Swizzly", accent: "#5aa9e6" },
  { key: "sakuto", label: "Sakuto", accent: "#7c93c9" },
  { key: "highside", label: "Highside", accent: "#e5634d" },
  { key: "vanilla", label: "Vanilla", accent: "#6bbf59" },
  { key: "atc", label: "All The Clients", accent: "#d9a441" },
] as const;

export type TopicKey = (typeof TOPICS)[number]["key"];

export const TEMPLATES = [
  { key: "update", label: "Update" },
  { key: "status", label: "Status-Update" },
  { key: "changelog", label: "Changelog" },
  { key: "video", label: "Video" },
] as const;

export type TemplateKey = (typeof TEMPLATES)[number]["key"];

export interface NewsPost {
  id: string;
  topic: string;
  template: TemplateKey;
  title: string;
  body: string;
  /** Fertige Signatur, z.B. "Sakuto 🪽". Leer = keine. */
  signature: string;
  /** Als Embed senden statt als normale Nachricht */
  useEmbed: boolean;
  publishedAt: string;
}

export const topicOf = (key: string) => TOPICS.find((t) => t.key === key) ?? TOPICS[0];
export const templateOf = (key: string) => TEMPLATES.find((t) => t.key === key) ?? TEMPLATES[0];

const isTemplate = (v: unknown): v is TemplateKey => TEMPLATES.some((t) => t.key === v);
export const asTemplate = (v: unknown): TemplateKey => (isTemplate(v) ? v : "update");
export const asTopic = (v: unknown): string => (TOPICS.some((t) => t.key === v) ? String(v) : "aracle");

// Signatur: Name der Person plus Zeichen. Die Leitung (Joel) bekommt die Schwinge, alle anderen ein Feuer.
const SIGNATURE_NAME: Record<string, string> = { joel: "Sakuto" };

export function defaultSignature(slug: string, name: string, isLead: boolean) {
  const first = SIGNATURE_NAME[slug] ?? name.split(/[\s-]/)[0] ?? name;
  return `${first} ${isLead ? "🪽" : "🔥"}`;
}

/** Die Nachricht, wie sie der Bot postet (Überschrift mit Rollen-Ping, Text, Signatur). */
export function composeMessage(p: { topic: string; title: string; body: string; signature: string }) {
  const head = `## <@&${p.topic}> ${p.title || "Titel"}`;
  const sig = p.signature.trim() ? `Cheers,\n**${p.signature.trim()}**` : "";
  return [head, p.body.trim(), sig].filter(Boolean).join("\n\n");
}
