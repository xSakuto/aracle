import Link from "next/link";

const columns: { title: string; links: [string, string][] }[] = [
  {
    title: "Studio",
    links: [
      ["Projekte", "/projekte"],
      ["Team", "/team"],
      ["Story", "/history"],
      ["Kontakt", "/kontakt"],
    ],
  },
  {
    title: "Marken",
    links: [
      ["Highside", "/projekte/highside"],
      ["Aracle Living", "/living"],
      ["Aracle Cloud", "/hosting"],
      ["Swizzly", "/projekte/swizzly"],
    ],
  },
  {
    title: "Kontakt",
    links: [
      ["info@arcl.ch", "mailto:info@arcl.ch"],
      ["Discord", "https://discord.gg/BgpKdzBYtD"],
      ["Instagram", "https://www.instagram.com/aracle.ch/"],
    ],
  },
  {
    title: "Intern",
    links: [
      ["Team-Login", "/login"],
      ["Impressum", "/impressum"],
      ["Datenschutz", "/datenschutz"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="wrap bg-surface pb-8 pt-14 text-[0.8125rem] text-muted">
      <div className="inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Brand_assets/aracle-logo.png"
          alt="Aracle"
          width={1111}
          height={260}
          className="h-6 w-auto bg-transparent"
        />
        <p className="mt-4 max-w-md">
          Creative Studio aus Ennenda, Kanton Glarus. Video, Design, Web und
          Hosting, seit 2017.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
          {columns.map((c) => (
            <div key={c.title}>
              <h2 className="text-[0.8125rem] font-semibold tracking-normal text-ink">
                {c.title}
              </h2>
              <ul className="mt-2">
                {c.links.map(([label, href]) => {
                  const ext = href.startsWith("http") || href.startsWith("mailto");
                  return (
                    <li key={href}>
                      {ext ? (
                        <a
                          href={href}
                          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="inline-flex min-h-8 items-center transition-colors hover:text-ink"
                        >
                          {label}
                        </a>
                      ) : (
                        <Link href={href} className="inline-flex min-h-8 items-center transition-colors hover:text-ink">
                          {label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#2a2a2d] pt-6">
          <p>© {new Date().getFullYear()} Aracle, Ennenda. Gemacht in der Schweiz.</p>
          <a href="#top" className="transition-colors hover:text-ink">Nach oben</a>
        </div>
      </div>
    </footer>
  );
}
