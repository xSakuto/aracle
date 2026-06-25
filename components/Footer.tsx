import Link from "next/link";

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
        {title}
      </h4>
      <ul className="flex flex-col gap-3">
        {links.map(([label, href]) => (
          <li key={href + label}>
            <Link
              href={href}
              className="text-sm text-muted transition-colors hover:text-white"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-line px-6 pb-14 pt-20 md:px-12">
      <div className="mx-auto grid max-w-[1320px] gap-12 md:grid-cols-[2.2fr_1fr_1fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Brand_assets/aracle-logo.png"
            alt="Aracle"
            className="mb-6 h-9 w-auto"
          />
          <p className="max-w-[28rem] text-sm leading-relaxed text-muted">
            Creative Studio für Video, Design, Web und Hosting. Eigene Marken,
            echte Projekte, aus einer Hand.
          </p>
        </div>
        <FooterCol
          title="Studio"
          links={[
            ["Projekte", "/projekte"],
            ["Team", "/team"],
            ["Story", "/history"],
            ["Kontakt", "/kontakt"],
          ]}
        />
        <FooterCol
          title="Marken"
          links={[
            ["Highside", "/projekte/highside"],
            ["Swizzly", "/projekte/swizzly"],
            ["Aracle Living", "/projekte/aracle-living"],
            ["Aracle Cloud", "/projekte/aracle-cloud-hosting"],
          ]}
        />
      </div>
      <div className="mx-auto mt-16 flex max-w-[1320px] flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
        <p className="flex items-center gap-2 text-xs text-muted">
          <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-[2px] bg-[#d52b1e]">
            <svg viewBox="0 0 32 32" className="h-2 w-2" fill="white">
              <path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" />
            </svg>
          </span>
          Made in Switzerland · © {new Date().getFullYear()} Aracle
        </p>
        <div className="flex gap-5 text-xs text-muted">
          <Link href="/datenschutz" className="hover:text-white">
            Datenschutz
          </Link>
          <Link href="/impressum" className="hover:text-white">
            Impressum
          </Link>
        </div>
      </div>
    </footer>
  );
}
