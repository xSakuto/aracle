// Themen, Vorlagen und Aufräum-Funktionen für News. Gleiche Schlüssel wie der Discord-Bot.

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
  { key: "update", label: "Update", hint: "Titel und Text, für fast alles." },
  { key: "status", label: "Status-Update", hint: "Störung, Wartung oder Entwarnung." },
  { key: "changelog", label: "Changelog", hint: "Version mit Liste der Änderungen." },
  { key: "video", label: "Video", hint: "Neues Video mit Link." },
] as const;

export type TemplateKey = (typeof TEMPLATES)[number]["key"];

export const CHANGELOG_TAGS = ["Added", "Updated", "Fixed", "Optimized", "Tested", "Removed"] as const;

export interface NewsItem {
  tag: string;
  text: string;
}

export interface NewsLink {
  label: string;
  url: string;
}

export interface NewsPost {
  id: string;
  topic: string;
  template: TemplateKey;
  title: string;
  body: string;
  items: NewsItem[];
  links: NewsLink[];
  imageUrl: string | null;
  publishedAt: string;
}

export const topicOf = (key: string) => TOPICS.find((t) => t.key === key) ?? TOPICS[0];
export const templateOf = (key: string) => TEMPLATES.find((t) => t.key === key) ?? TEMPLATES[0];

const isTemplate = (v: unknown): v is TemplateKey => TEMPLATES.some((t) => t.key === v);
export const asTemplate = (v: unknown): TemplateKey => (isTemplate(v) ? v : "update");
export const asTopic = (v: unknown): string => (TOPICS.some((t) => t.key === v) ? String(v) : "aracle");

export function cleanItems(raw: unknown): NewsItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((r) => ({
      tag: String((r as NewsItem)?.tag ?? "").trim().slice(0, 20),
      text: String((r as NewsItem)?.text ?? "").trim().slice(0, 200),
    }))
    .filter((r) => r.text)
    .slice(0, 20);
}

export function cleanLinks(raw: unknown): NewsLink[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((r) => ({
      label: String((r as NewsLink)?.label ?? "").trim().slice(0, 40),
      url: String((r as NewsLink)?.url ?? "").trim().slice(0, 500),
    }))
    .filter((r) => /^https:\/\//i.test(r.url))
    .map((r) => ({ label: r.label || new URL(r.url).hostname.replace(/^www\./, ""), url: r.url }))
    .slice(0, 6);
}

export const asHttpsUrl = (v: unknown): string | null => {
  const s = String(v ?? "").trim().slice(0, 500);
  return /^https:\/\//i.test(s) ? s : null;
};
