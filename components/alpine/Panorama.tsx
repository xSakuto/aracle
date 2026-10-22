"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { settle } from "@/components/alpine/DrawOnView";
import { azAt, cardinal, meters, xAt, type Panorama as Pano, type PanoView } from "@/lib/panorama";

export type PanoLabel = {
  /** Name des Gipfels in den Panoramadaten */
  peak: string;
  /** abweichender Anzeigename, z.B. "Glärnisch" für Vrenelisgärtli */
  title?: string;
  /** Zusatzzeile, z.B. "Vrenelisgärtli" */
  sub?: string;
  /** Höhe der Beschriftungszeile: 0 oben, 2 tiefer */
  row?: 0 | 1 | 2;
  /** Textausrichtung relativ zur Führungslinie */
  side?: "center" | "left" | "right";
  /** kleinere, ruhigere Beschriftung */
  minor?: boolean;
};

const ROW_Y = [16, 44, 70];
const DEPTH_STYLE = {
  2: { o: 0.42, w: 1 },
  1: { o: 0.52, w: 1 },
  0: { o: 0.62, w: 1 },
} as const;

/**
 * Panorama-Linienzeichnung mit Gipfelbeschriftungen, Horizont und Azimut-Skala.
 * Die Linien sind vorberechnet (scripts/panorama); hier wird nur gezeichnet.
 */
