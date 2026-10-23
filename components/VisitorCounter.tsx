"use client";

import { useEffect, useRef, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { supabaseConfigured } from "@/lib/supabase/config";

// Zählt pro Browser einmal pro Session hoch (sessionStorage), liest danach den
// aktuellen Stand. Rein clientseitig, damit die Seiten weiter statisch bleiben.
export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const displayedRef = useRef(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!supabaseConfigured) return;
    let active = true;
    const supabase = createBrowserSupabase();

    async function run() {
      try {
        const alreadyCounted = sessionStorage.getItem("aracle-visit-counted");
        if (!alreadyCounted) {
          const { data, error } = await supabase.rpc("increment_site_visits");
          if (!error && typeof data === "number") {
            sessionStorage.setItem("aracle-visit-counted", "1");
            if (active) setCount(data);
            return;
          }
        }
        const { data } = await supabase.from("site_visits").select("count").eq("id", 1).single();
        if (active && data) setCount(data.count as number);
      } catch {
        // Zähler ist dekorativ, kein Fehler soll die Seite stören.
      }
    }
    run();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (count === null) return;
    const from = displayedRef.current;
    const to = count;
    const duration = 900;
    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from + (to - from) * eased);
      setDisplay(value);
      displayedRef.current = value;
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count]);

  if (count === null) return null;

  return (
    <p className="inline-flex items-center gap-[0.4em] text-ink/85">
      <span aria-hidden className="h-[0.45em] w-[0.45em] rounded-full bg-aqua" />
      <span className="nums tabular-nums">{display.toLocaleString("de-CH")}</span>
      <span className="text-muted">Besuche</span>
    </p>
  );
}
