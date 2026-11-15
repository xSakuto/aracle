import Link from "next/link";
import Ridge from "@/components/alpine/Ridge";
import SwissFlag from "@/components/swiss/SwissFlag";
import VisitorCounter from "@/components/VisitorCounter";
import { WIGGIS } from "@/data/panorama/wiggis";

const columns: { title: string; links: [string, string][] }[] = [
  { title: "Studio", links: [["Projekte", "/projekte"], ["Team", "/team"], ["Journey", "/history"], ["Brand", "/brand"], ["Mitmachen", "/apply"]] },
  { title: "Marken", links: [["Aracle Cloud", "/hosting"], ["Highside", "/highside"], ["Swizzly", "/swizzly"], ["Beer Game", "/projekte/beer-game"], ["RexusMods", "/rexusmods"], ["AracleSMP", "/smp"], ["Zelda DE", "/zelda-de"]] },
  { title: "Kontakt", links: [["Projekt anfragen", "/kontakt"], ["info@aracle.ch", "mailto:info@aracle.ch"], ["Discord", "https://discord.gg/BgpKdzBYtD"], ["Instagram", "https://www.instagram.com/aracle.ch/"]] },
  { title: "Intern", links: [["Team-Login", "/login"], ["Status", "/status"], ["Impressum", "/impressum"], ["Datenschutz", "/datenschutz"]] },
];

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-line">
      {/* Der Wiggis, wie man ihn aus Glarus sieht: leise im Hintergrund */}
      <div aria-hidden className="footer-ridge pointer-events-none absolute inset-x-0 bottom-0 -z-10 text-ink">
        <Ridge data={WIGGIS} depths={[2, 1]} yMax={300} className="w-full" />
      </div>

      <div className="wrap grid gap-x-8 gap-y-12 pt-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Link href="/" aria-label="Aracle, zur Startseite" className="inline-flex transition-opacity hover:opacity-80 active:opacity-60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Brand_assets/logo/aracle-horizontal-white.png" alt="Aracle" width={1200} height={279} className="h-14 w-auto bg-transparent md:h-[4.25rem]" />
          </Link>
          <p className="small mt-5 max-w-[18rem] text-muted">Creative &amp; Technology Studio aus Glarus.</p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 md:col-span-8">
          {columns.map((c) => (
            <div key={c.title}>
              <h2 className="small font-medium text-muted">{c.title}</h2>
              <ul className="mt-3">
                {c.links.map(([label, href]) => {
                  const ext = href.startsWith("http") || href.startsWith("mailto");
                  const cls = "inline-flex min-h-9 items-center transition-colors hover:text-aqua";
                  return (
                    <li key={href}>
                      {ext ? (
                        <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={cls}>
                          {label}
                        </a>
                      ) : (
                        <Link href={href} className={cls}>{label}</Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap small mt-24 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-6 text-muted md:mt-40">
        <p>© {new Date().getFullYear()} Aracle, CH-8750 Glarus</p>
        <VisitorCounter />
        <p className="inline-flex items-center gap-[0.45em] text-ink/85">
          Made in Switzerland
          <SwissFlag className="h-[1em] w-[1em]" />
        </p>
        <a href="#top" className="transition-colors hover:text-ink">Nach oben</a>
      </div>
    </footer>
  );
}
