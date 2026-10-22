import Link from "next/link";
import Panorama from "@/components/alpine/Panorama";
import PillarMark from "@/components/alpine/PillarMark";
import ProjectCard from "@/components/ProjectCard";
import { TOEDI } from "@/data/panorama/toedi";
import { PILLARS, featuredProjects, projects, type Pillar } from "@/data/projects";
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

const anchor = (p: string) => p.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-");

export default function ProjektePage() {
  const used = PILLARS.filter((pl) => projects.some((p) => p.pillar === pl));
  const lead = featuredProjects[0];
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
                className="inline-flex min-h-10 items-center rounded-full border border-line bg-bg/60 px-4 text-[0.875rem] backdrop-blur transition-colors hover:border-aqua hover:text-aqua focus-visible:border-aqua active:scale-[0.98]"
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

      {/* Fliessender Übergang: das Leitprojekt schiebt sich über den Hero */}
      {lead && (
        <section aria-label="Im Fokus" className="relative z-10 -mt-px">
          <div className="wrap">
            <Link
              href={`/projekte/${lead.slug}`}
              className="group relative grid overflow-hidden rounded-[calc(var(--radius)*2)] border border-line bg-surface md:grid-cols-12"
            >
              <div className="relative aspect-[16/10] overflow-hidden md:col-span-7 md:aspect-auto md:min-h-[26rem]">
                {lead.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={lead.coverImage}
                    alt={lead.title}
                    width={1600}
                    height={1067}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.04]"
                  />
                )}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-surface/60" />
              </div>
              <div className="flex flex-col justify-between gap-10 p-7 md:col-span-5 md:p-10">
                <div>
                  <p className="kicker text-aqua">Im Fokus · {lead.pillar}</p>
                  <h2 className="display mt-4 transition-colors group-hover:text-aqua">{lead.title}</h2>
                  <p className="lead mt-4 text-ink/85">{lead.tagline}</p>
                </div>
                <div>
                  <p className="text-ink/80">{lead.goal}</p>
                  <span className="link-under mt-6 inline-flex min-h-11 items-center font-medium">
                    Zum Projekt <span aria-hidden className="ml-2 transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Bereiche: jeder mit seinem Gipfel */}
      <div className="wrap pb-[var(--section)] pt-[calc(var(--section)*0.8)]">
        {used.map((pl) => {
          const group = projects.filter((p) => p.pillar === pl);
          const mt = PILLAR_MOUNTAIN[pl];
          return (
            <section
              key={pl}
              id={anchor(pl)}
              aria-labelledby={`${anchor(pl)}-title`}
              className="grid scroll-mt-24 gap-10 border-t border-line pt-10 md:grid-cols-12 [&:not(:first-child)]:mt-[calc(var(--section)*0.7)]"
            >
              <div className="md:col-span-3">
                <div className="md:sticky md:top-24">
                  <h2 id={`${anchor(pl)}-title`} className="text-[clamp(1.625rem,1rem+1.4vw,2.25rem)] font-[640] leading-[1.02] tracking-[-0.03em] [overflow-wrap:anywhere]">{pl}</h2>
                  <p className="mt-3 text-muted">{pillarText[pl]}</p>
                  <PillarMark mountain={mt} className="mt-8 max-w-[22rem] text-ink" />
                </div>
              </div>
              <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 md:col-span-9 lg:grid-cols-3">
                {group.map((p, i) => (
                  <li key={p.slug} data-reveal style={{ ["--i" as string]: i % 3 }}>
                    <ProjectCard project={p} />
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
