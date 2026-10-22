"use client";

import { useEffect, useMemo, useRef } from "react";
import { contours } from "@/lib/alpine";

// Topografische Höhenlinien als ruhiger Hintergrund. Zeichnen sich beim Erscheinen.
export default function Topo({
  className = "",
  rings = 10,
  seed = 3,
}: {
  className?: string;
  rings?: number;
  seed?: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const paths = useMemo(() => contours(500, 300, rings, 30, seed), [rings, seed]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && el.classList.add("is-drawn"), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg ref={ref} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden className={`topo pointer-events-none ${className}`}>
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          style={{
            stroke: i === 3 ? "var(--color-aqua)" : "var(--color-ink)",
            strokeOpacity: i === 3 ? 0.5 : 0.06 + (i / paths.length) * 0.1,
            strokeWidth: 1,
            ["--d" as string]: `${i * 120}ms`,
          }}
        />
      ))}
    </svg>
  );
}
