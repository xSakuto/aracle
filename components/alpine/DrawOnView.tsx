"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Setzt "is-drawn", sobald der Inhalt ins Bild kommt. Die Linien selbst werden
 * auf dem Server gerendert, hier kommt nur der Auslöser für die Animation dazu.
 */
export default function DrawOnView({ children, className = "", threshold = 0.15 }: { children: ReactNode; className?: string; threshold?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-drawn", "no-anim");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-drawn");
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return (
    <div ref={ref} className={`pano ${className}`}>
      {children}
    </div>
  );
}
