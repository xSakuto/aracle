// Das Community-Logo in einem Ring aus Sheikah-Leiterbahnen. Beim Laden zeichnen
// sich die Bahnen einmal nach, wie ein Shrine, der hochfährt. Das ist die eine
// Animation der Seite, ohne JavaScript und mit reduzierter Bewegung abgeschaltet.

const PATHS = [
  "M100 8 A92 92 0 0 1 192 100",
  "M192 100 A92 92 0 0 1 100 192",
  "M100 192 A92 92 0 0 1 8 100",
  "M8 100 A92 92 0 0 1 100 8",
  "M100 8 L100 -6",
  "M192 100 L206 100",
  "M8 100 L-6 100",
  "M35 165 L22 178 L22 192",
  "M165 35 L178 22 L192 22",
];

export default function SheikahRing({ className = "" }: { className?: string }) {
  return (
    <div className={`sheikah-ring relative aspect-square ${className}`}>
      <svg viewBox="-12 -12 224 224" aria-hidden className="absolute inset-0 h-full w-full overflow-visible text-aqua">
        <circle cx="100" cy="100" r="78" className="sheikah-glow" fill="currentColor" />
        {PATHS.map((d, i) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={i < 4 ? 1.4 : 1.2}
            strokeLinecap="round"
            pathLength={1}
            className="sheikah-trace"
            style={{ ["--i" as string]: i }}
          />
        ))}
        {[[100, -6], [206, 100], [-6, 100], [22, 192], [192, 22]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.2" fill="none" stroke="currentColor" strokeWidth="1.2" className="sheikah-node" style={{ ["--i" as string]: i + 4 }} />
        ))}
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/zelda/zelda-de-logo-trim.png"
        alt=""
        width={628}
        height={584}
        className="absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2 bg-transparent"
      />
    </div>
  );
}
