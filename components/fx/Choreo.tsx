"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

let lenis: Lenis | null = null;

// Weiches Scrollen plus alle scrollgesteuerten Bewegungen der Seite.
export default function Choreo() {
  const pathname = usePathname();

  // Lenis einmal starten
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true, anchors: { offset: -64 } });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // Pro Seite die Bewegungen aufbauen
  useEffect(() => {
    // Bei Sprungmarken (z.B. /#leistungen) dorthin, sonst nach oben
    const hash = location.hash ? document.querySelector<HTMLElement>(decodeURIComponent(location.hash)) : null;
    if (hash) window.setTimeout(() => lenis?.scrollTo(hash, { offset: -64, immediate: true }), 60);
    else lenis?.scrollTo(0, { immediate: true });
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = matchMedia("(min-width: 768px)").matches;
    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      // Titel: Zeichen fahren aus ihrer Zeile hoch
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        if (reduce) return;
        const split = SplitText.create(el, { type: "lines,words,chars", linesClass: "split-line", aria: "auto" });
        splits.push(split);
        const immediate = el.dataset.split === "load";
        gsap.from(split.chars, {
          yPercent: 115,
          rotate: 6,
          duration: 1.1,
          ease: "expo.out",
          stagger: { each: 0.022 },
          delay: immediate ? 0.15 : 0,
          scrollTrigger: immediate ? undefined : { trigger: el, start: "top 85%", once: true },
        });
      });

      // Fliesstext, der Wort für Wort beim Scrollen aufleuchtet
      gsap.utils.toArray<HTMLElement>("[data-scrub-words]").forEach((el) => {
        if (reduce) return;
        const split = SplitText.create(el, { type: "words", wordsClass: "scrub-word", aria: "auto" });
        splits.push(split);
        gsap.to(split.words, {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 45%", scrub: true },
        });
      });

      // Parallaxe
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        if (reduce) return;
        const amt = parseFloat(el.dataset.parallax || "0.15");
        gsap.fromTo(
          el,
          { yPercent: -amt * 100 },
          {
            yPercent: amt * 100,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      // Bilder öffnen sich von unten
      gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
        if (reduce) return;
        gsap.fromTo(
          el,
          { clipPath: "inset(18% 8% 18% 8% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 90%", end: "top 25%", scrub: true },
          },
        );
      });

      // Aqua flutet den Abschnitt von der Mitte aus
      gsap.utils.toArray<HTMLElement>("[data-flood]").forEach((el) => {
        const bg = el.querySelector<HTMLElement>("[data-flood-bg]");
        if (!bg) return;
        if (reduce) {
          gsap.set(bg, { clipPath: "circle(150% at 50% 50%)" });
          return;
        }
        gsap.fromTo(
          bg,
          { clipPath: "circle(0% at 50% 30%)" },
          {
            clipPath: "circle(150% at 50% 30%)",
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 85%", end: "top 5%", scrub: true },
          },
        );
      });

      // Marken laufen horizontal durch, während der Abschnitt steht
      gsap.utils.toArray<HTMLElement>("[data-hscroll]").forEach((el) => {
        const track = el.querySelector<HTMLElement>("[data-hscroll-track]");
        if (!track || !wide || reduce) return;
        const dist = () => track.scrollWidth - innerWidth;
        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${dist()}`,
            scrub: 0.6,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
        // Bilder in den Karten wandern leicht gegen die Laufrichtung
        track.querySelectorAll<HTMLElement>("[data-hscroll-img]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
      });

      // Laufband, das mit der Scrollgeschwindigkeit anzieht
      gsap.utils.toArray<HTMLElement>("[data-marquee]").forEach((el) => {
        const tracks = el.querySelectorAll<HTMLElement>(".marquee-track");
        if (!tracks.length || reduce) return;
        const reverse = el.dataset.marquee === "reverse";
        const loop = gsap.fromTo(
          tracks,
          { xPercent: reverse ? -100 : 0 },
          { xPercent: reverse ? 0 : -100, duration: 24, ease: "none", repeat: -1 },
        );
        ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = Math.min(Math.abs(self.getVelocity()) / 400, 5);
            gsap.to(loop, { timeScale: 1 + v, duration: 0.3, overwrite: true });
            gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.3 });
          },
        });
      });

      // Zahlen zählen hoch
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = parseFloat(el.dataset.count || "0");
        if (reduce) {
          el.textContent = String(end);
          return;
        }
        const obj = { v: el.dataset.countFrom ? parseFloat(el.dataset.countFrom) : 0 };
        gsap.to(obj, {
          v: end,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => (el.textContent = String(Math.round(obj.v))),
        });
      });

      // Grosse Schlusszeile wächst ins Bild
      gsap.utils.toArray<HTMLElement>("[data-grow]").forEach((el) => {
        if (reduce) return;
        gsap.fromTo(
          el,
          { scale: 0.55, opacity: 0.2 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 95%", end: "top 35%", scrub: true },
          },
        );
      });
    });

    // Nach Schriftladen neu messen
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 600);

    return () => {
      window.clearTimeout(t);
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, [pathname]);

  return null;
}
