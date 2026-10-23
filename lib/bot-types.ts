// Typen und reine Helfer für die Bot-Seiten. Ohne Server-Code, damit auch Komponenten im Browser sie nutzen können.

export interface BotGuild {
  id: string;
  name: string;
  rank_type: "voice" | "text" | null;
  present: boolean;
}

export interface Health {
  ok: boolean;
  version: string | null;
  guilds: BotGuild[];
}

export interface Person {
  id: string;
  name: string;
  avatar: string;
}

export interface Overview {
  guild: { id: string; name: string; rank_type: "voice" | "text" | null };
  stats: {
    members: number;
    in_voice: number;
    voice_total_seconds: number;
    counting: { next: number; streak: number; record: number };
    wordchain: { streak: number; record: number };
    oneword: { streak: number; record: number };
  };
  top_xp: (Person & { xp: number; level: number })[];
  top_voice: (Person & { seconds: number })[];
}

export interface ModAction {
  action: string;
  target_name: string | null;
  target_id: string | null;
  moderator: string | null;
  reason: string | null;
  ts: number;
}

export interface TicketRow {
  channel_id: string;
  number: number;
  category: string;
  subject: string | null;
  user_id: string;
  user_name: string;
  status: string;
  opened_ts: number;
  claimed_by: string | null;
  channel_exists: boolean;
}

export interface Moderation {
  actions: ModAction[];
  tickets: TicketRow[];
}

export interface MemberRow extends Person {
  xp: number;
  level: number;
  seconds: number;
  rank: string | null;
}

export interface MemberList {
  rank_type: "voice" | "text" | null;
  members: MemberRow[];
}

export interface MemberDetail extends Person {
  xp: number;
  level: number;
  messages: number;
  seconds: number;
  progress: { xp_in: number; xp_next: number };
  rank: string | null;
  roles: { id: string; name: string }[];
  assignable_roles: { id: string; name: string; has: boolean }[];
  rank_options: { role_id: string; label: string }[];
}

// Der gewählte Server: der aus der Adresse, sonst der erste, in dem der Bot ist.
export function pickGuild(guilds: BotGuild[], wanted?: string) {
  const present = guilds.filter((g) => g.present);
  return present.find((g) => g.id === wanted) ?? present[0] ?? null;
}

export function fmtDuration(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h) return `${h} Std ${m} Min`;
  if (m) return `${m} Min`;
  return `${s} Sek`;
}

export const fmtNum = (n: number) => new Intl.NumberFormat("de-CH").format(n);
