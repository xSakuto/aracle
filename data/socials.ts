// Plattformen, die Teammitglieder in ihrem Profil angeben können.
export const SOCIAL_TYPES = [
  "instagram",
  "tiktok",
  "youtube",
  "x",
  "discord",
  "twitch",
  "github",
  "linkedin",
  "website",
] as const;

export type SocialType = (typeof SOCIAL_TYPES)[number];

export interface Social {
  type: SocialType;
  url: string;
}

export const SOCIAL_LABELS: Record<SocialType, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
  discord: "Discord",
  twitch: "Twitch",
  github: "GitHub",
  linkedin: "LinkedIn",
  website: "Website",
};

export const SOCIAL_PLACEHOLDERS: Record<SocialType, string> = {
  instagram: "https://instagram.com/deinname",
  tiktok: "https://tiktok.com/@deinname",
  youtube: "https://youtube.com/@deinname",
  x: "https://x.com/deinname",
  discord: "https://discord.gg/einladung",
  twitch: "https://twitch.tv/deinname",
  github: "https://github.com/deinname",
  linkedin: "https://linkedin.com/in/deinname",
  website: "https://deine-seite.ch",
};

// Prüft und normalisiert eine Liste aus dem Formular.
export function cleanSocials(input: unknown): Social[] {
  if (!Array.isArray(input)) return [];
  const out: Social[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== "object") continue;
    const type = (raw as { type?: string }).type as SocialType;
    let url = String((raw as { url?: string }).url ?? "").trim();
    if (!SOCIAL_TYPES.includes(type) || !url) continue;
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    try {
      const u = new URL(url);
      if (u.protocol !== "https:" && u.protocol !== "http:") continue;
      out.push({ type, url: u.toString() });
    } catch {
      continue;
    }
  }
  return out.slice(0, 12);
}
