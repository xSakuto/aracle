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
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 flex h-20 items-center justify-between px-6 transition-all duration-300 md:px-12 ${
        scrolled
          ? "border-b border-aqua/10 bg-black/40 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <Link href="/" className="flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Brand_assets/aracle-logo.png" alt="Aracle" className="h-9 w-auto" />
      </Link>

      <div className="hidden items-center gap-8 md:flex">
        {links.map((l) => {
          const active =
            l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`relative text-sm font-medium tracking-wide transition-colors ${
                active ? "text-aqua" : "text-muted hover:text-white"
              }`}
            >
              {l.label}
              {active && (
                <span className="absolute -bottom-2 left-0 h-px w-full bg-aqua" />
              )}
            </Link>
          );
        })}
        <a
          href="https://discord.gg/BgpKdzBYtD"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-muted transition-colors hover:text-white"
        >
          Discord
        </a>
      </div>

      <Link
        href="/kontakt"
        className="rounded-lg bg-aqua px-5 py-2.5 text-sm font-bold text-black transition hover:-translate-y-px hover:opacity-90"
      >
        Projekt einreichen →
      </Link>
    </nav>
  );
}
