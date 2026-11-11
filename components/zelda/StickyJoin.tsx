"use client";

import { useEffect, useState } from "react";

// Handy: sobald der grosse Button oben nicht sichtbar ist, steht unten eine
// Leiste mit "Beitreten". Am Ende der Seite, wo der zweite grosse Button steht,
// verschwindet sie wieder, damit nichts doppelt ist.
export default function StickyJoin({ href, online }: { href: string; online?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const top = document.getElementById("join-top");
    const bottom = document.getElementById("join-bottom");
    if (!top) return;
    const seen = { top: true, bottom: false };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        // Auch zeigen, wenn der Button noch unter dem Rand liegt (kleine Handys)
        if (e.target === top) seen.top = e.isIntersecting;
        if (e.target === bottom) seen.bottom = e.isIntersecting;
      }
      setShow(!seen.top && !seen.bottom);
    });
    io.observe(top);
    if (bottom) io.observe(bottom);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-[transform,opacity] duration-300 ease-[var(--ease-out)] md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
      aria-hidden={!show}
    >
      <div className="flex items-center gap-3 rounded-[14px] border border-aqua/25 bg-[#0a1d21]/90 p-2 pl-2.5 shadow-[0_-8px_32px_rgb(0_0_0/0.45)] backdrop-blur-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/zelda/zelda-de-icon.webp" alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-[10px]" />
        <p className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-[0.9375rem] font-semibold">Zelda Community DE</span>
          {online && (
            <span className="flex items-center gap-1.5 text-[0.8125rem] text-ink/70">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#3ddc84]" />
              {online}
            </span>
          )}
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={show ? 0 : -1}
          className="zelda-join inline-flex h-11 shrink-0 items-center rounded-[10px] px-5 text-[1rem] font-semibold"
        >
          Beitreten
        </a>
      </div>
    </div>
  );
}