export default function Panorama({
  data,
  view,
  mobileView,
  labels = [],
  scale = false,
  draw = "load",
  fade = true,
  guide = true,
  className = "",
  tone = "ink",
  yMax,
  layers = "all",
  glow = false,
}: {
  data: Pano;
  view?: PanoView;
  mobileView?: PanoView;
  labels?: PanoLabel[];
  scale?: boolean;
  draw?: "load" | "scroll" | "none";
  fade?: boolean;
  /** Messlinie, die der Maus folgt und den Azimut anzeigt */
  guide?: boolean;
  className?: string;
  tone?: "ink" | "dark";
  /** unterer Beschnitt in Panorama-Einheiten */
  yMax?: number;
  /** "sky": nur die Horizontlinie, ohne innere Grate */
  layers?: "all" | "sky";
  /** leichtes Leuchten der Horizontlinie */
  glow?: boolean;
}) {
  const H = yMax ?? data.h;
  const full = { x0: 0, x1: data.w };
  const [vb, setVb] = useState<PanoView>(view ?? full);
  const host = useRef<HTMLDivElement>(null);
  const groups = useRef<(SVGGElement | null)[]>([]);
  const cursor = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const vbRef = useRef(vb);
  vbRef.current = vb;

  // Ausschnitt fürs Handy
  useEffect(() => {
    if (!mobileView) return;
    const mq = matchMedia("(max-width: 767px)");
    const apply = () => setVb(mq.matches ? mobileView : (view ?? full));
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [mobileView?.x0, mobileView?.x1, view?.x0, view?.x1]); // eslint-disable-line react-hooks/exhaustive-deps

  const byDepth = useMemo(() => {
    const g: Record<"sky" | 0 | 1 | 2, typeof data.paths> = { sky: [], 2: [], 1: [], 0: [] };
    for (const p of data.paths) {
      if (p.sky) g.sky.push(p);
      else g[p.depth].push(p);
    }
    return g;
  }, [data]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce || draw === "none") {
      el.classList.add("is-drawn", "no-anim", "is-done");
      return;
    }

    let inView = false;
    let settleTimer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView && draw === "load" && !el.classList.contains("is-drawn")) {
          el.classList.add("is-drawn");
          settleTimer = window.setTimeout(() => settle(el), 4800);
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);

    const mouse = { x: 0, tx: 0 };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width - 0.5;
      if (!guide || !cursor.current || !readout.current) return;
      const inside = e.clientY >= r.top && e.clientY <= r.bottom && e.clientX >= r.left && e.clientX <= r.right;
      cursor.current.style.opacity = inside ? "1" : "0";
      if (!inside) return;
      const px = e.clientX - r.left;
      cursor.current.style.transform = `translateX(${px}px)`;
      const x = vbRef.current.x0 + (px / r.width) * (vbRef.current.x1 - vbRef.current.x0);
      readout.current.textContent = `${azAt(data, x).toFixed(1)}°`;
    };
    if (fine) addEventListener("pointermove", onMove, { passive: true });

    // Nähere Ebenen verschieben sich beim Scrollen und mit der Maus etwas mehr.
    // Die Horizontlinie bleibt fix, damit die Gipfelmarken exakt sitzen.
    let raf = 0;
    // Nur schreiben, wenn sich etwas sichtbar ändert: spart Neuzeichnen grosser SVGs
    let lastKey = "";
    let lastProg = -1;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!inView) return;
      const r = el.getBoundingClientRect();
      const p = 1 - (r.top + r.height / 2) / (innerHeight / 2 + r.height / 2);
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      const mx = Math.round(mouse.x * 10 * 4) / 4;
      const py = Math.round(-p * 22 * 4) / 4;
      const key = `${mx}|${py}`;
      if (key !== lastKey) {
        lastKey = key;
        groups.current.forEach((g, i) => {
          if (!g) return;
          const k = [0, 0.25, 0.6, 1][i]; // Horizont, fern, mittel, nah
          g.setAttribute("transform", `translate(${(mx * k).toFixed(2)} ${(py * k).toFixed(2)})`);
        });
      }
      if (draw === "scroll") {
        const prog = Math.round(Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.8))) * 200) / 200;
        if (prog !== lastProg) {
          lastProg = prog;
          el.style.setProperty("--prog", String(prog));
          if (prog > 0.6) el.classList.add("is-drawn");
          if (prog >= 1 && !el.classList.contains("is-done")) settle(el);
        }
      }
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settleTimer);
      io.disconnect();
      removeEventListener("pointermove", onMove);
    };
  }, [draw, guide, data]);

  const vw = vb.x1 - vb.x0;
  const pctX = (x: number) => ((x - vb.x0) / vw) * 100;
  const pctY = (y: number) => (y / H) * 100;

  const ticks = useMemo(() => {
    if (!scale) return [];
    const out: { az: number; x: number; major: boolean }[] = [];
    // Skalenteilung passend zum sichtbaren Bildwinkel
    const span = azAt(data, vb.x1) - azAt(data, vb.x0);
    const step = span > 60 ? 5 : span > 20 ? 2 : 1;
    const majorEvery = span > 60 ? 15 : span > 20 ? 10 : 5;
    const a0 = Math.ceil(azAt(data, vb.x0) / step) * step;
    const a1 = azAt(data, vb.x1);
    for (let a = a0; a <= a1; a += step) out.push({ az: a, x: xAt(data, a), major: a % majorEvery === 0 });
    return out;
  }, [scale, data, vb.x0, vb.x1]);

  const peaks = labels
    .map((l, i) => ({ l, i, p: data.peaks.find((p) => p.name === l.peak) }))
    .filter((e) => e.p && e.p.x >= vb.x0 + 8 && e.p.x <= vb.x1 - 8);

  const stroke = tone === "dark" ? "#0b1418" : "var(--color-ink)";
  let n = 0;
  const pathEl = (p: (typeof data.paths)[number], base: number, o: number, w: number) => (
    <path
      key={n}
      d={p.d}
      className="pano-path"
      style={{ ["--d" as string]: `${base + (n++ % 14) * 55}ms`, strokeOpacity: o, strokeWidth: w }}
    />
  );

  return (
    <div
      ref={host}
      className={`pano relative w-full select-none ${draw === "scroll" ? "pano-scroll" : ""} ${className}`}
      style={{ aspectRatio: `${vw} / ${H}` }}
    >
      <svg
        viewBox={`${vb.x0} 0 ${vw} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
        className={`absolute inset-0 h-full w-full overflow-visible ${fade ? "pano-fade" : ""} ${glow ? "pano-glow" : ""}`}
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* mathematischer Horizont */}
        <line
          x1={vb.x0}
          x2={vb.x1}
          y1={data.horizon}
          y2={data.horizon}
          vectorEffect="non-scaling-stroke"
          strokeDasharray="2 6"
          className="pano-guide"
        />
        <g ref={(g) => { groups.current[0] = g; }}>
          {byDepth.sky.map((p) => pathEl(p, 0, 0.95, glow ? 1.4 : 1.2))}
        </g>
        {([2, 1, 0] as const).map((d, gi) => (
          <g key={d} ref={(g) => { groups.current[gi + 1] = g; }}>
            {layers === "all" && byDepth[d].map((p) => pathEl(p, 350 + gi * 300, DEPTH_STYLE[d].o, DEPTH_STYLE[d].w))}
          </g>
        ))}
      </svg>
      <span aria-hidden className="pano-curtain-wrap"><span className="pano-curtain" /></span>

      {/* Gipfelmarken und Beschriftungen als HTML, damit die Schrift nicht mitskaliert */}
      {peaks.map(({ l, i, p }) => {
        const pk = p!;
        const row = ROW_Y[l.row ?? 0];
        const side = l.side ?? "center";
        return (
          <div key={l.peak} aria-hidden className="pano-label [text-shadow:0_1px_10px_rgb(11_17_21/0.95)]" style={{ ["--d" as string]: `${1500 + i * 140}ms` }}>
            <span
              className={`absolute w-px ${pk.visible ? "bg-ink/35" : "pano-dashed"}`}
              style={{ left: `${pctX(pk.x)}%`, top: `${pctY(row)}%`, height: `${pctY(pk.y - row)}%` }}
            />
            <span
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border ${
                pk.visible ? "h-[7px] w-[7px] border-aqua bg-bg" : "h-[7px] w-[7px] border-dashed border-ink/50"
              }`}
              style={{ left: `${pctX(pk.x)}%`, top: `${pctY(pk.y)}%` }}
            />
            <span
              className={`absolute whitespace-nowrap pb-1.5 leading-tight ${
                side === "center" ? "-translate-x-1/2 text-center" : side === "left" ? "-translate-x-full pr-0 text-right" : "text-left"
              }`}
              style={{ left: `${pctX(pk.x)}%`, bottom: `${100 - pctY(row)}%` }}
            >
              <span className={`block font-medium tracking-[-0.01em] ${l.minor ? "text-[0.6875rem] text-ink/70" : "text-[0.8125rem] text-ink"}`}>
                {l.title ?? pk.name}
              </span>
              <span className="nums block text-[0.6875rem] text-aqua">
                {meters(pk.m)} m{!pk.visible && <span className="text-muted"> · verdeckt</span>}
              </span>
              {l.sub && <span className="block text-[0.6875rem] text-muted">{l.sub}</span>}
            </span>
          </div>
        );
      })}

      {scale && (
        <div aria-hidden className="pano-label absolute inset-x-0 top-full mt-2 h-6" style={{ ["--d" as string]: "1300ms" }}>
          {ticks.map((t) => (
            <span key={t.az} className="absolute top-0 -translate-x-1/2" style={{ left: `${pctX(t.x)}%` }}>
              <span className={`mx-auto block w-px bg-ink/30 ${t.major ? "h-2.5" : "h-1.5"}`} />
              {t.major && (
                <span className="nums mt-1 block text-[0.625rem] tracking-[0.04em] text-muted">
                  {cardinal(t.az) ? `${cardinal(t.az)} ` : ""}
                  {t.az}°
                </span>
              )}
            </span>
          ))}
        </div>
      )}

      {guide && (
        <div ref={cursor} aria-hidden className="pano-cursor pointer-events-none absolute inset-y-0 left-0 w-px opacity-0">
          <span ref={readout} className="nums absolute left-2 top-1 text-[0.625rem] text-aqua" />
        </div>
      )}
    </div>
  );
}
