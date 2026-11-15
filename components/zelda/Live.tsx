"use client";

import { useEffect, useState } from "react";
import { summarize, widgetUrl, type LiveSummary, type WidgetData } from "@/lib/discordWidget";

// Live-Daten aus dem Discord-Widget. Der Server liefert einen Startwert mit,
// im Browser wird jede Minute nachgeladen. Alle Teile der Seite teilen sich eine Abfrage.

const fmt = new Intl.NumberFormat("de-CH");
let shared: { at: number; p: Promise<LiveSummary | null> } | null = null;

function load(guildId: string) {
  if (shared && Date.now() - shared.at < 55_000) return shared.p;
  const p = fetch(widgetUrl(guildId), { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => (d ? summarize(d as WidgetData) : null))
    .catch(() => null);
  shared = { at: Date.now(), p };
  return p;
}

function useLive(guildId: string, initial: LiveSummary | null) {
  const [live, setLive] = useState(initial);
  useEffect(() => {
    let alive = true;
    const tick = () => load(guildId).then((s) => alive && s && setLive(s));
    tick();
    const id = setInterval(tick, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [guildId]);
  return live;
}

// Hero: Profilbilder übereinander und die Zahl der Leute online
export function LiveOnline({ guildId, initial, members }: { guildId: string; initial: LiveSummary | null; members?: number }) {
  const live = useLive(guildId, initial);
  if (!live && !members) return null;
  return (
    <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[1.0625rem] md:justify-start" aria-live="polite">
      {live && live.online > 0 && (
        <p className="flex items-center gap-3">
          {live.avatars.length > 0 && (
            <span aria-hidden className="flex -space-x-2.5">
              {live.avatars.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" width={32} height={32} loading="lazy" className="h-8 w-8 rounded-full bg-[var(--zelda-surface)] ring-2 ring-[var(--zelda-bg)]" />
              ))}
            </span>
          )}
          <span className="flex items-center gap-2">
            <span aria-hidden className="relative flex h-2.5 w-2.5">
              <span className="status-ping absolute inset-0 rounded-full bg-[#3ddc84]" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-[#3ddc84]" />
            </span>
            <span><span className="nums font-semibold">{fmt.format(live.online)}</span> gerade online</span>
          </span>
        </p>
      )}
      {members ? (
        <p className="flex items-center gap-2 text-ink/75">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-ink/35" />
          <span><span className="nums font-semibold text-ink">{fmt.format(members)}</span> Mitglieder</span>
        </p>
      ) : null}
    </div>
  );
}

// Was gerade los ist: welche Spiele laufen, wer im Sprachkanal ist.
// Erscheint nur, wenn es etwas zu zeigen gibt.
export function LiveNow({ guildId, initial }: { guildId: string; initial: LiveSummary | null }) {
  const live = useLive(guildId, initial);
  if (!live || (live.playing.length === 0 && live.voice.length === 0)) return null;
  return (
    <section aria-labelledby="jetzt" className="wrap pb-16 md:pb-24">
      <h2 id="jetzt" className="flex items-center gap-3 text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] font-bold leading-[1] tracking-[-0.035em]">
        <span aria-hidden className="relative flex h-3 w-3">
          <span className="status-ping absolute inset-0 rounded-full bg-[#3ddc84]" />
          <span className="relative h-3 w-3 rounded-full bg-[#3ddc84]" />
        </span>
        Gerade los.
      </h2>
      <ul className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
        {live.voice.map((v) => (
          <li key={`v-${v.name}`} className="flex min-w-0 items-center justify-between gap-4 rounded-[18px] bg-[var(--zelda-surface)] p-5 ring-1 ring-aqua/15">
            <span className="min-w-0">
              <span className="block text-[0.9375rem] text-ink/60">Im Sprachkanal</span>
              <span className="block truncate text-[1.25rem] font-semibold tracking-[-0.02em]">{v.name}</span>
            </span>
            <span className="nums shrink-0 text-[1.125rem] text-aqua">{v.count} {v.count === 1 ? "Person" : "Leute"}</span>
          </li>
        ))}
        {live.playing.map((g) => (
          <li key={`g-${g.name}`} className="flex min-w-0 items-center justify-between gap-4 rounded-[18px] bg-[var(--zelda-surface)] p-5 ring-1 ring-aqua/15">
            <span className="min-w-0">
              <span className="block text-[0.9375rem] text-ink/60">Wird gespielt</span>
              <span className="block truncate text-[1.25rem] font-semibold tracking-[-0.02em]">{g.name}</span>
            </span>
            <span className="nums shrink-0 text-[1.125rem] text-aqua">{g.count} {g.count === 1 ? "Person" : "Leute"}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Für die mitlaufende Leiste: nur die Zahl, live
export function LiveOnlineText({ guildId, initial }: { guildId: string; initial: LiveSummary | null }) {
  const live = useLive(guildId, initial);
  if (!live?.online) return null;
  return (
    <span className="flex items-center gap-1.5 text-[0.8125rem] text-ink/70">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#3ddc84]" />
      {fmt.format(live.online)} gerade online
    </span>
  );
}
