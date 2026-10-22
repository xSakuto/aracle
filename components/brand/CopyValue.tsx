"use client";

import { useEffect, useRef, useState } from "react";

// Ein Farbwert oder Token, der sich per Klick kopieren lässt.
export default function CopyValue({ value, label }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  const t = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(t.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      window.clearTimeout(t.current);
      t.current = window.setTimeout(() => setDone(false), 1400);
    } catch {
      // Ohne Zwischenablage-Zugriff bleibt der Wert sichtbar und markierbar.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label ?? value} kopieren`}
      className="seg-host group relative inline-flex min-h-9 items-center gap-2 text-left transition-colors hover:text-aqua active:opacity-70"
    >
      <span className="nums select-all">{value}</span>
      <span aria-hidden className="small text-muted transition-colors group-hover:text-aqua">
        {done ? "Kopiert" : "Kopieren"}
      </span>
      <span aria-hidden className="seg" style={{ bottom: "0.25rem" }} />
      <span className="sr-only" aria-live="polite">{done ? `${value} kopiert` : ""}</span>
    </button>
  );
}
