// Ein Streifen Gras und Erde aus echten Pixeln. Eigene Zeichnung, feste Zufallsfolge,
// damit Server und Browser dasselbe Muster rendern.
const GRASS = ["#5d9b34", "#6cb33c", "#7ccf4a", "#4f8a2c"];
const DIRT = ["#6b4a2f", "#7a5535", "#5a3e27", "#86603c"];

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

export default function PixelGround({ cols = 96, rows = 8, seed = 7, className = "" }: { cols?: number; rows?: number; seed?: number; className?: string }) {
  const r = rng(seed);
  const cells: { x: number; y: number; c: string }[] = [];
  for (let x = 0; x < cols; x++) {
    // Gras hängt unterschiedlich tief in die Erde
    const depth = 2 + (r() < 0.45 ? 1 : 0) + (r() < 0.15 ? 1 : 0);
    for (let y = 0; y < rows; y++) {
      const pal = y < depth ? GRASS : DIRT;
      cells.push({ x, y, c: pal[Math.floor(r() * pal.length)] });
    }
  }
  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      preserveAspectRatio="xMidYMin slice"
      shapeRendering="crispEdges"
      aria-hidden
      className={className}
    >
      {cells.map((p) => (
        <rect key={`${p.x}-${p.y}`} x={p.x} y={p.y} width={1} height={1} fill={p.c} />
      ))}
    </svg>
  );
}
