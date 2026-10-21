import Link from "next/link";
import SwissCross from "@/components/swiss/SwissCross";

const columns: { title: string; links: [string, string][] }[] = [
  { title: "Studio", links: [["Projekte", "/projekte"], ["Team", "/team"], ["Story", "/history"], ["Kontakt", "/kontakt"]] },
  { title: "Marken", links: [["Highside", "/projekte/highside"], ["Aracle Living", "/living"], ["Aracle Cloud", "/hosting"], ["Swizzly", "/projekte/swizzly"]] },
  { title: "Kanäle", links: [["info@arcl.ch", "mailto:info@arcl.ch"], ["Discord", "https://discord.gg/BgpKdzBYtD"], ["Instagram", "https://www.instagram.com/aracle.ch/"]] },
  { title: "Intern", links: [["Team-Login", "/login"], ["Impressum", "/impressum"], ["Datenschutz", "/datenschutz"]] },
];

export default function Footer() {
  return (
    <footer className="wrap relative overflow-hidden border-t border-line pb-6 pt-16">
      <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
        {columns.map((c) => (
          <div key={c.title}>
            <h2 className="kicker text-aqua">{c.title}</h2>
            <ul className="mt-3">
              {c.links.map(([label, href]) => {
                const ext = href.startsWith("http") || href.startsWith("mailto");
                const cls = "inline-flex min-h-9 items-center font-medium transition-colors hover:text-aqua";
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

      <p aria-hidden className="mt-16 select-none text-[22vw] font-[650] leading-[0.8] tracking-[-0.06em] text-ink">
        Aracle
      </p>

      <div className="small mt-6 flex flex-wrap items-center justify-between gap-4 text-muted">
        <p className="flex items-center gap-2">
          <SwissCross className="h-3.5 w-3.5" />
          © {new Date().getFullYear()} Aracle, CH-8755 Ennenda. Gmacht im Glarnerland.
        </p>
        <a href="#top" className="transition-colors hover:text-ink">Nach oben</a>
      </div>
    </footer>
  );
}
