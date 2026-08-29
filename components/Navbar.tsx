"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/projekte", label: "Projekte" },
  { href: "/living", label: "Living" },
  { href: "/hosting", label: "Hosting" },
  { href: "/team", label: "Team" },
  { href: "/history", label: "Story" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menü bei Seitenwechsel schliessen
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Body-Scroll sperren wenn Menü offen
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 flex h-24 items-center justify-between px-6 transition-all duration-300 md:px-12 ${
          scrolled || open
            ? "border-b border-aqua/10 bg-black/50 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <Link
          href="/"
          className="flex items-center"
          onClick={() => setOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Brand_assets/aracle-logo.png"
            alt="Aracle"
            className="h-11 w-auto md:h-14"
          />
        </Link>

        {/* Desktop-Navigation */}
        <div className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative text-base font-medium tracking-wide transition-colors ${
                isActive(l.href) ? "text-aqua" : "text-muted hover:text-white"
              }`}
            >
              {l.label}
              {isActive(l.href) && (
                <span className="absolute -bottom-2 left-0 h-px w-full bg-aqua" />
              )}
            </Link>
          ))}
          <a
            href="https://discord.gg/BgpKdzBYtD"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-medium text-muted transition-colors hover:text-white"
          >
            Discord
          </a>
        </div>

        {/* Desktop-CTA */}
        <Link
          href="/kontakt"
          className="btn-primary hidden text-base md:inline-flex"
        >
          Projekt einreichen →
        </Link>

        {/* Mobile-Hamburger */}
        <button
          type="button"
          aria-label={open ? "Menü schliessen" : "Menü öffnen"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-12 w-12 items-center justify-center rounded-sm border border-line text-white md:hidden"
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 block h-0.5 w-6 bg-current transition-all duration-300 ${
                open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 block h-0.5 w-6 -translate-y-1/2 bg-current transition-all duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-6 bg-current transition-all duration-300 ${
                open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile-Menü-Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`relative flex h-full flex-col justify-center gap-1 px-8 transition-all duration-300 ${
            open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
          }`}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`border-b border-line py-4 text-3xl font-bold tracking-tight transition-colors ${
                isActive(l.href) ? "text-aqua" : "text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://discord.gg/BgpKdzBYtD"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-line py-4 text-3xl font-bold tracking-tight text-muted"
          >
            Discord
          </a>
          <Link
            href="/kontakt"
            onClick={() => setOpen(false)}
            className="btn-primary mt-8 text-lg"
          >
            Projekt einreichen →
          </Link>
        </div>
      </div>
    </>
  );
}
