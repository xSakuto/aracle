import { redirect } from "next/navigation";
import { cleanSocials, type Social } from "@/data/socials";
import { createSessionClient } from "@/lib/supabase/server";

export interface FullProfile {
  id: string;
  user_id: string | null;
  email: string | null;
  slug: string;
  name: string;
  role: string;
  bio: string;
  accent: string;
  photo_url: string | null;
  socials: Social[];
  /** Persönliches Zitat, öffentlich */
  quote: string;
  /** Öffentliche Kontaktadresse, nicht die Login-Adresse */
  contact_email: string | null;
  /** Discord-Benutzername, gesetzt beim ersten Login mit Discord */
  discord_username: string | null;
  is_lead: boolean;
  is_admin: boolean;
  visible: boolean;
  sort: number;
  projects: { slug: string; role: string }[];
}

export const LEGACY_COLUMNS =
  "id, user_id, email, slug, name, role, bio, accent, photo_url, socials, is_lead, is_admin, visible, sort";
export const FULL_COLUMNS = `${LEGACY_COLUMNS}, quote, contact_email, discord_username`;

/** Spalte fehlt noch, weil supabase/2026-10-profile-quote.sql nicht ausgeführt ist. */
export function missingColumn(err: { code?: string; message?: string } | null | undefined) {
  if (!err) return false;
  return err.code === "42703" || err.code === "PGRST204" || /column .* does not exist|could not find .* column/i.test(err.message ?? "");
}

/** Führt eine Profil-Abfrage aus und fällt ohne die neuen Spalten zurück, falls die Datenbank sie noch nicht kennt. */
export async function withProfileColumns<T extends { error: { code?: string; message?: string } | null }>(
  run: (columns: string) => PromiseLike<T>,
  full = FULL_COLUMNS,
  legacy = LEGACY_COLUMNS,
): Promise<T> {
  const res = await run(full);
  return res.error && missingColumn(res.error) ? run(legacy) : res;
}

type Row = Omit<FullProfile, "socials" | "projects" | "quote" | "contact_email" | "discord_username"> & {
  socials: unknown;
  quote?: string | null;
  contact_email?: string | null;
  discord_username?: string | null;
};

export function toProfile(
  row: Row,
  members: { profile_id: string; project_slug: string; role: string }[],
): FullProfile {
  return {
    ...row,
    socials: cleanSocials(row.socials),
    quote: row.quote ?? "",
    contact_email: row.contact_email ?? null,
    discord_username: row.discord_username ?? null,
    projects: members
      .filter((m) => m.profile_id === row.id)
      .map((m) => ({ slug: m.project_slug, role: m.role })),
  };
}

// Eingeloggte Person samt ihrem Teamprofil. Ohne Login geht es zur Anmeldung.
export async function requireMember() {
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: row } = await withProfileColumns((cols) =>
    supabase.from("profiles").select(cols).eq("user_id", user.id).maybeSingle(),
  );

  let me: FullProfile | null = null;
  if (row) {
    const { data: members } = await supabase
      .from("project_members")
      .select("profile_id, project_slug, role")
      .eq("profile_id", (row as unknown as Row).id);
    me = toProfile(row as unknown as Row, members ?? []);
  }
  return { supabase, user, me };
}

export async function requireAdmin() {
  const ctx = await requireMember();
  if (!ctx.me?.is_admin) redirect("/dashboard");
  return ctx as typeof ctx & { me: FullProfile };
}
