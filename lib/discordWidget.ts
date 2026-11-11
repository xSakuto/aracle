// Öffentliche Live-Daten aus dem Discord-Server-Widget (widget.json).
// Discord gibt dort höchstens 100 Online-Mitglieder heraus, mit Profilbild,
// Status, aktuellem Spiel und Sprachkanal. Schlägt die Abfrage fehl, gibt es null.

export interface WidgetMember {
  id: string;
  username: string;
  avatar_url: string;
  status: "online" | "idle" | "dnd";
  activity?: { name: string };
  channel_id?: string;
}

export interface WidgetData {
  presence_count: number;
  instant_invite?: string | null;
  channels: { id: string; name: string; position: number }[];
  members: WidgetMember[];
}

export interface LiveSummary {
  online: number;
  avatars: string[];
  /** Spiele, die gerade gespielt werden, meistgespielt zuerst */
  playing: { name: string; count: number }[];
  /** Sprachkanäle mit Leuten drin */
  voice: { name: string; count: number }[];
}

export const widgetUrl = (guildId: string) => `https://discord.com/api/guilds/${guildId}/widget.json`;

export function summarize(d: WidgetData): LiveSummary {
  const playing = new Map<string, number>();
  const voice = new Map<string, number>();
  for (const m of d.members ?? []) {
    const game = m.activity?.name?.trim();
    if (game && game.length <= 60) playing.set(game, (playing.get(game) ?? 0) + 1);
    if (m.channel_id) voice.set(m.channel_id, (voice.get(m.channel_id) ?? 0) + 1);
  }
  const channelName = (id: string) => d.channels?.find((c) => c.id === id)?.name ?? "Sprachkanal";
  return {
    online: d.presence_count ?? 0,
    // Nur Profilbilder, keine Namen: die Seite zeigt, dass Leute da sind, nicht wer
    avatars: (d.members ?? []).filter((m) => m.avatar_url).slice(0, 7).map((m) => m.avatar_url),
    playing: [...playing].map(([name, count]) => ({ name: name.replace(/^The Legend of Zelda: /, ""), count })).sort((a, b) => b.count - a.count).slice(0, 4),
    voice: [...voice].map(([id, count]) => ({ name: channelName(id), count })).sort((a, b) => b.count - a.count).slice(0, 3),
  };
}

export async function getLiveSummary(guildId: string): Promise<LiveSummary | null> {
  try {
    const res = await fetch(widgetUrl(guildId), { next: { revalidate: 120 }, signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    return summarize((await res.json()) as WidgetData);
  } catch {
    return null;
  }
}
