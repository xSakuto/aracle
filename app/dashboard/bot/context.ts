import { botFetch, pickGuild, type Health } from "@/lib/bot-api";
import { requirePermission } from "@/lib/session";

// Gemeinsamer Einstieg aller Bot-Seiten: Admin prüfen, Bot fragen, Server wählen.
export async function botContext(wanted?: string) {
  const { user } = await requirePermission("bot");
  const who = user.email ?? user.id;
  try {
    const health = await botFetch<Health>("/api/site/health", { user: who });
    return { who, health, guild: pickGuild(health.guilds, wanted), error: null as string | null };
  } catch (err) {
    return {
      who,
      health: null as Health | null,
      guild: null,
      error: err instanceof Error ? err.message : "Unbekannter Fehler",
    };
  }
}
