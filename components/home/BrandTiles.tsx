import Link from "next/link";

type Brand = {
  title: string;
  tagline: string;
  href: string;
  cta: string;
  src: string;
  alt: string;
};

function TileText({ b, size }: { b: Brand; size: "big" | "half" }) {
  return (
    <div className="relative z-10 px-6 pt-12 text-center md:pt-14">
      <h3 className={size === "big" ? "head" : "text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] leading-[1.1] tracking-[-0.03em]"}>
        {b.title}
      </h3>
      <p className="lead mt-2 text-ink/85">{b.tagline}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2">
        <Link href={b.href} className="link-under inline-flex min-h-11 items-center">
          Mehr erfahren
        </Link>
        <Link href="/kontakt" className="link-under inline-flex min-h-11 items-center">
          {b.cta}
        </Link>
      </div>
    </div>
  );
}

// Die eigenen Marken als grosse Kacheln, wie Produkte im Schaufenster.
export default function BrandTiles({ big, halves }: { big: Brand; halves: Brand[] }) {
  return (
    <section aria-labelledby="brands-title" className="wrap py-3">
      <h2 id="brands-title" className="sr-only">Eigene Marken</h2>
      <div className="inner flex flex-col gap-3">
        <article className="tile relative flex min-h-[44rem] flex-col md:min-h-[46rem]" data-reveal>
          <TileText b={big} size="big" />
          <div className="relative mt-10 flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={big.src}
              alt={big.alt}
              width={1600}
              height={1067}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </article>

        <div className="grid gap-3 md:grid-cols-2">
          {halves.map((b, i) => (
            <article key={b.title} className="tile relative flex min-h-[36rem] flex-col" data-reveal style={{ ["--i" as string]: i }}>
              <TileText b={b} size="half" />
              <div className="relative mt-8 flex-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.src}
                  alt={b.alt}
                  width={1600}
                  height={1067}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
