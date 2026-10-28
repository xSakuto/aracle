// Reine Konstanten, kein Server-Code: dürfen auch in Client-Komponenten importiert werden.

/** Dashboard-Bereiche, die sich einzeln freigeben lassen, ohne Vollzugriff (is_admin) zu geben. */
export const PERMISSIONS = ["bot", "news", "anfragen", "projekte"] as const;
export type Permission = (typeof PERMISSIONS)[number];
export const PERMISSION_LABELS: Record<Permission, string> = {
  bot: "Discord-Bot",
  news: "News",
  anfragen: "Anfragen",
  projekte: "Projekte",
};
