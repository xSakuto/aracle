"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { JourneyStage } from "@/data/journey";
import { getProject, projectHref } from "@/data/projects";

/**
 * The Aracle Journey: eine Weglinie, die sich beim Scrollen durch die Stationen zieht.
 * - Grundlinie gepunktet und zurückhaltend, der zurückgelegte Weg in Gletscherblau
 * - Ein Punkt wandert als "Wanderer" auf der Linie mit
 * - Erreichte Stationen werden hervorgehoben, die aktuelle am stärksten
 * Desktop: der Weg pendelt in Serpentinen zwischen den Stationen.
 * Mobile: der Weg läuft am linken Rand.
 */
export default function Journey({ stages }: { stages: JourneyStage[] }) {
  const root = useRef<HTMLDivElement>(null);
  const base = useRef<SVGPathElement>(null);
  const prog = useRef<SVGPathElement>(null);
  const walker = useRef<SVGGElement>(null);
  const [d, setD] = useState("");
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [reached, setReached] = useState(-1);
  const [current, setCurrent] = useState(-1);

  // Pfad aus den Positionen der Stationen bauen
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const build = () => {
      const r = el.getBoundingClientRect();
      const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-node]"));
      const pts = nodes.map((n) => {
        const b = n.getBoundingClientRect();
        return [b.left + b.width / 2 - r.left, b.top + b.height / 2 - r.top] as [number, number];
      });
      if (!pts.length) return;
      const wide = innerWidth >= 768;
      let path = `M${pts[0][0]} 0 L${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1];
        const [x1, y1] = pts[i];
        const dy = y1 - y0;
        if (wide) {
          // Serpentine: über einen versetzten Zwischenpunkt, wie ein Bergpfad
          const mx = (x0 + x1) / 2 + (i % 2 ? 1 : -1) * Math.min(64, r.width * 0.045); // bleibt im Mittelkorridor, kreuzt keinen Text
          const my = y0 + dy / 2;
          path += ` C${x0} ${y0 + dy * 0.28} ${mx} ${my - dy * 0.2} ${mx} ${my}`;
          path += ` S${x1} ${y1 - dy * 0.28} ${x1} ${y1}`;
        } else {
          const sway = (i % 2 ? 1 : -1) * 8;
          path += ` C${x0 + sway} ${y0 + dy * 0.4} ${x1 - sway} ${y1 - dy * 0.4} ${x1} ${y1}`;
        }
      }
      const last = pts[pts.length - 1];
      path += ` L${last[0]} ${r.height}`;
      setBox({ w: r.width, h: r.height });
      setD(path);
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(el);
    document.fonts?.ready.then(build);
    return () => ro.disconnect();
  }, []);

  // Fortschritt an den Scroll koppeln
  useEffect(() => {
    const el = root.current;
    const p = prog.current;
    const b = base.current;
    if (!el || !p || !b || !d) return;
    const len = p.getTotalLength();
    p.style.strokeDasharray = `${len}`;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-node]"));
    const nodeY = () => {
      const r = el.getBoundingClientRect();
      return nodes.map((n) => {
        const nb = n.getBoundingClientRect();
        return nb.top + nb.height / 2 - r.top;
      });
    };

    if (reduce) {
      p.style.strokeDashoffset = "0";
      setReached(nodes.length - 1);
      setCurrent(nodes.length - 1);
      return;
    }

    let ys = nodeY();
    let raf = 0;
    let lastReached = -2;
    let lastCurrent = -2;
    // Länge entlang des Pfads für eine Höhe y finden (Pfad läuft monoton nach unten)
    const lengthAtY = (y: number) => {
      let lo = 0;
      let hi = len;
      for (let k = 0; k < 18; k++) {
        const mid = (lo + hi) / 2;
        if (p.getPointAtLength(mid).y < y) lo = mid;
        else hi = mid;
      }
      return lo;
    };

    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // Der "Wanderer" steht auf 60 % der Bildschirmhöhe
      const y = Math.min(r.height, Math.max(0, innerHeight * 0.6 - r.top));
      const l = lengthAtY(y);
      p.style.strokeDashoffset = String(len - l);
      const pt = p.getPointAtLength(l);
      walker.current?.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      let reachedIdx = -1;
      ys.forEach((ny, i) => {
        if (ny <= y + 4) reachedIdx = i;
      });
      // Aktuell = die erreichte Station, die der Bildmitte am nächsten ist
      let cur = reachedIdx;
      if (reachedIdx < ys.length - 1 && reachedIdx >= 0) {
        const next = ys[reachedIdx + 1];
        if (next - y < innerHeight * 0.18) cur = reachedIdx + 1;
      }
      if (reachedIdx !== lastReached) {
        lastReached = reachedIdx;
        setReached(reachedIdx);
      }
      if (cur !== lastCurrent) {
        lastCurrent = cur;
        setCurrent(cur);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onResize = () => {
      ys = nodeY();
      onScroll();
    };
    tick();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
    };
  }, [d]);

  return (
    <div ref={root} className="journey relative">
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-visible"
        width={box.w}
        height={box.h}
        viewBox={`0 0 ${box.w || 1} ${box.h || 1}`}
      >
        <path ref={base} d={d} fill="none" className="journey-base" />
        <path ref={prog} d={d} fill="none" className="journey-progress" />
        <g ref={walker} className="journey-walker">
          <circle r="14" className="journey-walker-halo" />
          <circle r="4.5" className="journey-walker-dot" />
        </g>
      </svg>

      <ol className="relative">
        {stages.map((s, i) => {
          const left = i % 2 === 0;
          const isReached = i <= reached;
          const isCurrent = i === current;
          return (
            <li
              key={s.year}
              data-state={isCurrent ? "current" : isReached ? "reached" : "ahead"}
              className="journey-stage relative grid grid-cols-12 gap-x-3 py-14 md:gap-x-8 md:py-20"
            >
              {/* Station auf dem Weg */}
              <span
                data-node
                aria-hidden
                className={`journey-node absolute left-[14px] top-[4.6rem] -translate-x-1/2 md:top-[6.4rem] ${left ? "md:left-[53%]" : "md:left-[47%]"}`}
              />

              <div
                className={`col-span-12 pl-12 md:pl-0 ${
                  left ? "md:col-span-5 md:col-start-8" : "md:col-span-5 md:col-start-1 md:text-right"
                }`}
              >
                <p className="journey-year nums">{s.year}</p>
                <h2 className="mt-2 text-[clamp(1.375rem,1rem+1vw,1.875rem)] font-[620] tracking-[-0.03em]">
                  {s.chapter}
                </h2>
                <ul className={`mt-6 flex flex-col gap-6 ${left ? "" : "md:items-end"}`}>
                  {s.items.map((it) => (
                    <li key={it.name} className="journey-item max-w-[30rem]">
                      <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${left ? "" : "md:justify-end"}`}>
                        <h3 className="text-[1.125rem] font-semibold tracking-[-0.015em]">
                          {it.project ? (
                            <Link href={projectHref(getProject(it.project) ?? { slug: it.project })} className="transition-colors hover:text-aqua">
                              {it.name}
                            </Link>
                          ) : (
                            it.name
                          )}
                        </h3>
                        {it.tag && (
                          <span className="rounded-full border border-line px-2.5 py-0.5 text-[0.75rem] text-muted">
                            {it.tag}
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-ink/75">{it.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
