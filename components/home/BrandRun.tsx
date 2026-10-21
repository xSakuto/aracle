import Link from "next/link";

export type RunBrand = {
  title: string;
  line: string;
  href: string;
  src: string;
  alt: string;
};

// Die Marken fahren horizontal vorbei, während der Abschnitt steht (Desktop).
// Auf dem Handy liegen sie untereinander.
export default function BrandRun({ brands, total }: { brands: RunBrand[]; total: number }) {
  return (
    <section aria-labelledby="brands-title" data-hscroll data-shape="wheel" className="relative overflow-hidden">
      <div data-hscroll-track className="flex flex-col gap-6 px-[var(--margin)] py-[var(--section)] md:h-svh md:w-max md:flex-row md:items-center md:gap-10 md:py-0">
        <div className="shrink-0 md:w-[34vw]">
          <h2 id="brands-title" className="display md:text-[clamp(2.5rem,4.4vw,5.5rem)]" data-split>
            Eigene Marken
          </h2>
          <p className="lead mt-6 max-w-[26rem] text-ink/80">
            Was wir für andere bauen, probieren wir zuerst an uns selbst aus.
          </p>
        </div>

        {brands.map((b) => (
          <Link
            key={b.title}
            href={b.href}
            data-cursor="Ansehen"
            className="group relative block h-[70svh] shrink-0 overflow-hidden rounded-[var(--radius)] md:h-[76svh] md:w-[58vw]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.src}
              alt={b.alt}
              width={1600}
              height={1067}
              loading="lazy"
              data-hscroll-img
              className="absolute inset-0 h-full w-[120%] max-w-none object-cover transition-[filter] duration-500 group-hover:brightness-110 md:-left-[10%]"
            />
            <div aria-hidden className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <h3 className="mega text-[clamp(3rem,1rem+7vw,9rem)]">{b.title}</h3>
              <p className="lead mt-3 max-w-[30rem] text-ink/90">{b.line}</p>
            </div>
          </Link>
        ))}

        <Link
          href="/projekte"
          data-cursor="Alle"
          className="group flex h-[40svh] shrink-0 flex-col justify-end rounded-[var(--radius)] bg-aqua p-8 text-accent-ink transition-transform active:scale-[0.99] md:h-[76svh] md:w-[30vw]"
        >
          <span className="display text-[clamp(2.5rem,1rem+4vw,5.5rem)]">Alle {total} Projekte</span>
          <span className="mt-4 font-semibold">Von Minecraft bis Streetwear</span>
        </Link>
      </div>
    </section>
  );
}
