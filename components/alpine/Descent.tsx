"use client";

import { useEffect, useMemo, useRef } from "react";
import { DESCENT } from "@/data/panorama/descent";
import { meters } from "@/lib/panorama";

const W = 200;
const H = 420;
const PAD = 14;

/**
 * Abstieg vom Vrenelisgärtli nach Glarus als echtes Geländeprofil.
 * Die Marke folgt dem Lesefortschritt: oben der Gipfel, unten das Tal.
 */
export default function Descent({ className = "" }: { className?: string }) {
  const path = useRef<SVGPathElement>(null);
  const done = useRef<SVGPathElement>(null);
  const dot = useRef<SVGGElement>(null);
  const alt = useRef<HTMLSpanElement>(null);
  const km = useRef<HTMLSpanElement>(null);

  const { d, xs, ys, top, bottom } = useMemo(() => {
    const pts = DESCENT.points;
    const top = DESCENT.from.m;
    const bottom = 400;
    const xs = pts.map(([k]) => PAD + (k / DESCENT.km) * (W - PAD * 2));
    const ys = pts.map(([, m]) => PAD + ((top - m) / (top - bottom)) * (H - PAD * 2));
    const d = "M" + xs.map((x, i) => `${x.toFixed(1)} ${ys[i].toFixed(1)}`).join("L");
    return { d, xs, ys, top, bottom };
  }, []);

  useEffect(() => {
    const p = path.current;
    if (!p) return;
    const len = p.getTotalLength();
    let raf = 0;
    let last = -1;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const prog = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      const q = Math.round(prog * 500) / 500;
      if (q === last) return;
      last = q;
      const pt = p.getPointAtLength(q * len);
      dot.current?.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
      if (done.current) done.current.style.strokeDashoffset = String(1 - q);
      // Höhe und Distanz an dieser Stelle aus den Profildaten
      const m = top - ((pt.y - PAD) / (H - PAD * 2)) * (top - bottom);
      const k = ((pt.x - PAD) / (W - PAD * 2)) * DESCENT.km;
      if (alt.current) alt.current.textContent = `${meters(Math.round(m / 10) * 10)} m`;
      if (km.current) km.current.textContent = `${k.toFixed(1)} km`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    // Kein Effekt, nur Anzeige des Lesestands; darum auch bei reduzierter Bewegung aktiv
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [top, bottom]);

  const ticks = [2500, 2000, 1500, 1000, 500];
  return (
    <figure aria-label={`Höhenprofil vom ${DESCENT.from.name} nach ${DESCENT.to.name}`} className={className}>
      <div className="flex items-baseline justify-between text-[0.6875rem] text-muted">
        <span>
          <span className="font-medium text-ink/85">{DESCENT.from.name}</span> {meters(DESCENT.from.m)} m
        </span>
      </div>
      <div className="relative mt-3" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" fill="none" aria-hidden>
          {ticks.map((t) => {
            const y = PAD + ((top - t) / (top - bottom)) * (H - PAD * 2);
            return (
              <g key={t}>
                <line x1={0} x2={W} y1={y} y2={y} stroke="var(--color-line)" strokeDasharray="2 5" vectorEffect="non-scaling-stroke" />
                <text x={W} y={y - 4} textAnchor="end" className="nums" fontSize="9" fill="var(--color-muted)">{meters(t)}</text>
              </g>
            );
          })}
          <path ref={path} d={d} stroke="var(--color-ink)" strokeOpacity={0.35} strokeWidth={1} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          <path
            ref={done}
            d={d}
            pathLength={1}
            stroke="var(--color-aqua)"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
          />
          <circle cx={xs[0]} cy={ys[0]} r={3} fill="var(--color-ink)" />
          <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r={3} fill="var(--color-ink)" />
          <g ref={dot} transform={`translate(${xs[0]} ${ys[0]})`}>
            <circle r={6} fill="var(--color-bg)" stroke="var(--color-aqua)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
            <circle r={2} fill="var(--color-aqua)" />
          </g>
        </svg>
      </div>
      <div className="mt-3 flex items-baseline justify-between text-[0.6875rem] text-muted">
        <span>
          <span className="font-medium text-ink/85">{DESCENT.to.name}</span> {meters(DESCENT.to.m)} m
        </span>
        <span className="nums text-aqua">
          <span ref={alt}>{meters(DESCENT.from.m)} m</span> · <span ref={km}>0.0 km</span>
        </span>
      </div>
      <figcaption className="mt-2 text-[0.6875rem] leading-snug text-muted">
        Geländeprofil in Luftlinie, {DESCENT.km.toFixed(1).replace(".", ",")} km, überhöht dargestellt. Beim Lesen steigst du ab.
      </figcaption>
    </figure>
  );
}
