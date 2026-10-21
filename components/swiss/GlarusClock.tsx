"use client";

import { useEffect, useState } from "react";

// Aktuelle Uhrzeit in Glarus, läuft live mit.
export default function GlarusClock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("de-CH", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const t = window.setInterval(tick, 15000);
    return () => window.clearInterval(t);
  }, []);
  return <span className="nums" suppressHydrationWarning>{now ?? "--:--"}</span>;
}
