import Link from "next/link";

// Ein Bild, ein Satz, zwei Wege weiter.
export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative flex min-h-svh flex-col overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Brand_assets/arcl-header.jpg"
        alt="Klöntalersee im Kanton Glarus, Sonnenstrahlen über den Bergen"
        width={2200}
        height={1238}
        fetchPriority="high"
        className="zoom-in absolute inset-0 h-full w-full object-cover object-[50%_60%]"
      />
      {/* Ruhige Abdunklung, damit Text und Navigation lesbar bleiben */}
      <div aria-hidden className="absolute inset-0 bg-black/40" />

      <div className="wrap relative z-10 flex flex-1 flex-col items-center pt-[22svh] text-center">
        <h1 id="hero-title" className="display max-w-[14ch]" data-rise>
          Creative Studio aus Glarus.
        </h1>
        <p className="lead mt-5 max-w-[34rem] text-ink/85" data-rise style={{ ["--i" as string]: 1 }}>
          Video, Design, Web und Hosting aus einer Hand. Und eigene Marken, die
          zeigen, dass es funktioniert.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3" data-rise style={{ ["--i" as string]: 2 }}>
          <Link href="/kontakt" className="btn">Projekt anfragen</Link>
          <Link href="/projekte" className="btn-quiet">Projekte ansehen</Link>
        </div>
      </div>
    </section>
  );
}
