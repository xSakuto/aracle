"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { projects } from "@/data/projects";
import { cleanSocials } from "@/data/socials";
import { missingColumn, requireAdmin, requireMember } from "@/lib/session";

export type SaveState = { ok?: boolean; error?: string; at?: number };

const HEX = /^#[0-9a-f]{6}$/i;
const projectSlugs = new Set(projects.map((p) => p.slug));

function text(form: FormData, key: string, max: number) {
  return String(form.get(key) ?? "").trim().slice(0, max);
}

function parseJson(form: FormData, key: string): unknown {
  try {
    return JSON.parse(String(form.get(key) ?? "[]"));
  } catch {
    return [];
  }
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "mitglied";
}

// Felder, die jede:r am eigenen Profil ändern darf.
function ownFields(form: FormData) {
  const name = text(form, "name", 80);
  const accent = text(form, "accent", 7);
  const photo = text(form, "photo_url", 500);
  return {
    name,
    bio: text(form, "bio", 400),
    accent: HEX.test(accent) ? accent : "#00ffff",
    photo_url: photo && (photo.startsWith("https://") || photo.startsWith("/")) ? photo : null,
    socials: cleanSocials(parseJson(form, "socials")),
    ...extraFields(form),
  };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Zitat und öffentliche Kontaktadresse. Neue Spalten, siehe supabase/2026-10-profile-quote.sql.
function extraFields(form: FormData) {
  const mail = text(form, "contact_email", 200).toLowerCase();
  return {
    quote: text(form, "quote", 200),
    contact_email: EMAIL.test(mail) ? mail : null,
  };
}

const PENDING_DB = "Gespeichert. Zitat und Kontakt-Mail erscheinen erst, wenn das Datenbank-Update (supabase/2026-10-profile-quote.sql) ausgeführt ist.";

// Speichert, und ohne die neuen Spalten in der Datenbank den Rest trotzdem.
async function updateProfile(
  supabase: Awaited<ReturnType<typeof requireMember>>["supabase"],
  id: string,
  fields: Record<string, unknown>,
) {
  const res = await supabase.from("profiles").update(fields).eq("id", id);
  if (res.error && missingColumn(res.error)) {
    const { quote: _q, contact_email: _c, ...rest } = fields; // eslint-disable-line @typescript-eslint/no-unused-vars
    const retry = await supabase.from("profiles").update(rest).eq("id", id);
    return { error: retry.error, pending: !retry.error };
  }
  return { error: res.error, pending: false };
}

function refreshPublic() {
  revalidatePath("/", "layout");
}

export async function saveOwnProfile(_prev: SaveState, form: FormData): Promise<SaveState> {
  const { supabase, me } = await requireMember();
  if (!me) return { error: "Dein Login ist noch keinem Teamprofil zugeordnet." };
  const fields = ownFields(form);
  if (!fields.name) return { error: "Der Name darf nicht leer sein." };

  const { error, pending } = await updateProfile(supabase, me.id, fields);
  if (error) return { error: `Speichern fehlgeschlagen: ${error.message}` };
  refreshPublic();
  revalidatePath("/dashboard");
  return pending ? { error: PENDING_DB } : { ok: true, at: Date.now() };
}

export async function saveMember(_prev: SaveState, form: FormData): Promise<SaveState> {
  const { supabase, me } = await requireAdmin();
  const id = text(form, "id", 64);
  const fields = ownFields(form);
  if (!fields.name) return { error: "Der Name darf nicht leer sein." };
  const email = text(form, "email", 200).toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Die E-Mail-Adresse ist ungültig." };
  }

  const { error, pending } = await updateProfile(supabase, id, {
      ...fields,
      role: text(form, "role", 80),
      email: email || null,
      is_lead: form.get("is_lead") === "on",
      // Sich selbst die Admin-Rechte entziehen geht nicht, sonst sperrt man sich aus.
      is_admin: id === me.id ? true : form.get("is_admin") === "on",
      visible: form.get("visible") === "on",
      sort: Number.parseInt(text(form, "sort", 6), 10) || 100,
    });
  if (error) {
    const dup = /duplicate|unique/i.test(error.message);
    return { error: dup ? "Diese E-Mail ist schon einem anderen Profil zugeordnet." : `Speichern fehlgeschlagen: ${error.message}` };
  }

  // Projekt-Tags komplett ersetzen.
  const tags = (parseJson(form, "projects") as { slug?: string; role?: string }[])
    .filter((t) => t && projectSlugs.has(String(t.slug)))
    .map((t) => ({ profile_id: id, project_slug: String(t.slug), role: String(t.role ?? "").slice(0, 60) }));
  const del = await supabase.from("project_members").delete().eq("profile_id", id);
  if (del.error) return { error: `Projekte nicht gespeichert: ${del.error.message}` };
  if (tags.length) {
    const ins = await supabase.from("project_members").insert(tags);
    if (ins.error) return { error: `Projekte nicht gespeichert: ${ins.error.message}` };
  }

  refreshPublic();
  revalidatePath("/dashboard", "layout");
  return pending ? { error: PENDING_DB } : { ok: true, at: Date.now() };
}

export async function createMember(_prev: SaveState, form: FormData): Promise<SaveState> {
  const { supabase } = await requireAdmin();
  const name = text(form, "name", 80);
  const email = text(form, "email", 200).toLowerCase();
  if (!name) return { error: "Gib einen Namen ein." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Die E-Mail-Adresse ist ungültig." };
  }

  // Eindeutigen Slug finden.
  const base = slugify(name);
  const { data: taken } = await supabase.from("profiles").select("slug").like("slug", `${base}%`);
  const used = new Set((taken ?? []).map((r) => r.slug));
  let slug = base;
  for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      name,
      slug,
      email: email || null,
      role: text(form, "role", 80),
      visible: false,
      sort: 100,
    })
    .select("id")
    .single();
  if (error) {
    const dup = /duplicate|unique/i.test(error.message);
    return { error: dup ? "Diese E-Mail ist schon einem Profil zugeordnet." : `Anlegen fehlgeschlagen: ${error.message}` };
  }
  revalidatePath("/dashboard/team");
  redirect(`/dashboard/team/${data.id}?neu=1`);
}

export async function deleteMember(form: FormData) {
  const { supabase, me } = await requireAdmin();
  const id = text(form, "id", 64);
  if (id === me.id) redirect(`/dashboard/team/${id}?fehler=selbst`);
  await supabase.from("profiles").delete().eq("id", id);
  refreshPublic();
  revalidatePath("/dashboard/team");
  redirect("/dashboard/team?geloescht=1");
}
