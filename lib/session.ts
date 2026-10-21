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
  is_lead: boolean;
  is_admin: boolean;
  visible: boolean;
  sort: number;
  projects: { slug: string; role: string }[];
}

export const FULL_COLUMNS =
  "id, user_id, email, slug, name, role, bio, accent, photo_url, socials, is_lead, is_admin, visible, sort";

type Row = Omit<FullProfile, "socials" | "projects"> & { socials: unknown };

export function toProfile(
  row: Row,
  members: { profile_id: string; project_slug: string; role: string }[],
): FullProfile {
  return {
    ...row,
    socials: cleanSocials(row.socials),
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

  const { data: row } = await supabase
    .from("profiles")
    .select(FULL_COLUMNS)
    .eq("user_id", user.id)
    .maybeSingle();

  let me: FullProfile | null = null;
  if (row) {
    const { data: members } = await supabase
      .from("project_members")
      .select("profile_id, project_slug, role")
      .eq("profile_id", (row as Row).id);
    me = toProfile(row as Row, members ?? []);
  }
  return { supabase, user, me };
}

export async function requireAdmin() {
  const ctx = await requireMember();
  if (!ctx.me?.is_admin) redirect("/dashboard");
  return ctx as typeof ctx & { me: FullProfile };
}
