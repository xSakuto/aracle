"use client";

import { useRef, useState } from "react";

export type Service = { name: string; desc: string; src: string };

// Was mir mached: ruhige Liste zwischen Linien. Beim Überfahren folgt ein Bild dem Cursor.
export default function Services({ items }: { items: Service[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(0);
  const follow = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = follow.current;
    if (!el) return;
    const box = (e.currentTarget as HTMLElement).getBoundingClientRect();
    el.style.transform = `translate3d(${e.clientX - box.left}px, ${e.clientY - box.top}px, 0) translate(-50%, -50%)`;
  };

  return (
    <section aria-labelledby="services-title" className="wrap relative py-[var(--section)]" onPointerMove={onMove}>
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="kicker text-aqua">Leistungen</p>
          <h2 id="services-title" className="display mt-4" data-split>
            Was mir mached
          </h2>
          <p className="mt-6 max-w-[22rem] text-muted">
            Vom ersten Bild bis zum Server, auf dem es läuft. Ein Team, ein
            Ansprechpartner, kurze Wege.
          </p>
        </div>

        <ul className="md:col-span-8">
          {items.map((s, i) => (
            <li key={s.name} className="border-t border-line last:border-b">
              <button
                type="button"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="text-[clamp(1.75rem,1rem+2.6vw,3.5rem)] font-[600] leading-none tracking-[-0.04em] transition-[color,transform] duration-500 ease-[var(--ease-out)] group-hover:translate-x-2 group-hover:text-aqua">
                  {s.name}
                </span>
                <span
                  aria-hidden
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-ink transition-transform duration-300"
                  style={{ transform: open === i ? "rotate(45deg)" : "none" }}
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.6}>
                    <path d="M8 2v12M2 8h12" />
                  </svg>
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out)]"
                style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}
              >
                <p className="max-w-[38rem] overflow-hidden text-ink/80">
                  <span className="block pb-6">{s.desc}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Bild, das dem Cursor folgt (nur Desktop) */}
      <div
        ref={follow}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 hidden h-[15rem] w-[12rem] overflow-hidden rounded-[var(--radius)] transition-opacity duration-300 md:block"
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
            style={{ opacity: active === i ? 1 : 0, transform: active === i ? "scale(1)" : "scale(1.12)" }}
          />
        ))}
      </div>
    </section>
  );
}
