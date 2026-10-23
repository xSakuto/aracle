// Jeder Bereich hat seinen Glarner Gipfel. Die Zuordnung ist fest, damit die
// Berge nicht beliebig wiederholt werden, sondern etwas bedeuten.
import { GLAERNISCH } from "@/data/panorama/glaernisch";
import { TOEDI } from "@/data/panorama/toedi";
import { WIGGIS } from "@/data/panorama/wiggis";
import type { Pillar } from "@/data/projects";
import type { Panorama } from "@/lib/panorama";

export type Mountain = {
  key: "glaernisch" | "toedi" | "kaerpf" | "wiggis";
  name: string;
  peak: string;
  m: number;
  /** Ansicht, null bei Höhenlinien (Kärpf) */
  view: Panorama | null;
  from: string;
};

export const MOUNTAINS: Record<Mountain["key"], Mountain> = {
  glaernisch: { key: "glaernisch", name: "Glärnisch", peak: "Vrenelisgärtli", m: 2904, view: GLAERNISCH, from: "vom Schilt" },
  toedi: { key: "toedi", name: "Tödi", peak: "Tödi", m: 3614, view: TOEDI, from: "vom Schilt" },
  kaerpf: { key: "kaerpf", name: "Kärpf", peak: "Kärpf", m: 2794, view: null, from: "Höhenlinien" },
  wiggis: { key: "wiggis", name: "Wiggis", peak: "Wiggis", m: 2282, view: WIGGIS, from: "von Glarus" },
};

export const PILLAR_MOUNTAIN: Record<Pillar, Mountain> = {
  "Marken & Produkte": MOUNTAINS.glaernisch,
  "Kanäle": MOUNTAINS.toedi,
  "Cloud & Hosting": MOUNTAINS.kaerpf,
  "Communitys & Server": MOUNTAINS.wiggis,
};
