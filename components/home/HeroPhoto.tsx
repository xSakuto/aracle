import Link from "next/link";
import Panorama from "@/components/alpine/Panorama";
import GlarusClock from "@/components/swiss/GlarusClock";
import { SCHILT } from "@/data/panorama/schilt";
import { meters } from "@/lib/panorama";
import { HERO_LABELS } from "./HeroTechnical";

// Variante A "Photography First": der Klöntalersee als Bühne, darüber feine
// Vermessungsmarken. Darunter zeichnet sich dieselbe Landschaft als Panorama.

const IMG = { w: 2560, h: 1440 };

/** Markierung an einer Bildstelle (u, v als Anteil von Breite und Höhe) */
function Mark({ u, v, title, sub, side = "right", i }: { u: number; v: number; title: string; sub: string; side?: "left" | "right"; i: number }) {
  return (
    <div className="absolute" data-rise style={{ left: `${u * 100}%`, top: `${v * 100}%`, ["--i" as string]: 5 + i }}>
      <span className="absolute -left-[5px] -top-[5px] block h-[10px] w-[10px]">
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink/80" />
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink/80" />
      </span>
      <span className={`absolute top-0 h-px w-10 bg-ink/50 ${side === "right" ? "left-2" : "right-2"}`} />
      <span
        className={`absolute -top-[0.55rem] whitespace-nowrap leading-tight ${side === "right" ? "left-14" : "right-14 text-right"}`}
      >
        <span className="block text-[0.8125rem] font-medium text-ink">{title}</span>
        <span className="nums block text-[0.6875rem] text-ink/70">{sub}</span>
      </span>
    </div>
  );
}

export default function HeroPhoto() {
  const sp = SCHILT.standpoint;
  return (
    <>
      <section aria-labelledby="hero-title" className="relative flex min-h-svh flex-col overflow-hidden">
        {/* Bild füllt die Fläche; die Markierungsebene bildet den Ausschnitt exakt nach */}
        <div className="absolute inset-0 [container-type:size]">
          <picture>
            <source type="image/webp" srcSet="/images/hero/kloentalersee-1280.webp 1280w, /images/hero/kloentalersee-2560.webp 2560w" sizes="100vw" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero/kloentalersee-1280.jpg"
              srcSet="/images/hero/kloentalersee-1280.jpg 1280w, /images/hero/kloentalersee-2560.jpg 2560w"
              sizes="100vw"
              alt="Der Klöntalersee im Glarnerland, links die Felswände des Glärnisch, Blick nach Westen"
              width={IMG.w}
              height={IMG.h}
              fetchPriority="high"
              className="hero-photo h-full w-full object-cover"
            />
          </picture>
          {/* Ton: ruhiges Nachtblau, Text links und unten gut lesbar */}
          <div aria-hidden className="absolute inset-0 bg-[#0b1115]/20 mix-blend-multiply" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#0b1115]/60 via-[#0b1115]/15 to-transparent" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
          <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg/70 to-transparent" />

          <div aria-hidden className="hero-photo-frame absolute">
            <Mark u={0.205} v={0.31} title="Glärnisch" sub="Nordflanke" i={0} />
            <Mark u={0.6} v={0.66} title="Klöntalersee" sub="848 m ü. M." side="right" i={1} />
          </div>
        </div>

        {/* Schnittmarken wie auf einem Druckbogen */}
        <div aria-hidden className="pointer-events-none absolute inset-x-[var(--margin)] bottom-6 top-20 hidden md:block">
          {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "left-0 bottom-0 border-l border-b", "right-0 bottom-0 border-r border-b"].map((c) => (
            <span key={c} className={`absolute h-4 w-4 border-ink/40 ${c}`} />
          ))}
        </div>

        <div className="wrap relative z-10 flex flex-1 flex-col justify-between pb-14 pt-24 md:px-[calc(var(--margin)+1.5rem)]">
          <dl className="kicker grid grid-cols-2 gap-4 pt-4 text-ink/75 md:grid-cols-4">
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

          <div className="mt-auto grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="kicker text-aqua" data-rise style={{ ["--i" as string]: 1 }}>
                Create. Connect. Inspire.
              </p>
              <h1 id="hero-title" className="display mt-5" data-split="load">
                Creative thinking. Technical execution.
              </h1>
            </div>
            <div className="md:col-span-4" data-rise style={{ ["--i" as string]: 3 }}>
              <p className="text-ink/90">
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
      </section>

      {/* Übergang: dieselben Berge, vermessen */}
      <div className="relative pb-6 pt-24 md:pt-28">
        <div className="wrap mb-20 flex items-baseline justify-between gap-6 md:mb-14">
          <p className="kicker text-muted">Vom Schilt aus gezeichnet</p>
          <p className="small hidden text-muted md:block">
            {meters(sp.m)} m ü. M., {sp.lat.toFixed(3)}° N, {sp.lon.toFixed(3)}° E, Blick nach Südwesten
          </p>
        </div>
        <Panorama data={SCHILT} mobileView={{ x0: 990, x1: 1640 }} labels={HERO_LABELS} yMax={430} draw="scroll" scale />
      </div>
    </>
  );
}
