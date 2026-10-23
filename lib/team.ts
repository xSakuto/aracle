import { team as staticTeam } from "@/data/team";
import { projects } from "@/data/projects";
import { cleanSocials, type Social } from "@/data/socials";
import { supabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/server";
import { withProfileColumns } from "@/lib/session";
export { initials } from "@/lib/initials";

export interface MemberProject {
  slug: string;
  role: string;
}

export interface TeamMember {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
  accent: string;
  photo?: string;
  lead: boolean;
  sort: number;
  socials: Social[];
  projects: MemberProject[];
  /** Persönliches Zitat, leer wenn keins gesetzt */
  quote: string;
  /** Öffentliche Kontaktadresse */
  contactEmail?: string;
  /** Auf der /team-Übersicht gezeigt. false heisst: nur auf den eigenen Projektseiten. */
  listed: boolean;
}

const LEGACY_PUBLIC_COLUMNS =
  "id, slug, name, role, bio, accent, photo_url, socials, is_lead, visible, sort";
export const PUBLIC_PROFILE_COLUMNS = `${LEGACY_PUBLIC_COLUMNS}, quote, contact_email, listed`;

function staticMembers(): TeamMember[] {
  return staticTeam.map((m, i) => ({
    id: m.slug,
    slug: m.slug,
    name: m.name,
    role: m.role,
    bio: m.bio,
    accent: m.accent,
    photo: m.photo,
    lead: Boolean(m.lead),
    sort: i * 10,
    socials: m.socials,
    quote: m.quote ?? "",
    contactEmail: m.email,
    listed: true,
    projects: projects.flatMap((p) =>
      p.team
        .filter((t) => t.slug === m.slug)
        .map((t) => ({ slug: p.slug, role: t.role })),
    ),
  }));
}

type ProfileRow = {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
  accent: string;
  photo_url: string | null;
  socials: unknown;
  is_lead: boolean;
  sort: number;
  quote?: string | null;
  contact_email?: string | null;
  listed?: boolean | null;
};

export function rowToMember(
  row: ProfileRow,
  memberships: { profile_id: string; project_slug: string; role: string }[],
): TeamMember {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    role: row.role,
    bio: row.bio,
    accent: row.accent,
    photo: row.photo_url ?? undefined,
    lead: row.is_lead,
    sort: row.sort,
    socials: cleanSocials(row.socials),
    quote: row.quote ?? "",
    contactEmail: row.contact_email ?? undefined,
    listed: row.listed ?? true,
    projects: memberships
      .filter((m) => m.profile_id === row.id)
      .map((m) => ({ slug: m.project_slug, role: m.role })),
  };
}

const bySort = (a: TeamMember, b: TeamMember) =>
  Number(b.lead) - Number(a.lead) || a.sort - b.sort || a.name.localeCompare(b.name);

// Öffentliches Team. Fällt auf die statischen Daten zurück, wenn Supabase
// fehlt oder nicht antwortet, damit die Seite nie leer ist.
export async function getTeam(): Promise<TeamMember[]> {
  if (!supabaseConfigured) return staticMembers().sort(bySort);
  try {
    const db = createPublicClient();
    const [profiles, members] = await Promise.all([
      withProfileColumns((cols) => db.from("profiles").select(cols).eq("visible", true), PUBLIC_PROFILE_COLUMNS, LEGACY_PUBLIC_COLUMNS),
      db.from("project_members").select("profile_id, project_slug, role"),
    ]);
    if (profiles.error || members.error) throw profiles.error ?? members.error;
    return (profiles.data as unknown as ProfileRow[])
      .map((r) => rowToMember(r, members.data ?? []))
      .sort(bySort);
  } catch (err) {
    console.error("Team aus Supabase nicht ladbar, nutze Fallback:", err);
    return staticMembers().sort(bySort);
  }
}

// Wer ist an einem Projekt beteiligt (für die Projektseiten).
export async function getProjectTeam(slug: string) {
  const team = await getTeam();
  return team.flatMap((m) =>
    m.projects
      .filter((p) => p.slug === slug)
      .map((p) => ({ name: m.name, slug: m.slug, role: p.role || m.role })),
  );
}
