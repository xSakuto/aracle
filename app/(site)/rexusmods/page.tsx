import Link from "next/link";
import Hud from "@/components/visuals/Hud";
import { getProject } from "@/data/projects";

export const metadata = {
  title: "RexusMods · Mods für GTA V und Flugsimulatoren",
  description: "RexusMods: Gebäude, Lackierungen und Fahrzeuge für GTA V und FiveM, neu auch Add-ons für Flugsimulatoren. Von Joel Nef und Tim Mockweiss.",
};

const IMG = "/images/rexusmods";

type Work = {
  title: string;
  kind: string;
  text: string;
  images: { src: string; alt: string; w: number; h: number }[];
  specs?: [string, string][];
  links?: { label: string; url: string }[];
};

const works: Work[] = [
  {
    title: "Jagd- und Forstschutz",
    kind: "Gebäude · FiveM",
    text: "Ein eigenes Gebäude für FiveM-Server: Aussenbereich mit Carport, Empfang und Wartebereich, alles mit eigenen Skins.",
    images: [
      { src: `${IMG}/forstschutz-aussen.webp`, alt: "Gebäude Jagd- und Forstschutz von aussen, mit Carport und Schild", w: 1600, h: 754 },
      { src: `${IMG}/forstschutz-empfang.webp`, alt: "Empfang mit Holztheke und Logo Jagd- und Forstschutz", w: 1600, h: 723 },
      { src: `${IMG}/forstschutz-wartebereich.webp`, alt: "Wartebereich mit Sofas, Wasserspender und Bildern an der Wand", w: 1600, h: 756 },
    ],
    specs: [
      ["Version", "V1.0"],
      ["Optimiert für", "FiveM"],
      ["3D-Modell", "OB Interiors"],
      ["Skins", "xMGamerPlex, RexusMods"],
    ],
    links: [{ label: "Download", url: "https://mega.nz/file/LgRHEY7R#NQ3rC5HZKYUMFxLLlgWEqDtxQFl9QHREstekf1r6zyE" }],
  },
  {
    title: "Rettungsdienst Glarus",
    kind: "Lackierung · Fahrzeug",
    text: "Mercedes Sprinter als Rettungswagen im Design des Kantonsspitals Glarus, mit 144 und Glarner Kennzeichen.",
    images: [
      { src: `${IMG}/ambulanz-glarus-front.webp`, alt: "Rettungswagen in Weiss, Rot und Blau mit Aufschrift 144, von vorne", w: 1155, h: 726 },
      { src: `${IMG}/ambulanz-glarus-seite.webp`, alt: "Rettungswagen Kantonsspital Glarus von der Seite", w: 1096, h: 546 },
    ],
  },
  {
    title: "Weazel News",
    kind: "Lackierung · Flotte",
    text: "Audi RS6 als Flotte für den Sender Weazel News, in Weiss und Rot.",
    images: [
      { src: `${IMG}/weazel-news-flotte.webp`, alt: "Drei weisse Audi RS6 von Weazel News nebeneinander", w: 1390, h: 483 },
      { src: `${IMG}/weazel-news-seite.webp`, alt: "Audi RS6 Weazel News Geschäftsführung von der Seite", w: 1282, h: 645 },
    ],
  },
];

