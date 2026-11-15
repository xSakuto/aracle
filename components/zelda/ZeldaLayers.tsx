"use client";

import { useEffect, useRef } from "react";

// Zelda und Navi als Ebenen im Hero: Zelda steht hinter dem Text und dem Verlauf,
// Navi folgt dem Mauszeiger (am Handy schwebt sie von allein). Nur transform wird bewegt.
export default function ZeldaLayers() {
  const root = useRef<HTMLDivElement>(null);
  const zelda = useRef<HTMLDivElement>(null);
  const navi = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !zelda.current || !navi.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = el.clientWidth;
    let h = el.clientHeight;
    const target = { x: w * 0.58, y: h * 0.3, nx: 0, ny: 0 };
    const cur = { x: target.x, y: target.y, nx: 0, ny: 0 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (e.clientY < r.top - 80 || e.clientY > r.bottom + 80) return;
      target.x = e.clientX - r.left + 28;
      target.y = e.clientY - r.top - 28;
      target.nx = (e.clientX - r.left) / r.width - 0.5;
      target.ny = (e.clientY - r.top) / r.height - 0.5;
    };
    const onResize = () => { w = el.clientWidth; h = el.clientHeight; };

    const tick = () => {
      cur.x += (target.x - cur.x) * 0.07;
      cur.y += (target.y - cur.y) * 0.07;
      cur.nx += (target.nx - cur.nx) * 0.05;
      cur.ny += (target.ny - cur.ny) * 0.05;
      navi.current!.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      zelda.current!.style.transform = `translate3d(${cur.nx * -26}px, ${cur.ny * -12}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes navi-bob { 0%,100% { transform: translate3d(0,0,0) rotate(-4deg); } 50% { transform: translate3d(6px,-12px,0) rotate(4deg); } }
        .navi-bob { animation: navi-bob 3.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .navi-bob { animation: none; } }
      `}</style>
      <div ref={zelda} className="absolute bottom-0 right-[-6%] h-[62%] md:right-[4%] md:h-[88%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/zelda/zelda-duo.png" alt="" width={790} height={1058} className="bg-transparent h-full w-auto max-w-none object-contain opacity-90 drop-shadow-[0_0_40px_rgb(143_214_211/0.25)]" />
      </div>
      <div ref={navi} className="absolute left-0 top-0 will-change-transform" style={{ transform: "translate3d(58vw, 22vh, 0)" }}>
        <div className="navi-bob">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/zelda/navi.png" alt="" width={347} height={330} className="bg-transparent h-14 w-auto drop-shadow-[0_0_22px_rgb(120_200_255/0.7)] md:h-20" />
        </div>
      </div>
    </div>
  );
}
