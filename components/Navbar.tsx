"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/projekte", label: "Projekte" },
  { href: "/hosting", label: "Hosting" },
  { href: "/news", label: "News" },
  { href: "/team", label: "Team" },
  { href: "/history", label: "Journey" },
];

// Desktop: eine Leiste auf dem 12er-Raster, das A in der Mitte, getragen von einer Haarlinie.
// Der aktive Punkt ist ein Segment in Gletscherblau auf dieser Linie, wie die
// Gipfelmarken im Panorama. Mobile: die bewährte Glasleiste mit Vollbild-Menü.
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => !href.includes("#") && pathname.startsWith(href);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-[calc(var(--margin)-0.75rem)] pt-3 md:p-0">
        <div
          data-scrolled={scrolled || undefined}
          className={`nav-glass nav-bar relative flex h-14 items-center justify-between rounded-[14px] px-3 md:grid md:h-16 md:grid-cols-12 md:gap-x-8 md:rounded-none md:px-[var(--margin)] ${open ? "is-open" : ""}`}
        >
          {/* Ticks auf der Haarlinie, im Takt des Hintergrundrasters */}
          <span aria-hidden className="nav-ticks hidden md:block" />

          <nav aria-label="Hauptnavigation" className="hidden h-full items-stretch gap-7 md:col-span-5 md:flex">
            {links.map((l) => {
              const on = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={on ? "page" : undefined}
                  className={`nav-link seg-host relative flex items-center text-[0.8125rem] transition-colors duration-200 ${
                    on ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {l.label}
                  <span aria-hidden className="seg" />
                </Link>
              );
            })}
          </nav>

          {/* Das A in der Mitte, auf Handy und Desktop */}
          <Link
            href="/"
            aria-label="Aracle, zur Startseite"
            className="nav-mark absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center md:static md:col-span-2 md:translate-x-0 md:translate-y-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Brand_assets/logo/aracle-mark-white.png"
              alt="Aracle"
              width={512}
              height={413}
              className="h-7 w-auto bg-transparent md:h-8"
            />
          </Link>

          <div className="hidden items-center justify-end gap-6 md:col-span-5 md:flex">
            <p className="nums hidden text-[0.75rem] text-muted lg:block">
              <span className="text-ink/80">Glarus</span>
              <span className="ml-2">47°02′ N</span>
              <span className="ml-2">9°04′ E</span>
            </p>
            <Link href="/kontakt" className="btn min-h-8 px-3.5 text-[0.8125rem]">
              Projekt anfragen
            </Link>
          </div>

          <span aria-hidden className="w-11 md:hidden" />
          <button
            type="button"
            aria-label={open ? "Menü schliessen" : "Menü öffnen"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 items-center px-2 text-[0.9375rem] transition-opacity active:opacity-60 md:hidden"
          >
            {open ? "Schliessen" : "Menü"}
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`wrap fixed inset-0 z-40 flex flex-col justify-between overscroll-contain bg-bg pb-8 pt-24 transition-[opacity,visibility] duration-300 md:hidden ${
          open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile Navigation" className="flex flex-col gap-2">
          {[{ href: "/", label: "Start" }, ...links].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              tabIndex={open ? 0 : -1}
              className={`text-[2rem] font-semibold leading-tight tracking-[-0.03em] transition-colors active:opacity-60 ${
                (l.href === "/" ? pathname === "/" : isActive(l.href))
                  ? "text-aqua"
                  : "text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/kontakt" tabIndex={open ? 0 : -1} className="btn w-full">
          Projekt anfragen
        </Link>
      </div>
    </>
  );
}
