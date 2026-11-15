import type { ProjectUpdate } from "@/lib/projects";

// Öffentliche Live-Zahlen der Projekte. Jede Quelle ist optional: antwortet sie
// nicht, fehlt die Zahl einfach, die Seite bleibt heil. Zwischengespeichert für eine Stunde.

const HOUR = 3600;

export interface Stat {
  value: number;
  label: string;
  /** Woher die Zahl kommt, klein darunter */
  source: string;
  url?: string;
}

/** Projekt-Slug zu den öffentlichen Quellen, die wir abfragen können. */
const SOURCES: Record<string, { modrinth?: string; discordInvite?: string }> = {
  "all-the-clients": { modrinth: "mc-atc" },
  "zelda-de-server": { discordInvite: "vY6gPXTzjv" },
};

async function json<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: HOUR },
      headers: { "User-Agent": "aracle.ch (info@aracle.ch)" },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type ModrinthProject = { downloads?: number; followers?: number; slug?: string };
type ModrinthVersion = { id: string; version_number: string; name: string; changelog?: string | null; date_published: string };
type DiscordInvite = { approximate_member_count?: number; approximate_presence_count?: number };

export async function getProjectStats(slug: string): Promise<Stat[]> {
  const src = SOURCES[slug];
  if (!src) return [];
  const out: Stat[] = [];

  if (src.modrinth) {
    const p = await json<ModrinthProject>(`https://api.modrinth.com/v2/project/${src.modrinth}`);
    const url = `https://modrinth.com/modpack/${src.modrinth}`;
    if (typeof p?.downloads === "number") out.push({ value: p.downloads, label: "Downloads", source: "Modrinth", url });
    if (typeof p?.followers === "number") out.push({ value: p.followers, label: "Follower", source: "Modrinth", url });
  }

  if (src.discordInvite) {
    const d = await json<DiscordInvite>(`https://discord.com/api/v10/invites/${src.discordInvite}?with_counts=true`);
    const url = `https://discord.gg/${src.discordInvite}`;
    if (typeof d?.approximate_member_count === "number") out.push({ value: d.approximate_member_count, label: "Mitglieder", source: "Discord", url });
    if (typeof d?.approximate_presence_count === "number") out.push({ value: d.approximate_presence_count, label: "gerade online", source: "Discord", url });
  }

  return out;
}

/** Alle Zahlen auf einmal, für die Übersicht (eine Zahl pro Projekt reicht dort). */
export async function getHeadlineStats(): Promise<Record<string, Stat>> {
  const entries = await Promise.all(
    Object.keys(SOURCES).map(async (slug) => [slug, (await getProjectStats(slug))[0]] as const),
  );
  return Object.fromEntries(entries.filter(([, s]) => Boolean(s))) as Record<string, Stat>;
}

/** Versionen von Modrinth als Changelog-Einträge, damit ATC-Updates automatisch auftauchen. */
export async function getExternalUpdates(slug: string, limit = 10): Promise<ProjectUpdate[]> {
  const id = SOURCES[slug]?.modrinth;
  if (!id) return [];
  const versions = await json<ModrinthVersion[]>(`https://api.modrinth.com/v2/project/${id}/version`);
  if (!Array.isArray(versions)) return [];
  return versions.slice(0, limit).map((v) => ({
    id: `modrinth-${v.id}`,
    projectSlug: slug,
    version: v.version_number,
    title: v.name && v.name !== v.version_number ? v.name : `Version ${v.version_number}`,
    body: (v.changelog ?? "").trim().slice(0, 1200),
    publishedAt: v.date_published,
    author: null,
    source: "modrinth",
    url: `https://modrinth.com/modpack/${id}/version/${v.id}`,
  }));
}

const fmt = new Intl.NumberFormat("de-CH");
/** 12'345 oder 1,2k für kleine Flächen */
export function formatStat(n: number, compact = false) {
  if (compact && n >= 10000) return `${fmt.format(Math.round(n / 100) / 10)}k`;
  return fmt.format(n);
}
