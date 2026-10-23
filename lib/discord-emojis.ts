import type { CustomEmoji } from "@/lib/emoji";
import type { createSessionClient } from "@/lib/supabase/server";

type Client = Awaited<ReturnType<typeof createSessionClient>>;

// Server-Emojis, die der Discord-Bot an die Datenbank liefert (nur für Admins lesbar).
export async function getDiscordEmojis(supabase: Client): Promise<CustomEmoji[]> {
  const { data, error } = await supabase
    .from("discord_emojis")
    .select("id, name, animated, guild_name")
    .order("guild_name")
    .order("name");
  if (error || !data) return [];
  return data as CustomEmoji[];
}
