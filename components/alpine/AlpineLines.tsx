"use client";

import { useEffect, useMemo, useRef } from "react";
import { ridge, ridgeY, SUMMITS } from "@/lib/alpine";

const W = 1600;

/**
 * Alpine Line Art: feine Bergketten in mehreren Ebenen.
 * - draw="load": Linien zeichnen sich, sobald sie ins Bild kommen
 * - draw="scroll": Linien zeichnen sich mit dem Scrollfortschritt (für Übergänge)
 * Hintere Ebenen bewegen sich langsamer (Scroll) und weniger (Maus).
 */
export default function AlpineLines({
  height = 360,
  layers = 4,
  seed = 7,
  annotate = false,
  draw = "load",
  className = "",
  strong = false,
}: {
  height?: number;
  layers?: number;
  seed?: number;
  annotate?: boolean;
  draw?: "load" | "scroll";
  className?: string;
  strong?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const groups = useRef<(SVGGElement | null)[]>([]);
  const paths = useRef<(SVGPathElement | null)[]>([]);

  const ridges = useMemo(
    () => Array.from({ length: layers }, (_, i) => ridge(W, height, layers - 1 - i, seed)),
    [layers, height, seed],
  );
  const front = ridges[ridges.length - 1];

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (reduce) {
      el.classList.add("is-drawn");
      paths.current.forEach((p) => p && (p.style.strokeDashoffset = "0"));
      return;
    }

    let inView = false;
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView && draw === "load") el.classList.add("is-drawn");
      },
      { threshold: 0.15 },
    );
    io.observe(el);

    const mouse = { x: 0, tx: 0 };
    const onMove = (e: PointerEvent) => (mouse.tx = e.clientX / innerWidth - 0.5);
    if (fine) addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!inView) return;
      const r = el.getBoundingClientRect();
      // -1 (unter dem Bild) .. 1 (über dem Bild)
      const p = 1 - (r.top + r.height / 2) / (innerHeight / 2 + r.height / 2);
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      const n = groups.current.length;
      groups.current.forEach((g, i) => {
        if (!g) return;
        const depth = (i + 1) / n; // vorne = 1
        const ty = -p * 18 * (1 - depth) * 2;
        const tx = mouse.x * 14 * depth;
        g.setAttribute("transform", `translate(${tx.toFixed(2)} ${ty.toFixed(2)})`);
      });
      if (draw === "scroll") {
        const prog = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.75)));
        paths.current.forEach((path, i) => {
          if (!path) return;
          const lag = i * 0.08;
          const v = Math.min(1, Math.max(0, (prog - lag) / (1 - lag)));
          path.style.strokeDashoffset = String(1 - v);
        });
      }
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener("pointermove", onMove);
    };
  }, [draw]);

  return (
    <div
      ref={host}
      aria-hidden
      className={`alpine pointer-events-none relative w-full ${draw === "load" ? "alpine-load" : ""} ${className}`}
      style={{ aspectRatio: `${W} / ${height}` }}
    >
      <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
        {ridges.map((r, i) => {
          const depth = (i + 1) / ridges.length;
          const isFront = i === ridges.length - 1;
          return (
            <g key={i} ref={(g) => { groups.current[i] = g; }}>
              <path
                ref={(p) => { paths.current[i] = p; }}
                d={r.d}
                pathLength={1}
                fill="none"
                vectorEffect="non-scaling-stroke"
                className="alpine-path"
                style={{
                  stroke: isFront && strong ? "var(--color-aqua)" : "var(--color-ink)",
                  strokeOpacity: isFront ? (strong ? 0.95 : 0.7) : 0.12 + depth * 0.32,
                  strokeWidth: isFront ? 1.25 : 1,
                  ["--d" as string]: `${(ridges.length - 1 - i) * 220}ms`,
                }}
              />
            </g>
          );
        })}
      </svg>

      {annotate &&
        SUMMITS.map((s, i) => {
          const [x, y] = ridgeY(front, s.x);
          return (
            <div
              key={s.name}
              className={`alpine-label absolute flex flex-col items-center ${i === 1 ? "" : "max-md:hidden"}`}
              style={{
                left: `${(x / W) * 100}%`,
                bottom: `${(1 - y / height) * 100}%`,
                ["--d" as string]: `${1400 + i * 160}ms`,
              }}
            >
              <span className="whitespace-nowrap text-[0.6875rem] font-medium tracking-[0.02em] text-ink/70">
                {s.name}
              </span>
              <span className="nums text-[0.6875rem] text-aqua">{s.m} m</span>
              <span className={`mt-1 block w-px bg-ink/30 ${i === 1 ? "h-10" : "h-4"}`} />
            </div>
          );
        })}
    </div>
  );
}
