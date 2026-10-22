// Alpine Line Art: eine feste Kammlinie, angelehnt an das Glärnisch-Massiv
// über Ennenda, und daraus abgeleitete Ebenen für räumliche Tiefe.
// Alles deterministisch, damit Server und Browser dasselbe zeichnen.

export type Ridge = { d: string; points: [number, number][] };

// Gipfel als (Position 0..1, Höhe 0..1, Breite). Die Hauptgruppe rechts der
// Mitte entspricht Bächistock, Vrenelisgärtli und Ruchen.
const PEAKS: [number, number, number][] = [
  [0.06, 0.34, 0.06],
  [0.16, 0.46, 0.05],
  [0.27, 0.4, 0.07],
  [0.38, 0.58, 0.05],
  [0.47, 0.52, 0.04],
  [0.56, 0.86, 0.045], // Ruchen
  [0.62, 0.96, 0.035], // Bächistock
  [0.68, 0.94, 0.04], // Vrenelisgärtli
  [0.76, 0.66, 0.05],
  [0.86, 0.5, 0.06],
  [0.95, 0.38, 0.05],
];

/** Benannte Gipfel mit Höhe, für die feinen Beschriftungen. */
export const SUMMITS = [
  { x: 0.56, name: "Ruchen", m: 2901 },
  { x: 0.62, name: "Bächistock", m: 2914 },
  { x: 0.68, name: "Vrenelisgärtli", m: 2904 },
];

function rand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Key = [number, number]; // (x 0..1, Höhe 0..1)

/**
 * Stützpunkte einer Ebene: Gipfel und Sättel. Ebene 0 folgt dem Glärnisch-Profil,
 * hintere Ebenen verschieben Gipfel, ändern Höhen und ergänzen eigene Spitzen,
 * damit sich die Linien nicht einfach parallel wiederholen.
 */
function keys(layer: number, seed: number): Key[] {
  const r = rand(seed * 7919 + layer * 104729);
  const drift = layer === 0 ? 0.004 : 0.035 + layer * 0.012;
  const peaks: Key[] = PEAKS.map(([px, ph]) => [
    Math.min(0.97, Math.max(0.03, px + (r() - 0.5) * 2 * drift)),
    layer === 0 ? ph * (0.97 + r() * 0.06) : ph * (0.55 + r() * 0.5),
  ]);
  if (layer > 0) {
    // zusätzliche Gipfel im Hintergrund
    const extra = 1 + Math.floor(r() * 2);
    for (let i = 0; i < extra; i++) peaks.push([0.04 + r() * 0.92, 0.4 + r() * 0.35]);
    peaks.sort((a, b) => a[0] - b[0]);
  }
  const out: Key[] = [[0, 0.14 + r() * 0.12]];
  for (let i = 0; i < peaks.length; i++) {
    const [x, y] = peaks[i];
    if (i > 0) {
      const [px, py] = peaks[i - 1];
      if (x - px < 0.025) continue; // zu nah: überspringen
      // Sattel: nicht mittig, damit Flanken unterschiedlich steil werden
      const t = 0.35 + r() * 0.3;
      // hohe Gipfel hängen über einen Grat zusammen, Vorberge sind tiefer getrennt
      const lo = Math.min(py, y);
      const keep = lo > 0.7 ? 0.74 + r() * 0.12 : 0.6 + r() * 0.2;
      out.push([px + (x - px) * t, lo * keep]);
    }
    out.push([x, y]);
  }
  out.push([1, 0.12 + r() * 0.14]);
  return out;
}

/** Midpoint Displacement zwischen zwei Stützpunkten: Grate statt Wellen. */
function displace(a: Key, b: Key, depth: number, rough: number, r: () => number, out: Key[]) {
  if (depth === 0) {
    out.push(b);
    return;
  }
  // Teilungspunkt leicht versetzt, damit keine regelmässigen Zacken entstehen
  const t = 0.38 + r() * 0.24;
  const mx = a[0] + (b[0] - a[0]) * t;
  const span = b[0] - a[0];
  const my = a[1] + (b[1] - a[1]) * t + (r() - 0.5) * span * rough;
  const m: Key = [mx, Math.max(0, Math.min(Math.max(a[1], b[1]) + span * 0.15, my))];
  displace(a, m, depth - 1, rough * 1.05, r, out);
  displace(m, b, depth - 1, rough * 1.05, r, out);
}

