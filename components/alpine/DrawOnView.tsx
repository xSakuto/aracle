"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Setzt "is-drawn", sobald der Inhalt ins Bild kommt. Die Linien selbst werden
 * auf dem Server gerendert, hier kommt nur der Auslöser für die Animation dazu.
 */
/** Nach der Zeichenanimation: Maske entfernen, damit nichts mehr nachgerechnet wird. */
export function settle(el: Element) {
  el.classList.add("is-done");
}

export default function DrawOnView({ children, className = "", threshold = 0.15 }: { children: ReactNode; className?: string; threshold?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-drawn", "no-anim", "is-done");
      return;
    }
    let t = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-drawn");
          io.disconnect();
          t = window.setTimeout(() => settle(el), 4800);
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, [threshold]);
  return (
    <div ref={ref} className={`pano ${className}`}>
      {children}
    </div>
  );
}
