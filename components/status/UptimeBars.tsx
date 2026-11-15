"use client";

import { useState } from "react";
import type { DayBar } from "@/lib/status/data";
import { pct } from "@/lib/status/format";

const date = new Intl.DateTimeFormat("de-CH", { weekday: "short", day: "numeric", month: "long", timeZone: "UTC" });

export function tone(uptime: number | null) {
  if (uptime === null) return "bg-line";
  if (uptime >= 0.995) return "bg-aqua";
  if (uptime >= 0.95) return "bg-glow";
  return "bg-danger";
}

// 90 Tage als feine Balken. Antippen oder Überfahren zeigt den Tag.
// Auf dem Handy die letzten 30 Tage, sonst werden die Balken zu dünn.
export default function UptimeBars({ days, label }: { days: DayBar[]; label: string }) {
  const [active, setActive] = useState<number | null>(null);
  const shown = days;
  const a = active === null ? null : shown[active];

  return (
    <div className="relative">
      <ol
        aria-label={`Verfügbarkeit von ${label} pro Tag`}
        className="flex h-9 items-stretch gap-[2px]"
        onMouseLeave={() => setActive(null)}
      >
        {shown.map((d, i) => (
          <li key={d.day} className={`flex-1 ${i < shown.length - 30 ? "hidden md:flex" : "flex"}`}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(active === i ? null : i)}
              aria-label={`${date.format(new Date(d.day))}: ${d.uptime === null ? "keine Daten" : pct(d.uptime)}`}
              className={`w-full rounded-[2px] transition-[opacity,transform] duration-150 hover:scale-y-110 focus-visible:scale-y-110 focus-visible:outline-none ${tone(d.uptime)} ${
                active !== null && active !== i ? "opacity-40" : "opacity-100"
              }`}
            />
          </li>
        ))}
      </ol>
      {/* Unter den Balken: entweder die Zeitachse oder der gewählte Tag */}
      <div className="small mt-2 flex min-h-5 justify-between gap-4 text-muted" aria-live="polite">
        {a ? (
          <p>
            <span className="text-ink">{date.format(new Date(a.day))}</span>
            {", "}
            {a.uptime === null
              ? "keine Daten"
              : a.uptime === 1
                ? "keine Ausfälle"
                : `${pct(a.uptime)} erreichbar, etwa ${a.checks - a.ok} Min. gestört`}
            {a.avgLatency !== null && a.uptime !== null && `, ${a.avgLatency} ms`}
          </p>
        ) : (
          <>
            <span>
              <span className="md:hidden">vor 30 Tagen</span>
              <span className="hidden md:inline">vor 90 Tagen</span>
            </span>
            <span>heute</span>
          </>
        )}
      </div>
    </div>
  );
}

