import Link from "next/link";
import Panorama from "@/components/alpine/Panorama";
import PillarMark from "@/components/alpine/PillarMark";
import ProjectPoster from "@/components/visuals/ProjectPoster";
import { TOEDI } from "@/data/panorama/toedi";
import { PILLARS, featuredProjects, projectHref, projects, type Pillar } from "@/data/projects";
import { PILLAR_MOUNTAIN } from "@/lib/mountains";

export const metadata = {
  title: "Projekte · Aracle",
  description: "Eigene Marken und Projekte aus dem Aracle Studio: Creative Production, Digital Experiences, Cloud & Infrastructure.",
};

const pillarText: Record<Pillar, string> = {
  "Creative Production": "Marken, Content und Bildsprache.",
  "Digital Experiences": "Websites, Games und digitale Produkte.",
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
  // Die vier Hauptprojekte stehen oben, alle weiteren darunter nach Bereich.
  const others = projects.filter((p) => !p.featured);
  const otherPillars = PILLARS.filter((pl) => others.some((p) => p.pillar === pl));
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

          <nav aria-label="Abschnitte" className="mt-10 flex flex-wrap gap-2" data-rise style={{ ["--i" as string]: 3 }}>
            {[
              { id: "fokus", label: "Im Fokus", n: featuredProjects.length },
              ...otherPillars.map((pl) => ({ id: anchor(pl), label: pl, n: others.filter((p) => p.pillar === pl).length })),
            ].map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="inline-flex min-h-10 items-center rounded-full border border-line bg-bg/60 px-4 text-[0.875rem] backdrop-blur transition-[border-color,color,transform] duration-200 hover:border-aqua hover:text-aqua focus-visible:border-aqua active:scale-[0.98]"
              >
                {c.label}
                <span className="nums ml-2 text-muted">{c.n}</span>
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

      {/* Im Fokus: die vier Hauptprojekte, gross und mit Bild */}
      <section id="fokus" aria-labelledby="fokus-title" className="wrap relative z-10 scroll-mt-24 pt-[calc(var(--section)*0.6)]">
        <div className="flex items-baseline justify-between gap-6 border-t border-line pt-5">
          <h2 id="fokus-title" className="kicker text-aqua">Im Fokus</h2>
          <p className="small hidden text-muted sm:block">Infrastruktur, Marke, Content und ein eigenes Game</p>
        </div>
        <ul className="mt-8 grid gap-x-6 gap-y-14 md:grid-cols-12">
          {featuredProjects.map((p, i) => {
            const wide = i === 0 || i === 3;
            return (
              <li key={p.slug} data-reveal style={{ ["--i" as string]: i % 2 }} className={wide ? "md:col-span-7" : "md:col-span-5"}>
                <Link href={projectHref(p)} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius)] md:aspect-auto md:h-[min(38rem,62svh)]">
                    {p.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        width={1600}
                        height={1067}
                        loading={i < 2 ? "eager" : "lazy"}
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.03]"
                      />
                    ) : (
                      <ProjectPoster
                        project={p}
                        tone={posterTone[p.slug] ?? "slate"}
                        size="lg"
                        className="h-full w-full transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.02]"
                      />
                    )}
                  </div>
                  <div className="mt-5 grid gap-x-6 gap-y-2 border-t border-line pt-4 sm:grid-cols-[1fr_auto]">
                    <h3 className="text-[clamp(1.75rem,1rem+1.6vw,2.5rem)] font-[640] leading-[1] tracking-[-0.035em] transition-colors group-hover:text-aqua">
                      {p.title}
                    </h3>
                    <p className="small nums text-muted sm:pt-2 sm:text-right">
                      {p.pillar}, seit {p.year}
                      {p.status !== "Aktiv" && <span className="text-glow">, {p.status}</span>}
                    </p>
                    <p className="max-w-[40ch] text-ink/75 sm:col-span-2">{p.tagline}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Weitere Projekte: nach Bereich, als ruhiges Register */}
      <div className="wrap pb-[var(--section)] pt-[var(--section)]">
        <h2 className="head">More work.</h2>
        <p className="mt-4 max-w-[40ch] text-muted">
          Communities, Kanäle und Experimente. Vieles davon ist der Grund, warum es Aracle heute gibt.
        </p>
        {otherPillars.map((pl) => {
          const group = others.filter((p) => p.pillar === pl);
          const mt = PILLAR_MOUNTAIN[pl];
          return (
            <section
              key={pl}
              id={anchor(pl)}
              aria-labelledby={`${anchor(pl)}-title`}
              className="mt-14 grid scroll-mt-24 gap-x-8 gap-y-8 border-t border-line pt-8 md:grid-cols-12"
            >
              <div className="md:col-span-3">
                <div className="md:sticky md:top-24">
                  <h3 id={`${anchor(pl)}-title`} className="text-[1.375rem] font-[640] leading-[1.05] tracking-[-0.025em]">{pl}</h3>
                  <p className="small mt-2 text-muted">{pillarText[pl]}</p>
                  <PillarMark mountain={mt} className="mt-6 hidden max-w-[16rem] text-ink opacity-80 md:block" />
                </div>
              </div>
              <ul className="border-b border-line md:col-span-9">
                {group.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={projectHref(p)}
                      className="seg-host group relative grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-t border-line py-5 sm:grid-cols-9"
                    >
                      <span aria-hidden className="seg seg-top" />
                      <span className="text-[1.1875rem] font-semibold tracking-[-0.02em] transition-colors group-hover:text-aqua sm:col-span-3">{p.title}</span>
                      <span className="small nums text-muted sm:order-last sm:col-span-1 sm:text-right">{p.year}</span>
                      <span className="col-span-2 text-ink/70 sm:col-span-4">{p.shortDescription}</span>
                      <span className={`small col-span-2 sm:col-span-1 ${p.status === "Aktiv" ? "text-muted" : "text-glow"}`}>{p.status}</span>
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
