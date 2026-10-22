import DrawOnView from "@/components/alpine/DrawOnView";
import { meters, type Panorama } from "@/lib/panorama";

/**
 * Statische Silhouette einer Einzelansicht für kleine Einsätze (Poster, Leistungen,
 * Seitenübergänge). Nur Horizont und ferne Grate, ohne Client-Daten.
 */
export default function Ridge({
  data,
  peak,
  label = false,
  depths = [2],
  yMax,
  x0 = 0,
  x1,
  color = "currentColor",
  className = "",
  drawn = false,
}: {
  data: Panorama;
  /** Gipfel für die Marke */
  peak?: string;
  label?: boolean;
  depths?: (0 | 1 | 2)[];
  yMax?: number;
  x0?: number;
  x1?: number;
  color?: string;
  className?: string;
  /** ohne Zeichenanimation */
  drawn?: boolean;
}) {
  const H = yMax ?? data.h;
  const right = x1 ?? data.w;
  const w = right - x0;
  const pk = peak ? data.peaks.find((p) => p.name === peak) : undefined;
  const paths = data.paths.filter((p) => p.sky || depths.includes(p.depth));
  const svg = (
    <svg
      viewBox={`${x0} 0 ${w} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className="absolute inset-0 h-full w-full"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          className="pano-path"
          style={{
            ["--d" as string]: `${p.sky ? 0 : 300 + (i % 10) * 60}ms`,
            strokeOpacity: p.sky ? 0.95 : [0.55, 0.42, 0.32][p.depth],
            strokeWidth: p.sky ? 1.2 : 1,
          }}
        />
      ))}
      {pk && <circle cx={pk.x} cy={pk.y} r={4} vectorEffect="non-scaling-stroke" className="pano-path" style={{ stroke: "var(--color-aqua)" }} />}
    </svg>
  );
  const labelEl =
    pk && label ? (
      <span
        className="pano-label absolute whitespace-nowrap text-[0.6875rem] leading-tight"
        style={{ left: `${((pk.x - x0) / w) * 100}%`, top: `${(pk.y / H) * 100}%`, transform: "translate(10px, -110%)", ["--d" as string]: "1200ms" }}
      >
        <span className="block font-medium text-ink/85">{pk.name}</span>
        <span className="nums block text-aqua">{meters(pk.m)} m</span>
      </span>
    ) : null;
  const style = { aspectRatio: `${w} / ${H}` };
  if (drawn)
    return (
      <div className={`pano is-drawn no-anim is-done relative ${className}`} style={style}>
        {svg}
        {labelEl}
      </div>
    );
  return (
    <DrawOnView className={`relative ${className}`}>
      <div className="relative h-full w-full" style={style}>
        {svg}
        <span aria-hidden className="pano-curtain-wrap"><span className="pano-curtain" /></span>
        {labelEl}
      </div>
    </DrawOnView>
  );
}
