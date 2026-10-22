"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/projekte", label: "Projekte" },
  { href: "/#leistungen", label: "Leistungen" },
  { href: "/hosting", label: "Hosting" },
  { href: "/team", label: "Team" },
  { href: "/history", label: "Journey" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => !href.includes("#") && pathname.startsWith(href);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-[calc(var(--margin)-0.75rem)] pt-3">
        <div className={`nav-glass relative flex h-14 items-center justify-between rounded-[14px] px-3 ${open ? "is-open" : ""}`}>
        <Link
          href="/"
          aria-label="Aracle, zur Startseite"
          className="flex items-center transition-opacity hover:opacity-80 active:opacity-60"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Brand_assets/aracle-logo.png"
            alt="Aracle"
            width={1111}
            height={260}
            className="h-6 w-auto bg-transparent"
          />
        </Link>

        <nav aria-label="Hauptnavigation" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`text-[0.8125rem] transition-colors ${
                isActive(l.href) ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/kontakt" className="btn hidden min-h-8 px-3.5 text-[0.8125rem] md:inline-flex">
          Projekt anfragen
        </Link>

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
