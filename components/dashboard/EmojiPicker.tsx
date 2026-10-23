"use client";

import { useMemo, useState } from "react";
import { SHORTCODES, customEmojiTag, emojiUrl, type CustomEmoji } from "@/lib/emoji";

// Klick fügt das Emoji an der Cursorposition ein: Server-Emojis als <:name:id>, Standard-Emojis direkt als Zeichen.
export default function EmojiPicker({
  emojis,
  onInsert,
}: {
  emojis: CustomEmoji[];
  onInsert: (text: string) => void;
}) {
  const [tab, setTab] = useState<"server" | "standard">(emojis.length ? "server" : "standard");
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const groups = useMemo(() => {
    const map = new Map<string, CustomEmoji[]>();
    for (const e of emojis) {
      if (query && !e.name.toLowerCase().includes(query)) continue;
      map.set(e.guild_name, [...(map.get(e.guild_name) ?? []), e]);
    }
    return [...map.entries()];
  }, [emojis, query]);

  const standard = useMemo(
    () => Object.entries(SHORTCODES).filter(([name]) => !query || name.includes(query)),
    [query],
  );

  const tabCls = (on: boolean) =>
    `h-8 rounded-[6px] px-3 text-sm transition-colors active:scale-[0.98] ${
      on ? "bg-[#24272c] text-ink" : "text-muted hover:text-ink"
    }`;

  return (
    <div className="rounded-[10px] border border-[#24272c]">
      <div className="flex flex-wrap items-center gap-2 border-b border-[#24272c] p-2">
        <button type="button" className={tabCls(tab === "server")} onClick={() => setTab("server")}>
          Server ({emojis.length})
        </button>
        <button type="button" className={tabCls(tab === "standard")} onClick={() => setTab("standard")}>
          Standard
        </button>
        <label className="sr-only" htmlFor="emoji-search">Emoji suchen</label>
        <input
          id="emoji-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Emoji suchen"
          autoComplete="off"
          className="dash-input ml-auto !h-8 max-w-[12rem]"
        />
      </div>

      <div className="max-h-60 overflow-y-auto p-2">
        {tab === "server" ? (
          emojis.length === 0 ? (
            <p className="p-2 text-sm text-muted">
              Noch keine Server-Emojis da. Der Bot liefert sie beim Start und danach alle 6 Stunden.
            </p>
          ) : groups.length === 0 ? (
            <p className="p-2 text-sm text-muted">Nichts gefunden.</p>
          ) : (
            groups.map(([guild, list]) => (
              <div key={guild} className="mb-3 last:mb-0">
                <p className="mb-1.5 px-1 text-xs text-muted">{guild || "Server"}</p>
                <div className="flex flex-wrap gap-1">
                  {list.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      title={`:${e.name}:`}
                      aria-label={`Emoji ${e.name} einfügen`}
                      onMouseDown={(ev) => ev.preventDefault()}
                      onClick={() => onInsert(customEmojiTag(e))}
                      className="grid h-9 w-9 place-items-center rounded-[6px] transition-colors hover:bg-[#24272c] active:scale-90"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={emojiUrl(e.id, e.animated, 48)} alt="" loading="lazy" className="h-7 w-7 bg-transparent object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            ))
          )
        ) : standard.length === 0 ? (
          <p className="p-2 text-sm text-muted">Nichts gefunden.</p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {standard.map(([name, char]) => (
              <button
                key={name}
                type="button"
                title={`:${name}:`}
                aria-label={`Emoji ${name} einfügen`}
                onMouseDown={(ev) => ev.preventDefault()}
                onClick={() => onInsert(char)}
                className="grid h-9 w-9 place-items-center rounded-[6px] text-xl transition-colors hover:bg-[#24272c] active:scale-90"
              >
                {char}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
