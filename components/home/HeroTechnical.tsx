import Link from "next/link";
import Panorama, { type PanoLabel } from "@/components/alpine/Panorama";
import { SCHILT } from "@/data/panorama/schilt";

// Startbild: Klöntalersee, darüber die berechnete Glarner Kette vom Schilt.
// Die Kette schliesst das Bild nach unten ab; nur die Gipfel tragen Namen und Höhen.

export const HERO_LABELS: PanoLabel[] = [
  { peak: "Gross Chärpf", row: 1 },
  { peak: "Tödi", row: 0 },
  { peak: "Vrenelisgärtli", title: "Glärnisch", row: 0 },
  { peak: "Ruchen", row: 1, side: "right", minor: true },
  { peak: "Wiggis", row: 1 },
];

export default function HeroTechnical() {
  return (
    <section aria-labelledby="hero-title" className="relative flex min-h-svh flex-col overflow-hidden">
      {/* Hintergrund: der Klöntalersee, ruhig abgedunkelt, mit Licht von Westen */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <picture>
          <source type="image/webp" srcSet="/images/hero/kloentalersee-1280.webp 1280w, /images/hero/kloentalersee-2560.webp 2560w" sizes="100vw" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero/kloentalersee-1280.jpg"
            srcSet="/images/hero/kloentalersee-1280.jpg 1280w, /images/hero/kloentalersee-2560.jpg 2560w"
            sizes="100vw"
            alt=""
            width={2560}
            height={1440}
            fetchPriority="high"
            data-parallax="0.06"
            className="h-[110%] w-full object-cover object-[55%_45%] opacity-80"
          />
        </picture>
        {/* Leuchten: Sonnenlicht über dem See, kühl getönt */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_62%_40%,rgb(143_214_211/0.30),transparent_70%)] mix-blend-screen" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_32%_28%_at_60%_42%,rgb(255_248_235/0.26),transparent_70%)] mix-blend-screen" />
        <div className="absolute inset-0 bg-[#0b1115]/25 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/75 via-bg/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-bg/70 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-bg/80 to-transparent" />
      </div>

      <div className="wrap relative z-10 pt-24">
        <div className="grid gap-8 pt-16 md:grid-cols-12 md:pt-24">
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

      <div className="relative mt-auto pt-20 md:pt-12">
        <Panorama
          data={SCHILT}
          mobileView={{ x0: 990, x1: 1640 }}
          labels={HERO_LABELS}
          yMax={470}
          layers="sky"
          glow
          fade={false}
          guide={false}
          horizonLine={false}
          closure
          reveal="wipe"
        />
      </div>
    </section>
  );
}