/**
 * Baut eine Kammlinie als SVG-Pfad.
 * @param w Breite der Zeichenfläche, h Höhe
 * @param layer 0 = vorderste Ebene, höher = weiter hinten
 * @param steps Anzahl gleichmässiger Messpunkte (für Beschriftungen)
 */
export function ridge(w: number, h: number, layer = 0, seed = 7, steps = 160): Ridge {
  const r = rand(seed * 97 + layer * 13 + 1);
  const k = keys(layer, seed);
  const depth = steps >= 120 ? 4 : 3;
  // vorne kantig, hinten ruhiger (Luftperspektive)
  const rough = Math.max(0.35, 0.95 - layer * 0.18);
  const fine: Key[] = [k[0]];
  for (let i = 1; i < k.length; i++) displace(k[i - 1], k[i], depth, rough, r, fine);

  // hintere Ebenen sitzen höher und sind etwas flacher
  const base = 0.1 + layer * 0.11;
  const scale = 0.66 * (1 - layer * 0.1);
  const toXY = ([x, y]: Key): [number, number] => [x * w, h - (base + y * scale) * h];

  // fast gerade Zwischenpunkte weglassen: kleineres HTML, schnelleres Zeichnen
  const raw = fine.map(toXY);
  const poly: [number, number][] = [raw[0]];
  for (let i = 1; i < raw.length - 1; i++) {
    const [ax, ay] = poly[poly.length - 1];
    const [bx, by] = raw[i];
    const [cx, cy] = raw[i + 1];
    const cross = Math.abs((bx - ax) * (cy - ay) - (by - ay) * (cx - ax));
    const len = Math.hypot(cx - ax, cy - ay) || 1;
    if (cross / len > 0.6) poly.push(raw[i]);
  }
  poly.push(raw[raw.length - 1]);
  let d = `M${Math.round(poly[0][0])} ${Math.round(poly[0][1])}`;
  for (let i = 1; i < poly.length; i++) d += `L${Math.round(poly[i][0])} ${Math.round(poly[i][1])}`;

  // gleichmässig abgetastete Punkte, damit ridgeY an jeder Stelle stimmt
  const points: [number, number][] = [];
  let j = 0;
  for (let i = 0; i <= steps; i++) {
    const x = i / steps;
    while (j < fine.length - 2 && fine[j + 1][0] < x) j++;
    const [x0, y0] = fine[j];
    const [x1, y1] = fine[j + 1];
    const t = x1 === x0 ? 0 : (x - x0) / (x1 - x0);
    points.push(toXY([x, y0 + (y1 - y0) * Math.max(0, Math.min(1, t))]));
  }
  return { d, points };
}

/** Höhe der vordersten Linie an Position x (0..1), für Beschriftungen. */
export function ridgeY(r: Ridge, x01: number, window = 0.02) {
  // höchster Punkt in der Umgebung, damit Beschriftungen genau auf der Spitze sitzen
  const n = r.points.length - 1;
  const c = Math.round(x01 * n);
  const span = Math.max(1, Math.round(window * n));
  let best = r.points[Math.max(0, Math.min(n, c))];
  for (let i = Math.max(0, c - span); i <= Math.min(n, c + span); i++) {
    if (r.points[i][1] < best[1]) best = r.points[i];
  }
  return best;
}

/**
 * Höhenlinien (topografisch) um einen Punkt: geschlossene, unregelmässige Ringe.
 */
export function contours(cx: number, cy: number, rings = 9, gap = 26, seed = 3) {
  const out: string[] = [];
  for (let k = 1; k <= rings; k++) {
    const r = rand(seed * 31 + k);
    const a1 = r() * 6.28;
    const a2 = r() * 6.28;
    const steps = 96;
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const wob = 1 + 0.12 * Math.sin(t * 2 + a1) + 0.06 * Math.sin(t * 5 + a2) * (k / rings);
      const rad = k * gap * wob;
      const x = cx + Math.cos(t) * rad * 1.35;
      const y = cy + Math.sin(t) * rad * 0.8;
      d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    out.push(d + "Z");
  }
  return out;
}
