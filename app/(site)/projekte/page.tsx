import Link from "next/link";
import Panorama from "@/components/alpine/Panorama";
import ProjectPoster from "@/components/visuals/ProjectPoster";
import { TOEDI } from "@/data/panorama/toedi";
import { PILLARS, projectHref, projects, type Pillar } from "@/data/projects";

export const metadata = {
  alternates: { canonical: "/projekte" },
  title: "Projekte",
  description: "Eigene Marken und Projekte aus dem Aracle Studio: Creative Production, Digital Experiences, Cloud & Infrastructure.",
};

const pillarText: Record<Pillar, string> = {
  "Creative Production": "Marken, Content und Bildsprache.",
  "Digital Experiences": "Websites, Apps, Games und digitale Produkte.",
  "Cloud & Infrastructure": "Hosting und Server auf eigener Hardware.",
  "Community & Gaming": "Communities und Server, mit denen alles begann.",
};

const posterTone: Record<string, "slate" | "glacier" | "glow"> = {
  highside: "glow",
  "beer-game": "glacier",
};

const anchor = (p: string) => p.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-");

export default function ProjektePage() {
  const used = PILLARS.filter((pl) => projects.some((p) => p.pillar === pl));
  const active = projects.filter((p) => p.status === "Aktiv").length;
  const first = Math.min(...projects.map((p) => Number(p.year)));

  return (
    <>
      {/* Hero: der Tödi, höchster Glarner Gipfel, als Hintergrund */}
      <header className="relative flex min-h-[92svh] flex-col overflow-hidden">
        <div aria-hidden className="swiss-grid pointer-events-none absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[58%] h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(143_214_211/0.10),transparent)]"
        />

        <div className="wrap relative z-10 pt-28 md:pt-36">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="kicker text-aqua" data-rise>Portfolio</p>
              <h1 className="mega mt-5" data-split="load">Selected work.</h1>
            </div>
            <div className="md:col-span-4" data-rise style={{ ["--i" as string]: 2 }}>
              <p className="text-ink/85">
                Eigene Marken und Projekte seit {first}. Was läuft, was entsteht
                und was wir unterwegs gelernt haben.
              </p>
              <dl className="mt-6 grid grid-cols-3 border-t border-line pt-4">
                {[
                  [String(projects.length), "Projekte"],
                  [String(active), "aktiv"],
                  [String(used.length), "Bereiche"],
                ].map(([v, k]) => (
                  <div key={k}>
                    <dd className="nums text-[1.75rem] font-[620] leading-none tracking-[-0.04em]">{v}</dd>
                    <dt className="small mt-1 text-muted">{k}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <nav aria-label="Bereiche" className="mt-10 flex flex-wrap gap-2" data-rise style={{ ["--i" as string]: 3 }}>
            {used.map((pl) => (
              <a
                key={pl}
                href={`#${anchor(pl)}`}
                className="inline-flex min-h-10 items-center rounded-full border border-line bg-bg/60 px-4 text-[0.875rem] backdrop-blur transition-[border-color,color,transform] duration-200 hover:border-aqua hover:text-aqua focus-visible:border-aqua active:scale-[0.98]"
              >
                {pl}
                <span className="nums ml-2 text-muted">{projects.filter((p) => p.pillar === pl).length}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="relative mt-auto pt-16">
          <Panorama
            data={TOEDI}
            labels={[
              { peak: "Tödi", sub: "Piz Russein", row: 0 },
              { peak: "Bifertenstock", row: 1, minor: true },
              { peak: "Clariden", row: 1, minor: true },
            ]}
            mobileView={{ x0: 420, x1: 1180 }}
            yMax={430}
            scale
          />
          <p className="wrap small mt-10 pb-4 text-muted">Tödi vom Schilt aus, 30 km entfernt</p>
        </div>
      </header>

      {/* Alle Projekte, ein einziges Raster pro Bereich. Hervorgehobene Projekte sind breiter, mehr nicht. */}
      <div className="wrap pb-[var(--section)]">
        {used.map((pl, pi) => {
          const group = projects.filter((p) => p.pillar === pl);
          return (
            <section
              key={pl}
              id={anchor(pl)}
              aria-labelledby={`${anchor(pl)}-title`}
              className={`scroll-mt-24 border-t border-line pt-8 ${pi === 0 ? "mt-[calc(var(--section)*0.6)]" : "mt-16"}`}
            >
              <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
                <div>
                  <h2 id={`${anchor(pl)}-title`} className="kicker text-aqua">{pl}</h2>
                  <p className="head mt-1">{pillarText[pl]}</p>
                </div>
                <p className="small text-muted">{group.length} {group.length === 1 ? "Projekt" : "Projekte"}</p>
              </div>

              <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
                {group.map((p, i) => (
                  <li key={p.slug} className={p.featured ? "col-span-2" : ""} data-reveal style={{ ["--i" as string]: i % 4 }}>
                    <Link href={projectHref(p)} className="group block">
                      <div className={`relative overflow-hidden rounded-[var(--radius)] ${p.featured ? "aspect-[16/10]" : "aspect-square"}`}>
                        {p.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.coverImage}
                            alt={p.title}
                            width={1600}
                            height={1067}
                            loading={pi === 0 && i < 2 ? "eager" : "lazy"}
                            className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
                          />
                        ) : (
                          <ProjectPoster
                            project={p}
                            tone={posterTone[p.slug] ?? "slate"}
                            size={p.featured ? "lg" : "md"}
                            className="h-full w-full transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
                          />
                        )}
                      </div>
                      <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-line pt-3">
                        <h3 className={`font-semibold tracking-[-0.015em] transition-colors group-hover:text-aqua ${p.featured ? "text-[1.1875rem]" : ""}`}>
                          {p.title}
                        </h3>
                        <span className={`small nums shrink-0 ${p.status === "Aktiv" ? "text-muted" : "text-glow"}`}>
                          {p.status === "Aktiv" ? p.year : p.status}
                        </span>
                      </div>
                      {p.featured && <p className="mt-1 max-w-[42ch] text-ink/70">{p.tagline}</p>}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
