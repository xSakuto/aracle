"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/projekte", label: "Projekte" },
  { href: "/living", label: "Living" },
  { href: "/hosting", label: "Hosting" },
  { href: "/team", label: "Team" },
  { href: "/history", label: "Story" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Beim Runterscrollen weg, beim Hochscrollen wieder da.
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 160);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      <header
        className={`wrap fixed inset-x-0 top-0 z-50 flex h-[4.5rem] items-center justify-between transition-[background-color,transform] duration-300 ease-[var(--ease-out)] ${
          scrolled || open ? "bg-bg" : "bg-transparent"
        } ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}
      >
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
            className="h-7 w-auto bg-transparent md:h-8"
          />
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`link ${
                isActive(l.href) ? "text-aqua" : "text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/kontakt" className="btn min-h-10 px-4">
            Projekt anfragen
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Menü schliessen" : "Menü öffnen"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 flex h-11 items-center px-2 font-medium transition-opacity active:opacity-60 md:hidden"
        >
          {open ? "Schliessen" : "Menü"}
        </button>
      </header>

      <div
        id="mobile-menu"
        className={`wrap fixed inset-0 z-40 flex flex-col justify-between overscroll-contain bg-bg pb-8 pt-28 transition-[opacity,visibility] duration-300 md:hidden ${
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
              className={`font-display text-[2.5rem] leading-tight transition-colors active:opacity-60 ${
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
