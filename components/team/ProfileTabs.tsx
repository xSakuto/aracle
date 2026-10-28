"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Reiter auf dem Profil (Übersicht, Projekte, Aktivität). Der aktive Reiter
// steht in der Adresse (#projekte), damit man direkt dorthin verlinken kann.
export default function ProfileTabs({ tabs }: { tabs: { id: string; label: string; count?: number; content: ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const fromHash = () => {
      const h = location.hash.slice(1);
      if (tabs.some((t) => t.id === h)) setActive(h);
    };
    fromHash();
    addEventListener("hashchange", fromHash);
    return () => removeEventListener("hashchange", fromHash);
  }, [tabs]);

  const select = (id: string, focus = false) => {
    setActive(id);
    history.replaceState(null, "", id === tabs[0]?.id ? location.pathname : `#${id}`);
    if (focus) refs.current[id]?.focus();
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = tabs.length;
    const to = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    select(tabs[to].id, true);
  };

  return (
    <>
      <div role="tablist" aria-label="Profil" className="-mx-[var(--margin)] flex gap-6 overflow-x-auto border-b border-line px-[var(--margin)] [scrollbar-width:none]">
        {tabs.map((t, i) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              ref={(el) => { refs.current[t.id] = el; }}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={on}
              aria-controls={`panel-${t.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => select(t.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={`seg-host relative inline-flex min-h-12 shrink-0 items-center gap-2 whitespace-nowrap text-[0.9375rem] transition-colors duration-200 active:opacity-70 ${
                on ? "is-current text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {t.label}
              {typeof t.count === "number" && <span className="nums text-[0.8125rem] text-muted">{t.count}</span>}
              <span aria-hidden className="seg" />
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={t.id !== active}
          tabIndex={0}
          className="pt-10 focus-visible:outline-none md:pt-14"
        >
          {t.content}
        </div>
      ))}
    </>
  );
}
