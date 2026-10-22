// Panorama-Linienzeichnungen aus Höhendaten. Die Daten werden mit
// scripts/panorama/ vorberechnet; im Browser wird nichts neu gerechnet.

export type PanoPath = {
  /** SVG-Pfad in Panorama-Einheiten */
  d: string;
  /** 0 nah (< 5 km), 1 mittel (< 12 km), 2 fern */
  depth: 0 | 1 | 2;
  /** gehört zur Horizontlinie */
  sky: boolean;
  /** mittlere Distanz der Kante in km */
  km: number;
};

export type PanoPeak = {
  name: string;
  sub?: string | null;
  /** Gipfelhöhe in m ü. M. */
  m: number;
  x: number;
  y: number;
  /** vom Standpunkt aus sichtbar oder durch näheres Gelände verdeckt */
  visible: boolean;
  km: number;
  /** Azimut vom Standpunkt aus, Grad */
  az: number;
};

export type Panorama = {
  w: number;
  h: number;
  /** horizontaler Bildwinkel in Grad (Zylinderprojektion) */
  fov: number;
  /** Azimut am linken Bildrand */
  az0: number;
  /** cyl: Zylinderprojektion (Panorama), rect: rechtwinklig (Einzelansicht) */
  proj?: "cyl" | "rect";
  /** y-Position des mathematischen Horizonts */
  horizon: number;
  paths: PanoPath[];
  peaks: PanoPeak[];
  standpoint: { name: string; m: number; lat: number; lon: number };
};

/** Ausschnitt in Panorama-Einheiten */
export type PanoView = { x0: number; x1: number };

/** Schweizer Schreibweise: 3'614 */
export const meters = (m: number) => m.toLocaleString("de-CH").replace(/[’’]/g, "'");

const focal = (p: Panorama) => p.w / 2 / Math.tan(((p.fov / 2) * Math.PI) / 180);
const DEG = 180 / Math.PI;

export const azAt = (p: Panorama, x: number) =>
  p.proj === "rect"
    ? p.az0 + p.fov / 2 + Math.atan((x - p.w / 2) / focal(p)) * DEG
    : p.az0 + (x / p.w) * p.fov;
export const xAt = (p: Panorama, az: number) =>
  p.proj === "rect"
    ? p.w / 2 + focal(p) * Math.tan((az - p.az0 - p.fov / 2) / DEG)
    : ((az - p.az0) / p.fov) * p.w;

/** Nur ausgewählte Ebenen weitergeben, damit kleine Einsätze wenig Daten tragen. */
export function slim(p: Panorama, opts: { depths?: (0 | 1 | 2)[]; maxKm?: number; minKm?: number } = {}): Panorama {
  const depths = opts.depths ?? [2];
  return {
    ...p,
    paths: p.paths.filter(
      (x) => (x.sky || depths.includes(x.depth)) && (opts.minKm === undefined || x.km >= opts.minKm),
    ),
  };
}

/** Topografische Höhenlinien in Draufsicht */
export type ContourMap = {
  w: number;
  h: number;
  /** Äquidistanz in m */
  step: number;
  paths: { d: string; m: number; index: boolean }[];
  summit: { name: string; m: number; x: number; y: number };
  extent: { lat: number; lon: number; km_w: number; km_h: number };
};

const CARDINAL: Record<number, string> = { 180: "S", 225: "SW", 270: "W", 315: "NW" };
export const cardinal = (az: number) => CARDINAL[az];
