"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Inhaltsverzeichnis einer Projektseite. Markiert den Abschnitt, der gerade
 * gelesen wird, und zeigt den Fortschritt als feine Linie.
 */
export default function SectionIndex({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((e) => io.observe(e));

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!els.length || !bar.current) return;
        const top = els[0].getBoundingClientRect().top + scrollY;
        const last = els[els.length - 1];
        const end = last.getBoundingClientRect().bottom + scrollY - innerHeight * 0.6;
        const p = Math.min(1, Math.max(0, (scrollY + innerHeight * 0.4 - top) / Math.max(1, end - top)));
        bar.current.style.transform = `scaleY(${p.toFixed(3)})`;
      });
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [items]);

  return (
    <nav aria-label="Inhalt" className="relative pl-5">
      <span aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-line" />
      <span ref={bar} aria-hidden className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-aqua transition-transform duration-150" />
      <ol className="flex flex-col gap-1">
        {items.map((it, i) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              aria-current={active === it.id ? "true" : undefined}
              className={`group flex min-h-9 items-center gap-3 text-[0.9375rem] transition-colors hover:text-ink focus-visible:text-ink ${
                active === it.id ? "text-ink" : "text-muted"
              }`}
            >
              <span className={`nums text-[0.75rem] transition-colors ${active === it.id ? "text-aqua" : "text-muted/70"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
