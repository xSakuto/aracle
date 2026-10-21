"use client";

import { useEffect, useRef } from "react";

// Leises Schneegestöber über dem Klöntalersee. Bleibt im Hero.
export default function Snow() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    type Flake = { x: number; y: number; r: number; v: number; d: number; o: number };
    let flakes: Flake[] = [];
    let wind = 0;
    let mouseX = 0;

    const resize = () => {
      const box = c.getBoundingClientRect();
      W = box.width;
      H = box.height;
      c.width = W * dpr;
      c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((W * H) / (W < 768 ? 9000 : 7000));
      flakes = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.6 + Math.random() * 1.8,
        v: 0.25 + Math.random() * 0.7,
        d: Math.random() * Math.PI * 2,
        o: 0.25 + Math.random() * 0.55,
      }));
    };
    resize();
    addEventListener("resize", resize);
    const onMove = (e: PointerEvent) => (mouseX = e.clientX / innerWidth - 0.5);
    addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      ctx.clearRect(0, 0, W, H);
      wind += (mouseX * 0.8 - wind) * 0.02;
      for (const f of flakes) {
        if (!reduce) {
          f.d += 0.01;
          f.y += f.v;
          f.x += Math.sin(f.d) * 0.3 + wind * f.r;
          if (f.y > H + 4) {
            f.y = -4;
            f.x = Math.random() * W;
          }
          if (f.x > W + 4) f.x = -4;
          if (f.x < -4) f.x = W + 4;
        }
        // Nach unten hin verblassen, damit der Text frei bleibt
        const fade = 1 - Math.max(0, (f.y - H * 0.55) / (H * 0.45));
        ctx.globalAlpha = f.o * fade;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = "#eef3f3";
        ctx.fill();
      }
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
