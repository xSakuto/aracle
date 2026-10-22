"use client";

import { useState } from "react";

// Zeigt eine Easing-Kurve aus den Design-Tokens und lässt einen Punkt sie abfahren.
// Bewegt wird nur transform. Bei reduzierter Bewegung springt der Punkt ohne Übergang.
export default function EaseDemo({
  name,
  token,
  curve,
  duration,
  use,
}: {
  name: string;
  token: string;
  curve: [number, number, number, number];
  duration: number;
  use: string;
}) {
  const [on, setOn] = useState(false);
  const [x1, y1, x2, y2] = curve;
  // Kurve im Feld 0..100, y nach oben
  const d = `M0 100 C ${x1 * 100} ${100 - y1 * 100}, ${x2 * 100} ${100 - y2 * 100}, 100 0`;

  return (
    <div className="border-t border-line pt-5">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-medium">{name}</h3>
        <span className="small nums text-muted">{duration} ms</span>
      </div>
      <p className="small mt-1 text-muted">{use}</p>

      <svg viewBox="-4 -4 108 108" className="mt-5 h-28 w-28 overflow-visible text-ink" aria-hidden>
        <path d="M0 0V100H100" fill="none" stroke="currentColor" strokeOpacity="0.18" vectorEffect="non-scaling-stroke" />
        <path d={d} fill="none" stroke="var(--color-aqua)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="@container relative mt-6 h-px bg-line">
        <span
          aria-hidden
          className="ease-dot absolute -top-[5px] left-0 h-[11px] w-[11px] rounded-full bg-aqua"
          style={{
            transform: on ? "translateX(calc(100cqw - 11px))" : "translateX(0)",
            transitionDuration: `${duration}ms`,
            transitionTimingFunction: `var(${token})`,
          }}
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <code className="small nums text-ink/70">{token}</code>
        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          aria-pressed={on}
          className="btn-quiet min-h-9 px-3 text-[0.875rem]"
        >
          {on ? "Zurück" : "Abspielen"}
        </button>
      </div>
    </div>
  );
}
