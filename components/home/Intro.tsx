import Link from "next/link";
import Snow from "@/components/fx/Snow";
import GlarusClock from "@/components/swiss/GlarusClock";
import SwissCross from "@/components/swiss/SwissCross";

// Erster Bildschirm: der Klöntalersee, leiser Schnee, ein Grüezi.
export default function Intro() {
  return (
    <section aria-labelledby="hero-title" className="relative flex min-h-svh flex-col overflow-hidden">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Brand_assets/arcl-header.jpg"
          alt="Der Klöntalersee im Glarnerland, Sonnenstrahlen über den Bergen"
          width={2200}
          height={1238}
          fetchPriority="high"
          data-parallax="0.08"
          className="h-[112%] w-full object-cover object-[50%_55%]"
        />
        {/* Gletscherton über dem Schwarzweissbild, unten ruhig ins Nachtblau */}
        <div aria-hidden className="absolute inset-0 bg-[#0b1115]/45 mix-blend-multiply" />
        <div aria-hidden className="absolute inset-0 bg-[#8fd6d3]/10 mix-blend-color" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent" />
      </div>
      <Snow />

      <div className="wrap relative z-10 flex flex-1 flex-col justify-between pb-10 pt-24">
        {/* Schweizer Kopfzeile wie auf einer Landkarte */}
        <div className="kicker grid grid-cols-2 gap-4 text-ink/80 md:grid-cols-4" data-rise>
          <p className="flex items-center gap-2">
            <SwissCross className="h-3.5 w-3.5" /> CH-8755 Ennenda
          </p>
          <p className="hidden md:block">47.04° N, 9.07° O</p>
          <p className="hidden md:block">Klöntalersee, 848 m ü. M.</p>
          <p className="text-right">
            Glarus <GlarusClock />
          </p>
        </div>

        <div className="max-w-[72rem]">
          <p className="lead text-aqua" data-rise style={{ ["--i" as string]: 1 }}>
            Creative Studio us em Glarnerland
          </p>
          <h1 id="hero-title" className="mega mt-4" data-split="load">
            Grüezi. Mir sind Aracle.
          </h1>
          <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,34rem)_auto] md:items-end md:justify-between">
            <p className="lead text-ink/85" data-rise style={{ ["--i" as string]: 3 }}>
              Wir machen Video, Design, Web und Hosting für Firmen und Marken,
              die etwas zu erzählen haben. Seit 2017, aus Ennenda.
            </p>
            <div className="flex flex-wrap gap-3" data-rise style={{ ["--i" as string]: 4 }}>
              <Link href="/projekte" className="btn">Arbeiten ansehen</Link>
              <Link href="/kontakt" className="btn-quiet">Projekt anfragen</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
