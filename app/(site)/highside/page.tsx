import Link from "next/link";
import ProductMockup from "@/components/visuals/ProductMockup";

export const metadata = {
  title: "Highside · Swiss biker streetwear",
  description: "Highside ist Schweizer Streetwear aus der Motorrad-Szene. Eine Marke von Aracle. Ride or regret.",
};

const preview = [
  { motif: "tee" as const, caption: "T-Shirt" },
  { motif: "hoodie" as const, caption: "Hoodie" },
  { motif: "patch" as const, caption: "Patch" },
  { motif: "label" as const, caption: "Label" },
];

// Highside auf aracle.ch: eigene Welt mit Schwarz, Cyan und gotischem Schriftzug,
// so wie die Marke selbst auftritt. Die Aracle-Leiste bleibt oben als Dach.
export default function HighsidePage() {
  return (
    <div className="theme-highside hs bg-[#060708]">
      {/* Poppins für Text; der Schriftzug kommt aus Angel Wish, selbst gehostet */}
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
          <h1 className="hs-black mt-2 text-[clamp(5rem,2rem+15vw,16rem)] leading-[0.85]" data-rise style={{ ["--i" as string]: 1 }}>
            Highside
          </h1>
          <div className="mt-8 flex flex-col gap-6 border-t border-white/15 pt-6 md:flex-row md:items-end md:justify-between" data-rise style={{ ["--i" as string]: 2 }}>
            <p className="hs-sans max-w-[30ch] text-[clamp(1.125rem,1rem+0.6vw,1.5rem)] font-medium leading-snug">
              Schweizer Streetwear aus der Motorrad-Szene. Zwischen Rennstrecke und Strasse.
            </p>
            <p className="hs-sans text-[clamp(1.5rem,1rem+1.4vw,2.5rem)] font-extrabold uppercase tracking-[-0.02em] text-aqua">
              Ride or regret.
            </p>
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
          <h2 id="hs-drop" className="hs-sys">The movement is loading...</h2>
          <p className="hs-sans small text-white/50">Platzhalter, die ersten Teile folgen</p>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {preview.map((p, i) => (
            <li key={p.motif} data-reveal style={{ ["--i" as string]: i }}>
              <ProductMockup motif={p.motif} caption={p.caption} className="aspect-square w-full overflow-hidden rounded-[2px]" />
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
            <Link href="/projekte/swizzly" className="btn-quiet rounded-[2px] font-semibold uppercase tracking-[0.04em]">
              Swizzly
            </Link>
          </div>
        </div>
        <p className="wrap hs-sys pb-10 text-[0.75rem] text-white/40">HIGHSIDE_EST · Eine Marke von Aracle</p>
      </section>
    </div>
  );
}
