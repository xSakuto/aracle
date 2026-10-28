"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SaveState } from "@/app/dashboard/actions";
import { PILLARS, STATUS_ORDER, projects as staticProjects, type GalleryItem } from "@/data/projects";
import { cleanOverride, type ProjectOverride } from "@/lib/projects";
import { requireMember, requirePermission } from "@/lib/session";
import { zurichLocalToIso } from "@/lib/zurich-time";

const TABLE_MISSING =
  "Die Tabellen für Projekte gibt es noch nicht. Führ supabase/2026-10-projects.sql einmal im Supabase SQL-Editor aus.";

function dbError(err: { code?: string; message: string }) {
  if (err.code === "42P01" || err.code === "PGRST205" || /does not exist|schema cache/i.test(err.message)) return TABLE_MISSING;
  return `Speichern fehlgeschlagen: ${err.message}`;
}

function text(form: FormData, key: string, max: number) {
  return String(form.get(key) ?? "").trim().slice(0, max);
}

function json<T>(form: FormData, key: string, fallback: T): T {
  try {
    return JSON.parse(String(form.get(key) ?? "")) as T;
  } catch {
    return fallback;
  }
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const isUrl = (u: string) => u.startsWith("https://") || u.startsWith("/");

function refresh(slug: string) {
  revalidatePath("/", "layout");
  revalidatePath(`/projekte/${slug}`);
  revalidatePath("/dashboard/projekte", "layout");
}

// Liest das Formular und baut daraus die Felder, die vom Standard abweichen.
// Was gleich ist wie in data/projects.ts, wird nicht gespeichert, damit spätere
// Änderungen im Code dort weiterhin durchkommen.
function readProject(form: FormData, slug: string): ProjectOverride {
  const base = staticProjects.find((p) => p.slug === slug);
  const status = text(form, "status", 30);
  const pillar = text(form, "pillar", 40);

  const list = (key: string, max = 80) =>
    json<unknown[]>(form, key, []).map((v) => str(v, max)).filter(Boolean).slice(0, 20);
  const pairs = <K extends string, L extends string>(key: string, a: K, b: L, maxA = 120, maxB = 600) =>
    json<Record<string, unknown>[]>(form, key, [])
      .map((x) => ({ [a]: str(x?.[a], maxA), [b]: str(x?.[b], maxB) }) as Record<K | L, string>)
      .filter((x) => x[a] || x[b])
      .slice(0, 30);

  const gallery = json<Record<string, unknown>[]>(form, "gallery", [])
    .map((g): GalleryItem | null => {
      if (g?.kind === "photo") {
        const src = str(g.src, 500);
        if (!isUrl(src)) return null;
        return {
          kind: "photo",
          src,
          alt: str(g.alt, 200) || "Projektbild",
          caption: str(g.caption, 200) || undefined,
          width: Number(g.width) || 1600,
          height: Number(g.height) || 1000,
        };
      }
      if (g?.kind === "slot") {
        const motif = ["screen", "phone", "photo", "video"].includes(String(g.motif)) ? (g.motif as "screen") : "photo";
        return { kind: "slot", motif, caption: str(g.caption, 120) || "Bild folgt" };
      }
      if (g?.kind === "placeholder") return g as unknown as GalleryItem;
      return null;
    })
    .filter((g): g is GalleryItem => Boolean(g))
    .slice(0, 24);

  const cover = text(form, "coverImage", 500);

  const next: ProjectOverride = {
    title: text(form, "title", 80),
    tagline: text(form, "tagline", 140),
    status: (STATUS_ORDER as string[]).includes(status) ? (status as ProjectOverride["status"]) : base?.status,
    year: /^\d{4}$/.test(text(form, "year", 4)) ? text(form, "year", 4) : base?.year,
    category: text(form, "category", 60),
    pillar: (PILLARS as string[]).includes(pillar) ? (pillar as ProjectOverride["pillar"]) : base?.pillar,
    owner: text(form, "owner", 80),
    shortDescription: text(form, "shortDescription", 240),
    longDescription: text(form, "longDescription", 2000),
    goal: text(form, "goal", 400),
    scope: list("scope", 40),
    techStack: list("techStack", 40),
    next: list("next", 160),
    includes: pairs("includes", "title", "text", 80, 400),
    timeline: pairs("timeline", "date", "label", 20, 200),
    links: pairs("links", "label", "url", 80, 500).filter((l) => isUrl(l.url)),
    faq: pairs("faq", "q", "a", 200, 800),
    gallery,
    coverImage: cover && isUrl(cover) ? cover : undefined,
    featured: form.get("featured") === "on",
  };

  // Nur speichern, was vom Code-Stand abweicht
  const diff: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(next)) {
    if (v === undefined) continue;
    const was = base ? (base as unknown as Record<string, unknown>)[k] : undefined;
    const same = JSON.stringify(v) === JSON.stringify(was ?? (Array.isArray(v) ? [] : typeof v === "boolean" ? false : ""));
    if (!same) diff[k] = v;
  }
  return cleanOverride(diff);
}

