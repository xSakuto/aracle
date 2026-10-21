import Link from "next/link";

// Erster Bildschirm: Die Partikel formen ARACLE, darunter der Satz, was wir sind.
export default function Intro() {
  return (
    <section
      aria-labelledby="hero-title"
      data-shape="word"
      className="wrap relative flex min-h-svh flex-col justify-between pb-8 pt-24"
    >
      <div className="flex items-start justify-between gap-6 text-muted">
        <p className="kicker" data-rise>
          Ennenda, Glarus
          <br />
          47.04° N, 9.07° O
        </p>
        <p className="kicker text-right" data-rise style={{ ["--i" as string]: 1 }}>
          Creative Studio
          <br />
          seit 2017
        </p>
      </div>

      {/* Platz für den Partikel-Schriftzug in der Mitte */}
      <div aria-hidden className="h-[34svh] md:h-[38svh]" />

      <div className="grid items-end gap-8 md:grid-cols-[1fr_auto]">
        <h1 id="hero-title" className="mega text-[min(10.5vw,4.6rem)] md:text-[min(7.2vw,14svh)]" data-split="load">
          Creative Studio
          <br />
          aus Glarus
        </h1>
        <div className="max-w-[24rem] md:pb-3" data-rise style={{ ["--i" as string]: 3 }}>
          <p className="lead text-ink/85">
            Video, Design, Web und Hosting. Dazu eigene Marken, von Bikerstreetwear bis zur eigenen Cloud.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/kontakt" className="btn">Projekt anfragen</Link>
            <Link href="/projekte" className="btn-quiet">Projekte</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
