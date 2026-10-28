import { redirect } from "next/navigation";
import { cleanSocials, type Social } from "@/data/socials";
import { PERMISSIONS, PERMISSION_LABELS, type Permission } from "@/lib/permissions";
import { createSessionClient } from "@/lib/supabase/server";

export { PERMISSIONS, PERMISSION_LABELS, type Permission };

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
  /** Auf der /team-Übersicht gezeigt. Getrennt von "visible": jemand kann lesbar
   *  (z. B. für eine einzelne Projektseite) sein, ohne auf /team zu stehen. */
  listed: boolean;
  /** Einzeln freigeschaltete Dashboard-Bereiche für Nicht-Admins, z. B. ["bot"]. */
  permissions: Permission[];
  sort: number;
  /** ISO-Datum, seit wann dabei. Setzt nur ein Admin. Erst mit supabase/2026-10-projects.sql. */
  member_since: string | null;
  /** Ort fürs öffentliche Profil */
  location: string;
  projects: { slug: string; role: string }[];
}

export const LEGACY_COLUMNS =
  "id, user_id, email, slug, name, role, bio, accent, photo_url, socials, is_lead, is_admin, visible, sort";
export const FULL_COLUMNS = `${LEGACY_COLUMNS}, quote, contact_email, discord_username, permissions, listed`;
/** Mit den Profilfeldern aus supabase/2026-10-projects.sql */
export const PROFILE_V2_COLUMNS = `${FULL_COLUMNS}, member_since, location`;

/** Spalte fehlt noch, weil supabase/2026-10-profile-quote.sql nicht ausgeführt ist. */
export function missingColumn(err: { code?: string; message?: string } | null | undefined) {
  if (!err) return false;
  return err.code === "42703" || err.code === "PGRST204" || /column .* does not exist|could not find .* column/i.test(err.message ?? "");
}

/** Führt eine Profil-Abfrage aus und fällt ohne die neuen Spalten zurück, falls die Datenbank sie noch nicht kennt. */
export async function withProfileColumns<T extends { error: { code?: string; message?: string } | null }>(
  run: (columns: string) => PromiseLike<T>,
  ...columnSets: string[]
): Promise<T> {
  // Vom neusten zum ältesten Spaltensatz, bis die Datenbank ihn kennt.
  const sets = columnSets.length ? columnSets : [PROFILE_V2_COLUMNS, FULL_COLUMNS, LEGACY_COLUMNS];
  let res = await run(sets[0]);
  for (const cols of sets.slice(1)) {
    if (!(res.error && missingColumn(res.error))) break;
    res = await run(cols);
  }
  return res;
}

type Row = Omit<FullProfile, "socials" | "projects" | "quote" | "contact_email" | "discord_username" | "permissions" | "listed" | "member_since" | "location"> & {
  member_since?: string | null;
  location?: string | null;
  socials: unknown;
  quote?: string | null;
  contact_email?: string | null;
  discord_username?: string | null;
  permissions?: Permission[] | null;
  listed?: boolean | null;
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
    permissions: row.permissions ?? [],
    listed: row.listed ?? true,
    member_since: row.member_since ?? null,
    location: row.location ?? "",
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

/** Wie requireAdmin, lässt aber auch Leute mit genau dieser einzelnen Berechtigung durch. */
export async function requirePermission(perm: Permission) {
  const ctx = await requireMember();
  if (!ctx.me?.is_admin && !ctx.me?.permissions.includes(perm)) redirect("/dashboard");
  return ctx as typeof ctx & { me: FullProfile };
}
