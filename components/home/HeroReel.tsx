"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export type ReelFrame = { src: string; alt: string; caption: string };

// Hero: Der Satz bleibt stehen, in der Mitte läuft ein Filmstreifen
// mit den eigenen Marken durch.
export default function HeroReel({ frames }: { frames: ReelFrame[] }) {
  const wrapRef = useRef<HTMLElement>(null);
  const reelRef = useRef<HTMLSpanElement>(null);
  const capRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const reel = reelRef.current;
    if (!wrap || !reel) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = -1;

    const update = () => {
      raf = 0;
      if (matchMedia("(max-width: 767px)").matches) return;
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const steps = frames.length - 1;
      const frame = reel.firstElementChild as HTMLElement | null;
      const step = frame ? frame.offsetHeight + 24 : 0;
      // Mit reduzierter Bewegung springt der Streifen von Bild zu Bild.
      const pos = reduce ? Math.round(p * steps) : p * steps;
      reel.style.transform = `translate3d(0, ${-pos * step}px, 0)`;
      const idx = Math.round(p * steps);
      if (idx !== last && capRef.current) {
        last = idx;
        capRef.current.textContent = frames[idx].caption;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    // Auf dem Handy läuft der Streifen von selbst weiter.
    const mobile = matchMedia("(max-width: 767px)");
    let tick = 0;
    let timer = 0;
    const startAuto = () => {
      window.clearInterval(timer);
      if (!mobile.matches || reduce) return;
      let shown = 0;
      timer = window.setInterval(() => {
        // Nach zwei Runden bleibt der Streifen stehen.
        if (++shown >= frames.length * 2) {
          window.clearInterval(timer);
          return;
        }
        tick = (tick + 1) % frames.length;
        const frame = reel.firstElementChild as HTMLElement | null;
        const step = frame ? frame.offsetHeight + 24 : 0;
        reel.style.transform = `translate3d(0, ${-tick * step}px, 0)`;
      }, 3500);
    };
    startAuto();
    mobile.addEventListener("change", startAuto);

    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      mobile.removeEventListener("change", startAuto);
      window.clearInterval(timer);
      cancelAnimationFrame(raf);
    };
  }, [frames]);

  return (
    <section
      ref={wrapRef}
      aria-labelledby="hero-title"
      className="relative md:h-[200svh]"
    >
      <div className="wrap relative flex min-h-svh flex-col pb-8 pt-24 md:sticky md:top-0 md:h-svh md:pb-6 md:pt-[5.5rem]">
        {/* Der Satz, geteilt durch den Filmstreifen der eigenen Marken */}
        <h1
          id="hero-title"
          className="display relative z-10 flex flex-1 flex-col text-[11.5vw] md:text-[min(7.6vw,13svh)]"
        >
          <span data-rise style={{ ["--i" as string]: 0 }} className="block">
            Creative Studio
          </span>

          <span aria-hidden className="my-5 block flex-1 md:my-3">
            <span className="mx-auto block h-[calc((100vw-2*var(--margin))*3/4+56px)] overflow-hidden md:h-full md:max-h-[calc(46vw*9/16+104px)] md:w-[46vw] md:min-h-[12rem]">
              <span
                ref={reelRef}
                className="flex flex-col gap-6 pt-[28px] transition-transform duration-700 ease-[var(--ease-in-out)] will-change-transform md:pt-[52px] md:transition-none"
              >
                {frames.map((f, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={f.src}
                    src={f.src}
                    alt=""
                    width={1600}
                    height={900}
                    loading={i < 2 ? "eager" : "lazy"}
                    className="aspect-[4/3] w-full shrink-0 rounded-[4px] object-cover md:aspect-video"
                  />
                ))}
              </span>
            </span>
          </span>

          <span
            data-rise
            style={{ ["--i" as string]: 1 }}
            className="block self-end"
          >
            aus Glarus.
          </span>
        </h1>

        {/* Unten links: was Aracle ist */}
        <div
          data-rise
          style={{ ["--i" as string]: 2 }}
          className="relative z-10 mt-8 max-w-[26rem] md:absolute md:bottom-6 md:left-[var(--margin)] md:mt-0 md:max-w-[22rem] lg:max-w-[26rem]"
        >
          <p>
            Video, Design, Web und Hosting aus einer Hand. Dazu eigene Marken,
            von Bikerstreetwear bis zur eigenen Cloud.
          </p>
          <Link href="/kontakt" className="btn mt-6 md:hidden">
            Projekt anfragen
          </Link>
        </div>

        <p
          ref={capRef}
          aria-live="off"
          className="small absolute right-[var(--margin)] top-[5.5rem] z-10 hidden text-muted md:block"
        >
          {frames[0].caption}
        </p>
      </div>
    </section>
  );
}
