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

export const azAt = (p: Panorama, x: number) => p.az0 + (x / p.w) * p.fov;
export const xAt = (p: Panorama, az: number) => ((az - p.az0) / p.fov) * p.w;

const CARDINAL: Record<number, string> = { 180: "S", 225: "SW", 270: "W", 315: "NW" };
export const cardinal = (az: number) => CARDINAL[az];