// RexusMods als eigene Landing Page: Rot, Cockpit-HUD als Bühne, darunter die Arbeiten.
export default function RexusModsPage() {
  const p = getProject("rexusmods");
  return (
    <div className="theme-rexus">
      <header className="relative flex min-h-[86svh] flex-col overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 text-aqua">
          <Hud className="absolute left-1/2 top-[46%] w-[max(100%,64rem)] -translate-x-1/2 -translate-y-1/2 opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_22%_70%,rgb(11_17_21/0.95),transparent_75%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent" />
        </div>

        <div className="wrap relative mt-auto pb-16 pt-32 md:pb-20">
          <p className="kicker text-aqua" data-rise>RexusMods · Wieder aktiv</p>
          <h1 className="mega mt-5 max-w-[11ch]" data-split="load">Mods for GTA V. Now taking flight.</h1>
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between" data-rise style={{ ["--i" as string]: 2 }}>
            <p className="lead max-w-[36ch] text-ink/85">
              Gebäude, Lackierungen und Fahrzeuge für GTA V und FiveM. Neu kommen Add-ons für Flugsimulatoren dazu.
            </p>
            <a href="#arbeiten" className="btn self-start md:self-auto">Arbeiten ansehen</a>
          </div>
        </div>
      </header>

      <section id="arbeiten" aria-label="Arbeiten" className="wrap scroll-mt-20 pb-[var(--section)]">
        {works.map((w, wi) => (
          <article key={w.title} className={`border-t border-line pt-8 ${wi ? "mt-[calc(var(--section)*0.7)]" : ""}`}>
            <div className="grid gap-x-8 gap-y-4 md:grid-cols-12">
              <div className="md:col-span-5">
                <p className="small text-aqua">{w.kind}</p>
                <h2 className="head mt-2">{w.title}</h2>
              </div>
              <div className="md:col-span-6 md:col-start-7">
                <p className="text-ink/80">{w.text}</p>
                {w.specs && (
                  <dl className="mt-5 grid grid-cols-2 gap-x-6 border-b border-line text-[0.9375rem]">
                    {w.specs.map(([k, v]) => (
                      <div key={k} className="border-t border-line py-2.5">
                        <dt className="small text-muted">{k}</dt>
                        <dd className="mt-0.5">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {w.links && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {w.links.map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="btn">
                        {l.label} <span aria-hidden>↗</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <ul className={`mt-8 grid gap-3 md:gap-4 ${w.images.length === 3 ? "md:grid-cols-2" : "sm:grid-cols-2"}`}>
              {w.images.map((im, i) => (
                <li key={im.src} className={w.images.length === 3 && i === 0 ? "md:col-span-2" : ""}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={im.src}
                    alt={im.alt}
                    width={im.w}
                    height={im.h}
                    loading="lazy"
                    className={`w-full rounded-[var(--radius)] object-cover ${w.images.length === 3 && i === 0 ? "aspect-[21/9]" : "aspect-[16/10]"}`}
                  />
                </li>
              ))}
            </ul>
          </article>
        ))}

        <div className="mt-[calc(var(--section)*0.7)] grid gap-x-8 gap-y-8 border-t border-line pt-8 md:grid-cols-2">
          <div>
            <p className="small text-aqua">Auch auf GTA5-Mods</p>
            <h2 className="head mt-2">Sprinter Schweizer Post</h2>
            <a
              href="https://www.gta5-mods.com/de/vehicles/mercedes-benz-sprinter-schweizer-post-rexusmods"
              target="_blank"
              rel="noopener noreferrer"
              className="link-under mt-4 inline-flex min-h-11 items-center font-medium"
            >
              Auf gta5-mods.com ansehen <span aria-hidden className="ml-1">↗</span>
            </a>
          </div>
          <div>
            <p className="small text-aqua">Neu, in Arbeit</p>
            <h2 className="head mt-2">Flight Simulator</h2>
            <p className="mt-4 max-w-[40ch] text-ink/75">Add-ons für Flugsimulatoren. Details folgen, sobald es etwas zu zeigen gibt.</p>
          </div>
        </div>
      </section>

      <section aria-label="Team und Kontakt" className="border-t border-line">
        <div className="wrap flex flex-col gap-8 py-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="small text-muted">Gemacht von</p>
            <ul className="mt-2 flex flex-wrap gap-x-6 text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] font-[620] tracking-[-0.02em]">
              {p?.team.map((m) => (
                <li key={m.slug}>
                  <Link href={`/team#${m.slug}`} className="transition-colors hover:text-aqua">{m.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <a href="mailto:info@aracle.ch?subject=RexusMods" className="btn-quiet self-start md:self-auto">Schreib uns</a>
        </div>
      </section>
    </div>
  );
}
