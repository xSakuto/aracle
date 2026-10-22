import Link from "next/link";
import Ridge from "@/components/alpine/Ridge";
import { WIGGIS } from "@/data/panorama/wiggis";

const columns: { title: string; links: [string, string][] }[] = [
  { title: "Studio", links: [["Projekte", "/projekte"], ["Leistungen", "/#leistungen"], ["Team", "/team"], ["Journey", "/history"]] },
  { title: "Marken", links: [["Highside", "/projekte/highside"], ["Aracle Cloud", "/hosting"], ["Swizzly", "/projekte/swizzly"], ["Beer Game", "/projekte/beer-game"]] },
  { title: "Kontakt", links: [["Projekt anfragen", "/kontakt"], ["info@aracle.ch", "mailto:info@aracle.ch"], ["Discord", "https://discord.gg/BgpKdzBYtD"], ["Instagram", "https://www.instagram.com/aracle.ch/"]] },
  { title: "Intern", links: [["Team-Login", "/login"], ["Impressum", "/impressum"], ["Datenschutz", "/datenschutz"]] },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line pt-16">
      <div className="wrap grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
        {columns.map((c) => (
          <div key={c.title}>
            <h2 className="kicker text-muted">{c.title}</h2>
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

      <div className="wrap mt-16 flex items-end justify-between gap-6">
        <p aria-hidden className="select-none text-[clamp(4rem,1rem+14vw,16rem)] font-[650] leading-[0.8] tracking-[-0.06em]">
          Aracle
        </p>
        <p className="small mb-3 hidden max-w-[16rem] text-right text-muted md:block">
          Creative &amp; Technology Studio. Glarus. Made in Switzerland.
        </p>
      </div>

      {/* Der Wiggis, wie man ihn aus Glarus sieht, dem Ort des Studios */}
      <div className="relative mt-10 text-ink">
        <Ridge data={WIGGIS} peak="Wiggis" label depths={[2, 1]} yMax={300} className="w-full" />
        <p className="wrap small absolute right-0 top-0 text-muted">Blick von Glarus, Richtung Nordwest</p>
      </div>

      <div className="wrap small flex flex-wrap items-center justify-between gap-4 border-t border-line py-5 text-muted">
        <p>© {new Date().getFullYear()} Aracle, CH-8750 Glarus</p>
        <a href="#top" className="transition-colors hover:text-ink">Nach oben</a>
      </div>
    </footer>
  );
}
