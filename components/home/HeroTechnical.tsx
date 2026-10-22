import Link from "next/link";
import Panorama, { type PanoLabel } from "@/components/alpine/Panorama";
import GlarusClock from "@/components/swiss/GlarusClock";
import { SCHILT } from "@/data/panorama/schilt";
import { meters } from "@/lib/panorama";

// Variante B "Alpine Technical": berechnetes Panorama vom Schilt über Ennenda,
// gesetzt wie ein Vermessungsblatt mit Gipfelmarken, Azimut-Skala und Schriftfeld.

export const HERO_LABELS: PanoLabel[] = [
  { peak: "Gross Chärpf", row: 1 },
  { peak: "Tödi", sub: "Piz Russein", row: 0 },
  { peak: "Bächistock", row: 2, side: "left", minor: true },
  { peak: "Vrenelisgärtli", title: "Glärnisch", sub: "Vrenelisgärtli", row: 0 },
  { peak: "Ruchen", row: 1, side: "right", minor: true },
  { peak: "Wiggis", row: 1 },
];

export default function HeroTechnical() {
  const sp = SCHILT.standpoint;
  return (
    <section aria-labelledby="hero-title" className="relative flex min-h-svh flex-col overflow-hidden">
      <div aria-hidden className="swiss-grid pointer-events-none absolute inset-0" />

      <div className="wrap relative z-10 pt-24">
        <dl className="kicker grid grid-cols-2 gap-4 border-b border-line pb-4 text-muted md:grid-cols-4">
          <div data-rise>
            <dt className="sr-only">Ort</dt>
            <dd>Ennenda, Glarus</dd>
          </div>
          <div className="hidden md:block" data-rise style={{ ["--i" as string]: 1 }}>
            <dt className="sr-only">Koordinaten</dt>
            <dd className="nums">47.04° N, 9.08° E</dd>
          </div>
          <div className="hidden md:block" data-rise style={{ ["--i" as string]: 2 }}>
            <dt className="sr-only">Studio</dt>
            <dd>Creative &amp; Technology Studio</dd>
          </div>
          <div className="text-right" data-rise style={{ ["--i" as string]: 3 }}>
            <dt className="sr-only">Lokale Zeit</dt>
            <dd>
              Local time <GlarusClock />
            </dd>
          </div>
        </dl>

        <div className="grid gap-8 pt-12 md:grid-cols-12 md:pt-14">
          <div className="md:col-span-8">
            <p className="kicker text-aqua" data-rise style={{ ["--i" as string]: 1 }}>
              Create. Connect. Inspire.
            </p>
            <h1 id="hero-title" className="display mt-5" data-split="load">
              Creative thinking. Technical execution.
            </h1>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:self-end" data-rise style={{ ["--i" as string]: 3 }}>
            <p className="text-ink/85">
              Aracle ist ein Studio aus dem Glarnerland für Creative Production,
              Digital Experiences und Cloud-Infrastruktur. Wir gestalten,
              entwickeln und betreiben, mit Präzision bis ins Detail.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/projekte" className="btn">Projekte ansehen</Link>
              <Link href="/kontakt" className="btn-quiet">Projekt anfragen</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-auto pt-20 md:pt-16">
        <Panorama
          data={SCHILT}
          mobileView={{ x0: 990, x1: 1640 }}
          labels={HERO_LABELS}
          yMax={470}
          scale
        />
        {/* Schriftfeld wie auf einem Plan */}
        <div className="wrap relative mt-12 pb-6">
          <dl className="grid grid-cols-2 border-t border-line text-[0.6875rem] leading-snug text-muted md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="col-span-2 border-b border-line py-2.5 pr-4 md:col-span-1 md:border-b-0 md:border-r">
              <dt className="sr-only">Ansicht</dt>
              <dd className="text-ink/85">Panorama vom {sp.name}, Blick nach Südwesten</dd>
            </div>
            <div className="py-2.5 pr-4 md:border-r md:px-4">
              <dt className="inline">Standpunkt </dt>
              <dd className="nums inline text-ink/85">{meters(sp.m)} m ü. M.</dd>
            </div>
            <div className="py-2.5 md:border-r md:px-4">
              <dt className="inline">Koordinaten </dt>
              <dd className="nums inline text-ink/85">
                {sp.lat.toFixed(3)}° N, {sp.lon.toFixed(3)}° E
              </dd>
            </div>
            <div className="col-span-2 hidden py-2.5 md:col-span-1 md:block md:px-4">
              <dt className="inline">Grundlage </dt>
              <dd className="inline text-ink/85">SRTM 1″, Erdkrümmung berücksichtigt</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