export async function saveProject(_prev: SaveState, form: FormData): Promise<SaveState> {
  const { supabase, me } = await requirePermission("projekte");
  const slug = text(form, "slug", 60);
  if (!/^[a-z0-9-]{2,60}$/.test(slug)) return { error: "Ungültiges Projekt." };
  const data = readProject(form, slug);
  if (data.title !== undefined && data.title.length < 2) return { error: "Der Titel braucht mindestens 2 Zeichen." };

  const { error } = await supabase.from("projects").upsert({
    slug,
    data,
    hidden: form.get("hidden") === "on",
    updated_at: new Date().toISOString(),
    updated_by: me.id,
  });
  if (error) return { error: dbError(error) };
  refresh(slug);
  return { ok: true, at: Date.now() };
}

// Alle Änderungen aus dem Dashboard verwerfen, zurück auf data/projects.ts
export async function resetProject(form: FormData) {
  const { supabase } = await requirePermission("projekte");
  const slug = text(form, "slug", 60);
  await supabase.from("projects").delete().eq("slug", slug);
  refresh(slug);
  redirect(`/dashboard/projekte/${slug}?zurueckgesetzt=1`);
}

export async function createProject(_prev: SaveState, form: FormData): Promise<SaveState> {
  const { supabase, me } = await requirePermission("projekte");
  const title = text(form, "title", 80);
  if (title.length < 2) return { error: "Gib einen Titel ein." };
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
  if (slug.length < 2) return { error: "Aus diesem Titel lässt sich keine Adresse bilden." };
  if (staticProjects.some((p) => p.slug === slug)) return { error: "Ein Projekt mit diesem Namen gibt es schon." };

  const { error } = await supabase.from("projects").insert({
    slug,
    data: { title, status: "In Entwicklung", year: String(new Date().getFullYear()) },
    hidden: true,
    updated_by: me.id,
  });
  if (error) {
    if (/duplicate|unique/i.test(error.message)) return { error: "Ein Projekt mit diesem Namen gibt es schon." };
    return { error: dbError(error) };
  }
  // Wer es anlegt, steht gleich im Team
  await supabase.from("project_members").insert({ profile_id: me.id, project_slug: slug, role: me.role || "" });
  revalidatePath("/dashboard/projekte");
  redirect(`/dashboard/projekte/${slug}?neu=1`);
}

// ─────────────────────────────────────────────
// Changelog
// ─────────────────────────────────────────────

export async function saveUpdate(_prev: SaveState, form: FormData): Promise<SaveState> {
  const { supabase, me } = await requireMember();
  if (!me) return { error: "Dein Login ist keinem Teamprofil zugeordnet." };
  const slug = text(form, "project_slug", 60);
  const id = text(form, "id", 64);
  const title = text(form, "title", 140);
  if (title.length < 2) return { error: "Der Titel braucht mindestens 2 Zeichen." };

  const fields = {
    project_slug: slug,
    version: text(form, "version", 30),
    title,
    body: text(form, "body", 4000),
    published: form.get("published") === "on",
    published_at: zurichLocalToIso(text(form, "published_at", 16)) ?? new Date().toISOString(),
  };

  // Ob die Person darf, prüft die Datenbank (can_edit_project). Hier nur eine freundliche Meldung.
  const res = id
    ? await supabase.from("project_updates").update(fields).eq("id", id).select("id")
    : await supabase.from("project_updates").insert({ ...fields, author_id: me.id }).select("id");
  if (res.error) {
    if (/row-level security/i.test(res.error.message)) return { error: "Du bist diesem Projekt nicht zugeordnet." };
    return { error: dbError(res.error) };
  }
  if (!res.data?.length) return { error: "Nichts gespeichert. Bist du diesem Projekt zugeordnet?" };
  refresh(slug);
  revalidatePath("/beer");
  revalidatePath(`/team/${me.slug}`);
  return { ok: true, at: Date.now() };
}

export async function deleteUpdate(form: FormData) {
  const { supabase, me } = await requireMember();
  const id = text(form, "id", 64);
  const slug = text(form, "project_slug", 60);
  if (id) await supabase.from("project_updates").delete().eq("id", id);
  refresh(slug);
  if (me) revalidatePath(`/team/${me.slug}`);
  redirect(`/dashboard/projekte/${slug}#changelog`);
}
