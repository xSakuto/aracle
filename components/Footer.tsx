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
    title: "Intern",
    links: [
      ["Team-Login", "/login"],
      ["Impressum", "/impressum"],
      ["Datenschutz", "/datenschutz"],
    ],
  },
];

const places: [string, string][] = [
  ["info@arcl.ch", "mailto:info@arcl.ch"],
  ["Discord", "https://discord.gg/BgpKdzBYtD"],
  ["Instagram", "https://www.instagram.com/aracle.ch/"],
];

export default function Footer() {
  return (
    <footer className="wrap overflow-hidden bg-field pb-8 pt-16 md:pt-24">
      <p
        aria-hidden
        className="font-display select-none text-[21.5vw] font-medium uppercase leading-[0.78] tracking-[-0.04em] text-ink"
      >
        Aracle
      </p>

      <div className="mt-16 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-5">
          <h2 className="sr-only">Kontakt</h2>
          <ul className="flex flex-col gap-2">
            {places.map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  {...(href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="lead link text-aqua"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-sm text-muted">
            Creative Studio aus Ennenda, Kanton Glarus. Seit 2017.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7">
          {columns.map((c) => (
            <div key={c.title}>
              <h3 className="small font-sans font-medium tracking-normal text-muted">
                {c.title}
              </h3>
              <ul className="mt-3 flex flex-col gap-2">
                {c.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="link">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="small mt-20 flex flex-wrap items-center justify-between gap-4 text-muted md:mt-24">
        <p>
          © {new Date().getFullYear()} Aracle, Ennenda. Gemacht in der Schweiz.
        </p>
        <a href="#top" className="link">
          Nach oben
        </a>
      </div>
    </footer>
  );
}
