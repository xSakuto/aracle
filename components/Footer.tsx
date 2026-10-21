import Link from "next/link";

const columns: { title: string; links: [string, string][] }[] = [
  { title: "Studio", links: [["Projekte", "/projekte"], ["Team", "/team"], ["Story", "/history"], ["Kontakt", "/kontakt"]] },
  { title: "Marken", links: [["Highside", "/projekte/highside"], ["Aracle Living", "/living"], ["Aracle Cloud", "/hosting"], ["Swizzly", "/projekte/swizzly"]] },
  { title: "Kanäle", links: [["info@arcl.ch", "mailto:info@arcl.ch"], ["Discord", "https://discord.gg/BgpKdzBYtD"], ["Instagram", "https://www.instagram.com/aracle.ch/"]] },
  { title: "Intern", links: [["Team-Login", "/login"], ["Impressum", "/impressum"], ["Datenschutz", "/datenschutz"]] },
];

export default function Footer() {
  return (
    <footer data-shape="wave" className="wrap relative overflow-hidden pb-6 pt-[var(--section)]">
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

      <p aria-hidden className="mt-16 select-none text-center text-[21.5vw] font-black uppercase leading-[0.8] tracking-[-0.03em] [font-stretch:125%]">
        Aracle
      </p>

      <div className="small mt-6 flex flex-wrap items-center justify-between gap-4 text-muted">
        <p>© {new Date().getFullYear()} Aracle, Ennenda. Gemacht in der Schweiz.</p>
        <a href="#top" className="transition-colors hover:text-ink">Nach oben</a>
      </div>
    </footer>
  );
}
