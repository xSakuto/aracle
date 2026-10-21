"use client";

import { useRef, useState } from "react";

export type FloodService = { name: string; desc: string; src: string };

// Aqua flutet den Abschnitt. Darin die Leistungen als riesige Zeilen;
// beim Überfahren folgt ein Bild dem Cursor.
export default function ServiceFlood({ items }: { items: FloodService[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(0);
  const follow = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });

  const onMove = (e: React.PointerEvent) => {
    const el = follow.current;
    if (!el) return;
    const box = (e.currentTarget as HTMLElement).getBoundingClientRect();
    pos.current = { x: e.clientX - box.left, y: e.clientY - box.top };
    el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) rotate(-4deg)`;
  };

  return (
    <section aria-labelledby="services-title" data-flood data-shape="racks" className="relative">
      <div data-flood-bg className="absolute inset-0 bg-aqua" style={{ clipPath: "circle(150% at 50% 30%)" }} />
      <div className="wrap relative py-[var(--section)] text-accent-ink" onPointerMove={onMove}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="services-title" className="display" data-split>
            Was wir machen
          </h2>
          <p className="max-w-[22rem] font-medium">
            Vom ersten Bild bis zum Server, auf dem es läuft. Ein Team, ein
            Ansprechpartner.
          </p>
        </div>

        {/* Bild, das dem Cursor folgt (nur Desktop) */}
        <div
          ref={follow}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-20 hidden h-[16rem] w-[13rem] overflow-hidden rounded-2xl transition-opacity duration-300 md:block"
          style={{ opacity: active === null ? 0 : 1 }}
        >
          {items.map((s, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={s.name}
              src={s.src}
              alt=""
              width={600}
              height={740}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500"
              style={{ opacity: active === i ? 1 : 0, transform: active === i ? "scale(1)" : "scale(1.15)" }}
            />
          ))}
        </div>

        <ul className="mt-14">
          {items.map((s, i) => (
            <li key={s.name} className="border-t-2 border-accent-ink/80 last:border-b-2">
              <button
                type="button"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left md:py-6"
              >
                <span className="text-[clamp(2rem,1rem+5vw,6.5rem)] font-black uppercase leading-[0.9] tracking-[-0.01em] [font-stretch:125%] transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-4">
                  {s.name}
                </span>
                <span
                  aria-hidden
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-ink text-aqua transition-transform duration-300"
                  style={{ transform: open === i ? "rotate(45deg)" : "none" }}
                >
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M8 2v12M2 8h12" />
                  </svg>
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out)]"
                style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}
              >
                <p className="max-w-[40rem] overflow-hidden text-[1.1875rem] font-medium">
                  <span className="block pb-6">{s.desc}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
