"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export type SeamProject = {
  slug: string;
  href: string;
  title: string;
  line: string;
  src: string;
  alt: string;
  /** Ausschnitt für die rechte Hälfte (Detail) */
  detail: string;
};

// Eigene Marken: links das ganze Bild, rechts ein Ausschnitt. Der Name
// sitzt auf der Naht und reisst auseinander, bis die Marke in der Mitte steht.
export default function WorkSeam({ projects }: { projects: SeamProject[] }) {
  const wrapRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const items = Array.from(wrap.querySelectorAll<HTMLElement>("[data-seam]"));
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      // Fortschritt über alle Projekte, 0 = erstes steht in der Mitte.
      const at = p * (items.length - 1);
      items.forEach((el, i) => {
        const d = Math.max(-1, Math.min(1, at - i)); // -1 kommt, 0 Mitte, 1 geht
        // Jede Marke steht eine Weile ganz, dann ein kurzer Wechsel.
        const vis = Math.max(0, Math.min(1, 1 - (Math.abs(at - i) - 0.3) * 2.5));
        el.style.opacity = String(vis);
        el.style.visibility = vis < 0.01 ? "hidden" : "visible";
        el.style.setProperty("--d", reduce ? "0" : String(d));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      aria-labelledby="work-title"
      className="relative"
    >
      <div className="wrap grid grid-cols-12 gap-x-8 gap-y-6 pb-16 pt-[var(--section)]">
        <h2 id="work-title" className="head col-span-12 md:col-span-6" data-reveal>
          Eigene Marken
        </h2>
        <p
          className="col-span-12 max-w-[34rem] md:col-span-5 md:col-start-8 md:self-end"
          data-reveal
          style={{ ["--i" as string]: 1 }}
        >
          Was wir für andere bauen, probieren wir zuerst an uns selbst aus.
          Drei Marken laufen heute unter dem Aracle-Dach.
        </p>
      </div>
      <div
        className="relative"
        style={{ height: `${projects.length * 80 + 20}svh` }}
      >
      <div className="sticky top-0 h-svh overflow-hidden">

        {projects.map((p, i) => (
          <article
            key={p.slug}
            data-seam
            aria-labelledby={`seam-${p.slug}`}
            className="absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {/* Linke Hälfte: das ganze Bild */}
            <div
              className="absolute left-0 top-[-20svh] h-[140svh] w-1/2 overflow-hidden"
              style={{ transform: "translate3d(0, calc(var(--d, 0) * -20svh), 0)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.alt}
                width={1600}
                height={1067}
                loading="eager"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
            {/* Rechte Hälfte: der Ausschnitt */}
            <div
              className="absolute right-0 top-[-20svh] h-[140svh] w-1/2 overflow-hidden"
              style={{ transform: "translate3d(0, calc(var(--d, 0) * 20svh), 0)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt=""
                width={1600}
                height={1067}
                loading="eager"
                className="h-full w-full scale-[1.35] object-cover"
                style={{ objectPosition: p.detail, transformOrigin: p.detail }}
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Der Name, zweimal gesetzt und an der Naht geteilt */}
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-[var(--margin)] text-center">
              <h3
                id={`seam-${p.slug}`}
                className="display relative uppercase leading-[0.82] tracking-[-0.04em] text-ink"
              >
                <span
                  className="block"
                  style={{
                    clipPath: "inset(-10% 50% -10% -10%)",
                    transform: "translate3d(0, calc(var(--d, 0) * -30svh), 0)",
                  }}
                >
                  {p.title}
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 block"
                  style={{
                    clipPath: "inset(-10% -10% -10% 50%)",
                    transform: "translate3d(0, calc(var(--d, 0) * 30svh), 0)",
                  }}
                >
                  {p.title}
                </span>
              </h3>
              <p className="mt-6 text-ink">{p.line}</p>
              <Link
                href={p.href}
                className="link-under pointer-events-auto mt-2 inline-flex min-h-11 items-center text-ink"
              >
                Zur Marke {p.title}
              </Link>
            </div>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}
