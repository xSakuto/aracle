"use client";

import { useEffect, useRef, useState } from "react";

export type Service = {
  name: string;
  scope: string;
  desc: string;
  src: string;
  alt: string;
};

// Was wir machen: links ein Bild, rechts die Liste. Die aktive Zeile
// tauscht das Bild und klappt ihre Beschreibung auf.
export default function ServiceList({ items }: { items: Service[] }) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  // Beim Scrollen wird die Zeile in der Bildmitte aktiv.
  useEffect(() => {
    const rows = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>("[data-row]") ?? [],
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.row));
        }
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="services-title" className="wrap py-[var(--section)]">
      <div className="grid grid-cols-12 gap-x-8">
        <div className="sticky top-[4.5rem] z-10 col-span-12 -mx-[var(--margin)] bg-bg md:top-[12vh] md:col-span-5 md:mx-0 md:self-start md:bg-transparent">
          <div className="relative aspect-[4/3] overflow-hidden md:aspect-[4/5]">
            {items.map((s, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={s.name}
                src={s.src}
                alt={i === active ? s.alt : ""}
                aria-hidden={i !== active}
                width={1200}
                height={1500}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
                style={{ opacity: i === active ? 1 : 0 }}
              />
            ))}
          </div>
        </div>

        <div className="col-span-12 mt-10 md:col-span-6 md:col-start-7 md:mt-0">
          <h2 id="services-title" className="head mb-12" data-reveal>
            Was wir machen
          </h2>
          <ol ref={listRef} className="flex flex-col">
            {items.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.name} data-row={i} data-reveal style={{ ["--i" as string]: i + 1 }}>
                  <button
                    type="button"
                    aria-expanded={on}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group flex min-h-[4.5rem] w-full items-center justify-between gap-6 text-left transition-transform active:scale-[0.99]"
                  >
                    <span
                      className={`lead font-display transition-colors duration-200 ${
                        on ? "text-aqua" : "text-ink group-hover:text-aqua"
                      }`}
                    >
                      {s.name}
                    </span>
                    <span className="small text-muted">{s.scope}</span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out)]"
                    style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
                  >
                    <p className="max-w-[38ch] overflow-hidden">
                      <span className="block pb-5">{s.desc}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
