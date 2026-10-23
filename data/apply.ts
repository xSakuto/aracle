// Bereiche, für die man sich bei Aracle bewerben kann. Wie die Rollen auf dem Discord.
export const APPLY_ROLES = [
  { key: "developer", label: "Developer", text: "Technische Umsetzung, Bots, Server und Systeme." },
  { key: "creative", label: "Creative", text: "Grafik, Design, Video und alles Kreative." },
  { key: "community", label: "Community & Moderation", text: "Moderation, Organisation und Community-Support." },
  { key: "partner", label: "Externe Mods", text: "Twitch-Mods und Partner-Teams, die projektbezogen unterstützen." },
] as const;

export type ApplyRole = (typeof APPLY_ROLES)[number]["key"];
export const roleLabel = (k: string) => APPLY_ROLES.find((r) => r.key === k)?.label ?? k;
