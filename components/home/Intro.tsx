import Link from "next/link";
import AlpineLines from "@/components/alpine/AlpineLines";
import GlarusClock from "@/components/swiss/GlarusClock";

// Erster Bildschirm: Haltung in einem Satz, darunter die Kammlinie des Glärnisch.
export default function Intro() {
  return (
    <section aria-labelledby="hero-title" className="relative flex min-h-svh flex-col overflow-hidden">
      {/* Feines 12er-Raster wie auf einem Planungsbogen */}
      <div aria-hidden className="swiss-grid pointer-events-none absolute inset-0" />

      <div className="wrap relative z-10 flex flex-1 flex-col pt-24">
        <dl className="kicker grid grid-cols-2 gap-4 border-b border-line pb-4 text-muted md:grid-cols-4">
          <div data-rise>
            <dt className="sr-only">Ort</dt>
            <dd>Ennenda, Glarus</dd>
          </div>
          <div className="hidden md:block" data-rise style={{ ["--i" as string]: 1 }}>
            <dt className="sr-only">Koordinaten</dt>
            <dd className="nums">47.04° N, 9.07° E</dd>
          </div>
          <div className="hidden md:block" data-rise style={{ ["--i" as string]: 2 }}>
            <dt className="sr-only">Seit</dt>
            <dd>Est. 2017</dd>
          </div>
          <div className="text-right" data-rise style={{ ["--i" as string]: 3 }}>
            <dt className="sr-only">Lokale Zeit</dt>
            <dd>
              Local time <GlarusClock />
            </dd>
          </div>
        </dl>

        <div className="grid flex-1 items-center gap-10 py-14 md:grid-cols-12 md:py-0">
          <div className="md:col-span-9">
            <p className="kicker text-aqua" data-rise style={{ ["--i" as string]: 1 }}>
              Creative &amp; Technology Studio
            </p>
            <h1 id="hero-title" className="mega mt-5" data-split="load">
              Creative thinking. Technical execution.
            </h1>
          </div>
          <div className="md:col-span-3 md:self-end md:pb-6" data-rise style={{ ["--i" as string]: 3 }}>
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

      <div className="relative z-0 -mt-6">
        <AlpineLines height={340} layers={5} annotate strong />
      </div>
    </section>
  );
}
