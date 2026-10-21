"use client";

import { useEffect, useRef } from "react";

// Eigener Cursor: Punkt plus Ring, der über Links wächst.
// Elemente mit data-cursor="Text" zeigen den Text im Ring.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || !dot.current || !ring.current) return;
    document.documentElement.classList.add("has-cursor");
    const p = { x: innerWidth / 2, y: innerHeight / 2 };
    const r = { x: p.x, y: p.y };
    let raf = 0;
    let shown = false;

    const move = (e: PointerEvent) => {
      p.x = e.clientX;
      p.y = e.clientY;
      if (!shown) {
        shown = true;
        r.x = p.x;
        r.y = p.y;
        dot.current!.style.opacity = "1";
        ring.current!.style.opacity = "1";
      }
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor], label, summary");
      ring.current!.classList.toggle("is-hover", Boolean(t));
      const text = t?.dataset.cursor ?? "";
      label.current!.textContent = text;
      ring.current!.classList.toggle("has-label", Boolean(text));
    };
    const leave = () => {
      shown = false;
      dot.current!.style.opacity = "0";
      ring.current!.style.opacity = "0";
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      r.x += (p.x - r.x) * 0.18;
      r.y += (p.y - r.y) * 0.18;
      dot.current!.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      ring.current!.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
    };
    loop();
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div aria-hidden>
      <div ref={dot} className="cursor cursor-dot" style={{ opacity: 0 }} />
      <div ref={ring} className="cursor cursor-ring" style={{ opacity: 0 }}>
        <span ref={label} />
      </div>
    </div>
  );
}
