import { projects as staticProjects, type Project } from "@/data/projects";
import { supabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/server";

// Projekte aus data/projects.ts, ergänzt um Änderungen aus dem Dashboard
// (Tabelle "projects"). Ohne Datenbank oder Tabelle gelten nur die statischen Daten.

/** Felder, die im Dashboard überschrieben werden dürfen. */
export const EDITABLE_FIELDS = [
  "title", "tagline", "status", "year", "category", "pillar", "owner",
  "shortDescription", "longDescription", "goal", "scope", "includes",
  "techStack", "timeline", "next", "links", "faq", "coverImage", "gallery", "featured",
] as const;
export type EditableField = (typeof EDITABLE_FIELDS)[number];
export type ProjectOverride = Partial<Pick<Project, EditableField>>;

export type ProjectRow = { slug: string; data: ProjectOverride; hidden: boolean; updated_at: string };

const BLANK: Omit<Project, "slug"> = {
  title: "",
  tagline: "",
  pillar: "Marken & Produkte",
  category: "",
  status: "In Entwicklung",
  owner: "Aracle",
  shortDescription: "",
  longDescription: "",
  scope: [],
  goal: "",
  includes: [],
  team: [],
  techStack: [],
  timeline: [],
  links: [],
  year: String(new Date().getFullYear()),
};

/** Nur bekannte Felder übernehmen, damit aus der Datenbank nichts Fremdes in die Seite rutscht. */
export function cleanOverride(data: unknown): ProjectOverride {
  if (!data || typeof data !== "object") return {};
  const out: Record<string, unknown> = {};
  for (const k of EDITABLE_FIELDS) {
    const v = (data as Record<string, unknown>)[k];
    if (v !== undefined && v !== null) out[k] = v;
  }
  return out as ProjectOverride;
}

export function mergeProjects(rows: ProjectRow[]): Project[] {
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  const merged = staticProjects
    .filter((p) => !bySlug.get(p.slug)?.hidden)
    .map((p) => ({ ...p, ...cleanOverride(bySlug.get(p.slug)?.data) }));
  // Im Dashboard neu angelegte Projekte kommen ans Ende.
  const extra = rows
    .filter((r) => !r.hidden && !staticProjects.some((p) => p.slug === r.slug))
    .map((r) => ({ ...BLANK, slug: r.slug, title: r.slug, ...cleanOverride(r.data) }) as Project);
  return [...merged, ...extra];
}

export async function getProjectRows(): Promise<ProjectRow[]> {
  if (!supabaseConfigured) return [];
  try {
    const { data, error } = await createPublicClient().from("projects").select("slug, data, hidden, updated_at");
    if (error) throw error;
    return (data ?? []) as ProjectRow[];
  } catch (err) {
    // Tabelle fehlt, solange supabase/2026-10-projects.sql nicht ausgeführt ist
    console.warn("Projekte aus Supabase nicht ladbar, nutze data/projects.ts:", (err as Error).message ?? err);
    return [];
  }
}

export async function getProjects(): Promise<Project[]> {
  return mergeProjects(await getProjectRows());
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((p) => p.slug === slug);
}

// ─────────────────────────────────────────────
// Changelog
// ─────────────────────────────────────────────

export interface ProjectUpdate {
  id: string;
  projectSlug: string;
  version: string;
  title: string;
  body: string;
  publishedAt: string;
  author: { name: string; slug: string } | null;
  /** Woher der Eintrag kommt: eigenes Dashboard oder z. B. Modrinth */
  source: "aracle" | "modrinth";
  url?: string;
}

type UpdateRow = {
  id: string;
  project_slug: string;
  version: string;
  title: string;
  body: string;
  published_at: string;
  author: { name: string; slug: string } | null;
};

const UPDATE_COLUMNS = "id, project_slug, version, title, body, published_at, author:profiles(name, slug)";

const toUpdate = (r: UpdateRow): ProjectUpdate => ({
  id: r.id,
  projectSlug: r.project_slug,
  version: r.version,
  title: r.title,
  body: r.body,
  publishedAt: r.published_at,
  author: r.author ?? null,
  source: "aracle",
});

async function queryUpdates(filter: { slug?: string; authorId?: string }, limit: number): Promise<ProjectUpdate[]> {
  if (!supabaseConfigured) return [];
  try {
    let q = createPublicClient()
      .from("project_updates")
      .select(UPDATE_COLUMNS)
      .eq("published", true)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(limit);
    if (filter.slug) q = q.eq("project_slug", filter.slug);
    if (filter.authorId) q = q.eq("author_id", filter.authorId);
    const { data, error } = await q;
    if (error) throw error;
    return (data as unknown as UpdateRow[]).map(toUpdate);
  } catch (err) {
    console.warn("Changelog nicht ladbar:", (err as Error).message ?? err);
    return [];
  }
}

export const getProjectUpdates = (slug: string, limit = 30) => queryUpdates({ slug }, limit);
export const getUpdatesByAuthor = (profileId: string, limit = 30) => queryUpdates({ authorId: profileId }, limit);
export const getRecentUpdates = (limit = 30) => queryUpdates({}, limit);
