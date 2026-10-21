import Link from "next/link";

export type RunItem = {
  title: string;
  line: string;
  href: string;
  meta: string;
  src?: string;
  alt?: string;
  tone?: "glow" | "glacier" | "slate";
};

const toneCls: Record<NonNullable<RunItem["tone"]>, string> = {
  glow: "bg-glow text-accent-ink",
  glacier: "bg-aqua text-accent-ink",
  slate: "bg-raised text-ink",
};

// Portfolio: Die Arbeiten laufen horizontal vorbei, während der Abschnitt steht.
// Auf dem Handy liegen sie untereinander.
export default function BrandRun({ items, total }: { items: RunItem[]; total: number }) {
  return (
    <section aria-labelledby="work-title" data-hscroll className="relative overflow-hidden">
      <div
        data-hscroll-track
        className="flex flex-col gap-10 px-[var(--margin)] py-[var(--section)] md:h-svh md:w-max md:flex-row md:items-center md:gap-8 md:py-0"
      >
        <div className="shrink-0 md:w-[30vw]">
          <p className="kicker text-aqua">Portfolio</p>
          <h2 id="work-title" className="display mt-4" data-split>
            Üsi Arbeite
          </h2>
          <p className="lead mt-6 max-w-[24rem] text-ink/80">
            Eigene Marken und Projekte. Was wir für andere bauen, probieren wir
            zuerst an uns selbst aus.
          </p>
        </div>

        {items.map((it) => (
          <Link
            key={it.title}
            href={it.href}
            data-cursor="Ansehen"
            className={`group flex shrink-0 flex-col ${it.src ? "md:w-[46vw]" : "md:w-[28vw]"}`}
          >
            <div
              className={`relative h-[56svh] overflow-hidden rounded-[var(--radius)] md:h-[64svh] ${
                it.src ? "" : toneCls[it.tone ?? "slate"]
              }`}
            >
              {it.src ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.src}
                    alt={it.alt ?? it.title}
                    width={1600}
                    height={1067}
                    loading="lazy"
                    data-hscroll-img
                    className="absolute inset-0 h-full w-[116%] max-w-none object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03] md:-left-[8%]"
                  />
                  <div aria-hidden className="absolute inset-0 bg-[#0b1115]/20" />
                </>
              ) : (
                <div className="flex h-full flex-col justify-between p-7 md:p-9">
                  <p className="kicker opacity-70">{it.meta}</p>
                  <p className="text-[clamp(2.75rem,1rem+4.4vw,6rem)] font-[650] leading-[0.9] tracking-[-0.05em]">
                    {it.title}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-6 border-t border-line pt-4">
              <h3 className="text-[1.25rem] font-semibold tracking-[-0.02em] transition-colors group-hover:text-aqua">
                {it.title}
              </h3>
              <p className="small shrink-0 text-muted">{it.meta}</p>
            </div>
            <p className="mt-1 max-w-[34rem] text-muted">{it.line}</p>
          </Link>
        ))}

        <Link
          href="/projekte"
          data-cursor="Alli"
          className="group flex h-[30svh] shrink-0 flex-col justify-end rounded-[var(--radius)] border border-line p-8 transition-colors hover:border-aqua md:h-[64svh] md:w-[22vw]"
        >
          <span className="display text-[clamp(2.25rem,1rem+3vw,4.5rem)] group-hover:text-aqua">
            Alli {total} Projekt
          </span>
          <span className="mt-3 text-muted">Von Minecraft bis Streetwear</span>
        </Link>
      </div>
    </section>
  );
}
