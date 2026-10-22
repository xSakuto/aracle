import Link from "next/link";
import AlpineLines from "@/components/alpine/AlpineLines";

const columns: { title: string; links: [string, string][] }[] = [
  { title: "Studio", links: [["Projekte", "/projekte"], ["Leistungen", "/#leistungen"], ["Team", "/team"], ["Journey", "/history"]] },
  { title: "Marken", links: [["Highside", "/projekte/highside"], ["Aracle Cloud", "/hosting"], ["Swizzly", "/projekte/swizzly"], ["Beer Game", "/projekte/beer-game"]] },
  { title: "Kontakt", links: [["Projekt anfragen", "/kontakt"], ["info@arcl.ch", "mailto:info@arcl.ch"], ["Discord", "https://discord.gg/BgpKdzBYtD"], ["Instagram", "https://www.instagram.com/aracle.ch/"]] },
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
          Creative &amp; Technology Studio. Ennenda, Glarus. Made in Switzerland.
        </p>
      </div>

      <AlpineLines height={120} layers={3} seed={7} draw="scroll" className="mt-6 opacity-70" />

      <div className="wrap small flex flex-wrap items-center justify-between gap-4 border-t border-line py-5 text-muted">
        <p>© {new Date().getFullYear()} Aracle, CH-8755 Ennenda</p>
        <a href="#top" className="transition-colors hover:text-ink">Nach oben</a>
      </div>
    </footer>
  );
}
