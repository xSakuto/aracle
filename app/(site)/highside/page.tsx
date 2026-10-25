import Link from "next/link";

export const metadata = {
  alternates: { canonical: "/highside" }, openGraph: { images: [{ url: "/og/highside.jpg", width: 1200, height: 630 }] },
  title: "Highside · Swiss biker streetwear",
  description: "Highside ist Schweizer Streetwear aus der Motorrad-Szene. Eine Marke von Aracle. Ride or regret.",
};

// Erste Designs aus der Basic-Linie (Mockups, noch keine Produktfotos)
const designs = [
  { src: "/images/highside/basic-tee-back.webp", alt: "Schwarzes Highside Basic-Shirt von hinten mit grossem Schriftzug", label: "Basic Tee, Rücken", w: 1100, h: 1588 },
  { src: "/images/highside/basic-tee-front.webp", alt: "Schwarzes Highside Basic-Shirt von vorne mit kleinem Logo auf der Brust", label: "Basic Tee, Brust", w: 1100, h: 1588 },
  { src: "/images/highside/sweater-back.webp", alt: "Weisser Highside-Sweater von hinten in einer Gasse", label: "Basic Sweater", w: 784, h: 800 },
];

// Highside auf aracle.ch: eigene Welt mit Schwarz, Cyan und gotischem Schriftzug,
// so wie die Marke selbst auftritt. Die Aracle-Leiste bleibt oben als Dach.
export default function HighsidePage() {
  return (
    <div className="theme-highside hs bg-[#060708]">
      {/* Poppins für Text; der Schriftzug ist das Highside-Logo */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;800&display=swap"
        precedence="default"
      />

      <header className="relative flex min-h-[100svh] flex-col overflow-hidden">
        <div aria-hidden className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Brand_assets/images/heros/highside.jpg"
            alt=""
            width={1600}
            height={1067}
            fetchPriority="high"
            data-parallax="0.1"
            className="h-[112%] w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-[#060708]/55" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,#060708_8%,transparent_60%)]" />
          <div className="hs-scan absolute inset-0" />
        </div>

        <div className="wrap relative mt-auto pb-12 pt-32 md:pb-16">
          <p className="hs-sys text-aqua" data-rise>STREETWEAR_MOVEMENT_00</p>
          <h1 className="mt-4" data-rise style={{ ["--i" as string]: 1 }}>
            <span className="sr-only">Highside</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/highside/highside-logo-white.png" alt="" aria-hidden width={745} height={271} fetchPriority="high" className="h-auto w-[min(88vw,52rem)] bg-transparent" />
          </h1>
          <div className="mt-8 flex flex-col gap-6 border-t border-white/15 pt-6 md:flex-row md:items-end md:justify-between" data-rise style={{ ["--i" as string]: 2 }}>
            <p className="hs-sans max-w-[30ch] text-[clamp(1.125rem,1rem+0.6vw,1.5rem)] font-medium leading-snug">
              Schweizer Streetwear aus der Motorrad-Szene. Zwischen Rennstrecke und Strasse.
            </p>
            <div className="flex flex-col items-start gap-4 md:items-end">
              <p className="hs-sans text-[clamp(1.5rem,1rem+1.4vw,2.5rem)] font-extrabold uppercase tracking-[-0.02em] text-aqua">
                Ride or regret.
              </p>
              <a href="https://highside.ch" target="_blank" rel="noopener noreferrer" className="btn rounded-[2px] font-semibold uppercase tracking-[0.04em]">
                Zur Website, highside.ch <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <section aria-labelledby="hs-id" className="wrap py-[var(--section)]">
        <div className="grid gap-10 md:grid-cols-12">
          <h2 id="hs-id" className="hs-sans text-[clamp(2.25rem,1rem+4vw,5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em] md:col-span-7">
            Identity, Freedom, and Community.
          </h2>
          <div className="hs-sans md:col-span-4 md:col-start-9 md:pt-3">
            <p className="text-white/80">
              «Highside» ist ein Sturz in der Kurve, und genau dort fängt die Marke an: bei Leuten,
              die fahren, fallen und wieder aufsteigen. Kleidung für die Strecke und für danach.
            </p>
            <dl className="hs-sys mt-8 border-b border-white/15 text-[0.8125rem]">
              <div className="flex justify-between gap-4 border-t border-white/15 py-3">
                <dt className="text-white/50">Status</dt>
                <dd className="text-aqua">[ TO BE ANNOUNCED ]</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-white/15 py-3">
                <dt className="text-white/50">Phase</dt>
                <dd>01_In_Progress</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-white/15 py-3">
                <dt className="text-white/50">Herkunft</dt>
                <dd>Glarus, CH</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="hs-drop" className="wrap pb-[var(--section)]">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-white/15 pt-5">
          <h2 id="hs-drop" className="hs-sys">Basics_01</h2>
          <p className="hs-sans small text-white/50">Erste Designs als Mockup, Fotos folgen</p>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {designs.map((d) => (
            <li key={d.src}>
              <figure className="group">
                <div className="overflow-hidden rounded-[2px] bg-[#0d1112]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.src} alt={d.alt} width={d.w} height={d.h} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]" />
                </div>
                <figcaption className="hs-sys mt-3 text-[0.75rem] text-white/60">{d.label}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Weiter" className="border-t border-white/15">
        <div className="wrap hs-sans flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between">
          <p className="max-w-[36ch] text-white/80">
            Bis zum ersten Drop läuft die Marke über Content. Fahrten, Strecke und Strasse auf Swizzly.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="https://highside.ch" target="_blank" rel="noopener noreferrer" className="btn rounded-[2px] font-semibold uppercase tracking-[0.04em]">
              highside.ch
            </a>
            <Link href="/swizzly" className="btn-quiet rounded-[2px] font-semibold uppercase tracking-[0.04em]">
              Swizzly
            </Link>
          </div>
        </div>
        <p className="wrap hs-sys pb-10 text-[0.75rem] text-white/40">HIGHSIDE_EST · Eine Marke von Aracle</p>
      </section>
    </div>
  );
}
