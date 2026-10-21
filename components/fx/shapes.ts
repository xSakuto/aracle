// Formen für die Partikel-Bühne. Jede liefert N Punkte (x, y, z) in Weltkoordinaten.
export type ShapeName =
  | "sphere"
  | "word"
  | "mountains"
  | "wheel"
  | "racks"
  | "helix"
  | "room"
  | "wave";

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function sphere(n: number) {
  const out = new Float32Array(n * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    const R = 2.1 + rand(-0.06, 0.06);
    out[i * 3] = Math.cos(t) * r * R;
    out[i * 3 + 1] = y * R;
    out[i * 3 + 2] = Math.sin(t) * r * R;
  }
  return out;
}

// Ein Wort aus Pixeln einer unsichtbaren Leinwand abgetastet.
function word(n: number, text: string) {
  const out = new Float32Array(n * 3);
  if (typeof document === "undefined") return out;
  const W = 1200;
  const H = 300;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `900 ${H * 0.78}px "Mona Sans Variable", "Arial Black", sans-serif`;
  ctx.fillText(text, W / 2, H / 2 + 8);
  const data = ctx.getImageData(0, 0, W, H).data;
  const pts: number[] = [];
  for (let y = 0; y < H; y += 2)
    for (let x = 0; x < W; x += 2) if (data[(y * W + x) * 4 + 3] > 128) pts.push(x, y);
  const scale = 7 / W;
  for (let i = 0; i < n; i++) {
    const k = Math.floor(Math.random() * (pts.length / 2)) * 2;
    out[i * 3] = (pts[k] - W / 2) * scale + rand(-0.01, 0.01);
    out[i * 3 + 1] = -(pts[k + 1] - H / 2) * scale + rand(-0.01, 0.01);
    out[i * 3 + 2] = rand(-0.25, 0.25);
  }
  return out;
}

// Ein Grat wie die Glarner Alpen, leicht gekippt.
function mountains(n: number) {
  const out = new Float32Array(n * 3);
  const h = (x: number, z: number) => {
    const ridge =
      1.6 * Math.exp(-((x + 1.3) ** 2) * 0.9) +
      2.1 * Math.exp(-((x - 0.6) ** 2) * 1.4) +
      1.2 * Math.exp(-((x - 2.4) ** 2) * 1.1) +
      0.9 * Math.exp(-((x + 3.1) ** 2) * 1.6);
    const depth = Math.exp(-(z ** 2) * 0.55);
    return ridge * depth + 0.12 * Math.sin(x * 4 + z * 3) * depth - 1.2;
  };
  for (let i = 0; i < n; i++) {
    const x = rand(-4.2, 4.2);
    const z = rand(-2.2, 2.2);
    out[i * 3] = x;
    out[i * 3 + 1] = h(x, z);
    out[i * 3 + 2] = z;
  }
  return out;
}

// Ein Rad mit Speichen (Highside).
function wheel(n: number) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const kind = Math.random();
    let x = 0;
    let y = 0;
    let z = 0;
    if (kind < 0.62) {
      const u = rand(0, Math.PI * 2);
      const v = rand(0, Math.PI * 2);
      const R = 2.1;
      const r = 0.32;
      x = (R + r * Math.cos(v)) * Math.cos(u);
      y = (R + r * Math.cos(v)) * Math.sin(u);
      z = r * Math.sin(v) * 1.4;
    } else if (kind < 0.92) {
      const spoke = Math.floor(rand(0, 10));
      const a = (spoke / 10) * Math.PI * 2;
      const t = rand(0.25, 1.85);
      x = Math.cos(a) * t;
      y = Math.sin(a) * t;
      z = rand(-0.05, 0.05);
    } else {
      const a = rand(0, Math.PI * 2);
      const t = rand(0, 0.32);
      x = Math.cos(a) * t;
      y = Math.sin(a) * t;
      z = rand(-0.3, 0.3);
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

// Server-Racks: Reihen von Platten mit Einschüben (Cloud).
function racks(n: number) {
  const out = new Float32Array(n * 3);
  const cols = 5;
  for (let i = 0; i < n; i++) {
    const c = Math.floor(rand(0, cols));
    const x0 = (c - (cols - 1) / 2) * 1.25;
    const slot = Math.floor(rand(0, 14));
    const y = -2 + slot * 0.3 + rand(0, 0.06);
    out[i * 3] = x0 + rand(-0.42, 0.42);
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = rand(-0.5, 0.5);
  }
  return out;
}

// Doppelhelix: viele Fäden, ein Strang (Team).
function helix(n: number) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = rand(-1, 1);
    const a = t * Math.PI * 3.2;
    const strand = Math.random() < 0.5 ? 0 : Math.PI;
    const bridge = Math.random() < 0.18;
    const r = bridge ? rand(-1, 1) * 1.1 : 1.1;
    out[i * 3] = Math.cos(a + strand) * r + rand(-0.05, 0.05);
    out[i * 3 + 1] = t * 2.6;
    out[i * 3 + 2] = Math.sin(a + strand) * r + rand(-0.05, 0.05);
  }
  return out;
}

// Ein Raum aus Kanten (Living).
function room(n: number) {
  const out = new Float32Array(n * 3);
  const e = 1.7;
  const corners: [number, number, number][] = [];
  for (const x of [-e, e]) for (const y of [-e, e]) for (const z of [-e, e]) corners.push([x, y, z]);
  const edges: [number, number][] = [];
  for (let a = 0; a < 8; a++)
    for (let b = a + 1; b < 8; b++) {
      const d = corners[a].filter((v, k) => v !== corners[b][k]).length;
      if (d === 1) edges.push([a, b]);
    }
  for (let i = 0; i < n; i++) {
    if (Math.random() < 0.7) {
      const [a, b] = edges[Math.floor(rand(0, edges.length))];
      const t = Math.random();
      for (let k = 0; k < 3; k++) out[i * 3 + k] = corners[a][k] + (corners[b][k] - corners[a][k]) * t + rand(-0.02, 0.02);
    } else {
      // Boden als Fläche
      out[i * 3] = rand(-e, e);
      out[i * 3 + 1] = -e;
      out[i * 3 + 2] = rand(-e, e);
    }
  }
  return out;
}

// Eine weite, flache Welle (Ruhe am Seitenende).
function wave(n: number) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const x = rand(-5, 5);
    const z = rand(-2.5, 2.5);
    out[i * 3] = x;
    out[i * 3 + 1] = Math.sin(x * 0.9) * 0.45 + Math.cos(z * 1.3) * 0.25 - 0.4;
    out[i * 3 + 2] = z;
  }
  return out;
}

export function buildShape(name: ShapeName, n: number): Float32Array {
  switch (name) {
    case "sphere":
      return sphere(n);
    case "word":
      return word(n, "ARACLE");
    case "mountains":
      return mountains(n);
    case "wheel":
      return wheel(n);
    case "racks":
      return racks(n);
    case "helix":
      return helix(n);
    case "room":
      return room(n);
    case "wave":
      return wave(n);
  }
}
