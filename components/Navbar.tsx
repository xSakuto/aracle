"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { supabaseConfigured } from "@/lib/supabase/config";

const links = [
  { href: "/projekte", label: "Projekte" },
  { href: "/hosting", label: "Hosting" },
  { href: "/news", label: "News" },
  { href: "/team", label: "Team" },
  { href: "/history", label: "Journey" },
];

// Eine Leiste auf dem Raster, das A in der Mitte, getragen von einer Haarlinie.
// Der aktive Punkt ist ein Segment in Gletscherblau auf dieser Linie, wie die
// Gipfelmarken im Panorama. Auf dem Handy dieselbe Leiste: links der aktuelle
// Bereich, rechts das Menü, das sich als Liste auf denselben Haarlinien öffnet.
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!supabaseConfigured) return;
    const supabase = createBrowserSupabase();
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user)).catch(() => {});
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setLoggedIn(!!session?.user));
    return () => sub.subscription.unsubscribe();
  }, []);

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
  const menu = [{ href: "/", label: "Start" }, ...links, ...(loggedIn ? [{ href: "/dashboard", label: "Dashboard" }] : [])];
  const current = links.find((l) => isActive(l.href))?.label;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          data-scrolled={scrolled || undefined}
          className={`nav-bar relative flex h-14 items-center justify-between px-[var(--margin)] md:grid md:h-16 md:grid-cols-12 md:gap-x-8 ${open ? "is-open" : ""}`}
        >
          {/* Ticks auf der Haarlinie, im Takt des Hintergrundrasters */}
          <span aria-hidden className="nav-ticks" />

          {/* Handy: wo man gerade ist, als Segment auf der Linie wie am Desktop */}
          <p className="seg-host is-current relative flex h-full items-center text-[0.8125rem] text-ink md:hidden">
            {current ?? "Aracle"}
            {current && <span aria-hidden className="seg" style={{ bottom: "-1px" }} />}
          </p>

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
              className="h-6 w-auto bg-transparent md:h-8"
            />
          </Link>

          <div className="hidden items-center justify-end gap-6 md:col-span-5 md:flex">
            <p className="nums hidden text-[0.75rem] text-muted lg:block">
              <span className="text-ink/80">Glarus</span>
              <span className="ml-2">47°02′ N</span>
              <span className="ml-2">9°04′ E</span>
            </p>
            {loggedIn && (
              <Link
                href="/dashboard"
                aria-label="Zum Dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink/80 transition-colors hover:border-aqua hover:text-aqua"
              >
                <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
                  <rect x="3" y="3" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                  <rect x="14" y="3" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                  <rect x="14" y="12" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                  <rect x="3" y="16" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </Link>
            )}
            <Link href="/kontakt" className="btn min-h-8 px-3.5 text-[0.8125rem]">
              Projekt anfragen
            </Link>
          </div>

          <button
            type="button"
            aria-label={open ? "Menü schliessen" : "Menü öffnen"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 flex h-11 items-center gap-2.5 px-2 text-[0.8125rem] text-ink transition-opacity active:opacity-60 md:hidden"
          >
            {open ? "Schliessen" : "Menü"}
            {/* Zwei Linien, die sich zum Kreuz drehen */}
            <span aria-hidden className="relative block h-2.5 w-4">
              <span className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300 ease-[var(--ease-out)] ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-300 ease-[var(--ease-out)] ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex flex-col overscroll-contain bg-bg pt-14 transition-[opacity,visibility] duration-300 md:hidden ${
          open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div aria-hidden className="swiss-grid pointer-events-none absolute inset-0 opacity-50" />
        <nav aria-label="Mobile Navigation" className="wrap relative mt-6">
          <ul className="border-b border-line">
            {menu.map((l, i) => {
              const on = l.href === "/" ? pathname === "/" : isActive(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    tabIndex={open ? 0 : -1}
                    aria-current={on ? "page" : undefined}
                    className={`seg-host menu-item relative flex min-h-14 items-center justify-between border-t border-line text-[1.75rem] font-semibold leading-none tracking-[-0.03em] transition-colors active:opacity-60 ${
                      on ? "text-ink" : "text-ink/70"
                    }`}
                    style={{ ["--i" as string]: i }}
                  >
                    {l.label}
                    {on && <span className="small font-normal tracking-normal text-aqua">Hier</span>}
                    <span aria-hidden className="seg seg-top" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="wrap relative mt-auto pb-8">
          <div className="small flex items-center justify-between border-t border-line pt-4 text-muted">
            <p className="nums">
              <span className="text-ink/80">Glarus</span>
              <span className="ml-2">47°02′ N</span>
              <span className="ml-2">9°04′ E</span>
            </p>
            <Link href="/status" tabIndex={open ? 0 : -1} className="transition-colors hover:text-ink">Status</Link>
          </div>
          <Link href="/kontakt" tabIndex={open ? 0 : -1} className="btn mt-5 w-full">
            Projekt anfragen
          </Link>
        </div>
      </div>
    </>
  );
}
