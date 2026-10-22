import DrawOnView from "@/components/alpine/DrawOnView";
import { KAERPF } from "@/data/panorama/kaerpf";
import { meters } from "@/lib/panorama";

/**
 * Höhenlinien des Gross Chärpf aus dem SRTM-Modell, wie auf einer Landeskarte:
 * Äquidistanz 50 m, Zählkurven alle 250 m kräftiger.
 */
export default function Contours({
  className = "",
  label = true,
}: {
  /** Grösse und Lage bestimmt der Aufrufer; das Seitenverhältnis bleibt fix, damit die Marke sitzt */
  className?: string;
  label?: boolean;
}) {
  const m = KAERPF;
  return (
    <DrawOnView className={`topo-map ${className}`} threshold={0}>
      <div className="relative w-full" style={{ aspectRatio: `${m.w} / ${m.h}` }}>
      <svg
        viewBox={`0 0 ${m.w} ${m.h}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
        className="absolute inset-0 h-full w-full"
        fill="none"
        stroke="currentColor"
      >
        {m.paths.map((p, i) => (
          <path
            key={i}
            d={p.d}
            pathLength={1}
            className="pano-path"
            style={{
              ["--d" as string]: `${Math.round(((p.m - 1500) / 1300) * 1600)}ms`,
              strokeOpacity: p.index ? 0.55 : 0.22,
              strokeWidth: p.index ? 1.1 : 0.8,
            }}
          />
        ))}
        <circle cx={m.summit.x} cy={m.summit.y} r={5} vectorEffect="non-scaling-stroke" style={{ stroke: "var(--color-aqua)" }} className="pano-path" />
      </svg>
      {label && (
        <span
          className="pano-label absolute whitespace-nowrap text-[0.6875rem] leading-tight"
          style={{ left: `${(m.summit.x / m.w) * 100}%`, top: `${(m.summit.y / m.h) * 100}%`, transform: "translate(12px, -50%)", ["--d" as string]: "2200ms" }}
        >
          <span className="block font-medium text-ink/85">{m.summit.name}</span>
          <span className="nums block text-aqua">{meters(m.summit.m)} m · Äquidistanz {m.step} m</span>
        </span>
      )}
      </div>
    </DrawOnView>
  );
}
