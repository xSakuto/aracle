// Head-up-Display wie im Flugsimulator: Horizont mit Neigungsleiter, Kursband oben,
// Höhenband rechts. Das Höhenband steht auf dem Tödi: 3'614 m sind 11'857 ft.
// Reine Linienzeichnung in currentColor.
export default function Hud({ className = "" }: { className?: string }) {
  const W = 1200;
  const H = 700;
  const cx = W / 2;
  const cy = H / 2;
  const alt = 11857;
  const ftPerPx = 4; // 100 ft = 25 px
  const altTicks = Array.from({ length: 29 }, (_, i) => Math.round(alt / 100) * 100 - 1400 + i * 100);
  const headings = Array.from({ length: 25 }, (_, i) => 150 + i * 5);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} fill="none" stroke="currentColor" aria-hidden>
      {/* Horizont, leicht geneigt */}
      <g transform={`rotate(-4 ${cx} ${cy})`}>
        <line x1={-200} y1={cy} x2={W + 200} y2={cy} strokeWidth={1.5} />
        {[-3, -2, -1, 1, 2, 3].map((n) => {
          const y = cy - n * 70;
          const w = 140 - Math.abs(n) * 10;
          return (
            <g key={n} strokeOpacity={0.7}>
              <path d={`M${cx - w} ${y + (n > 0 ? 10 : -10)}V${y}H${cx - 36}`} strokeDasharray={n < 0 ? "10 7" : undefined} />
              <path d={`M${cx + w} ${y + (n > 0 ? 10 : -10)}V${y}H${cx + 36}`} strokeDasharray={n < 0 ? "10 7" : undefined} />
              <text x={cx - w - 14} y={y + 4} textAnchor="end" className="hud-text">{Math.abs(n) * 5}</text>
            </g>
          );
        })}
      </g>

      {/* Flugzeugsymbol */}
      <path d={`M${cx - 70} ${cy}H${cx - 22}L${cx} ${cy + 16}L${cx + 22} ${cy}H${cx + 70}`} strokeWidth={2.5} />
      <circle cx={cx} cy={cy} r={3} fill="currentColor" />

      {/* Kursband */}
      <g strokeOpacity={0.75}>
        <line x1={cx - 300} y1={70} x2={cx + 300} y2={70} />
        {headings.map((h, i) => {
          const x = cx - 300 + i * 25;
          const major = h % 10 === 0;
          return (
            <g key={h}>
              <line x1={x} y1={70} x2={x} y2={major ? 54 : 62} />
              {major && <text x={x} y={44} textAnchor="middle" className="hud-text">{String(h / 10).padStart(2, "0")}</text>}
            </g>
          );
        })}
        <path d={`M${cx - 8} 84L${cx} 74L${cx + 8} 84`} strokeOpacity={1} strokeWidth={2} />
      </g>

      {/* Höhenband */}
      <g>
        <line x1={W - 150} y1={cy - 260} x2={W - 150} y2={cy + 260} strokeOpacity={0.75} />
        {altTicks.map((a) => {
          const y = cy - (a - alt) / ftPerPx;
          if (y < cy - 260 || y > cy + 260) return null;
          const major = a % 500 === 0;
          return (
            <g key={a} strokeOpacity={0.75}>
              <line x1={W - 150} y1={y} x2={W - (major ? 130 : 140)} y2={y} />
              {major && <text x={W - 122} y={y + 4} className="hud-text">{a.toLocaleString("de-CH").replace(/[’]/g, "'")}</text>}
            </g>
          );
        })}
        <path d={`M${W - 150} ${cy}l12 -18h118v36h-118z`} fill="var(--hud-bg, #0b1115)" strokeWidth={1.5} />
        <text x={W - 128} y={cy + 6} className="hud-text hud-strong">11&apos;857</text>
        <text x={W - 138} y={cy + 42} className="hud-text">TÖDI 3&apos;614 M</text>
      </g>
    </svg>
  );
}
