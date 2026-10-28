import Panorama from "@/components/alpine/Panorama";
import ProjectBrowser from "@/components/project/ProjectBrowser";
import { TOEDI } from "@/data/panorama/toedi";
import { PILLARS, projects } from "@/data/projects";

export const metadata = {
  alternates: { canonical: "/projekte" },
  title: "Projekte",
  description: "Eigene Marken und Projekte aus dem Aracle Studio: Marken & Produkte, Kanäle, Communitys & Server, Cloud & Hosting.",
};

export default function ProjektePage() {
  const used = PILLARS.filter((pl) => projects.some((p) => p.pillar === pl));
  const active = projects.filter((p) => p.status === "Aktiv").length;
  const first = Math.min(...projects.map((p) => Number(p.year)));

  return (
    <>
      {/* Hero: der Tödi, höchster Glarner Gipfel, als Hintergrund */}
      <header className="relative flex min-h-[92svh] flex-col overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <picture>
            <source type="image/webp" srcSet="/images/hero/kloentalersee-1280.webp 1280w, /images/hero/kloentalersee-2560.webp 2560w" sizes="100vw" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero/kloentalersee-1280.jpg"
              srcSet="/images/hero/kloentalersee-1280.jpg 1280w, /images/hero/kloentalersee-2560.jpg 2560w"
              sizes="100vw"
              alt=""
              width={2560}
              height={1440}
              fetchPriority="high"
              data-parallax="0.06"
              className="h-[110%] w-full object-cover object-[55%_45%] opacity-70"
            />
          </picture>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_62%_40%,rgb(143_214_211/0.26),transparent_70%)] mix-blend-screen" />
          <div className="absolute inset-0 bg-[#0b1115]/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-bg/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-bg to-transparent" />
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-bg/80 to-transparent" />
        </div>
        <div aria-hidden className="swiss-grid pointer-events-none absolute inset-0 opacity-60" />
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

      {/* Alle Projekte, gefiltert nach Bereich und Stand. Hervorgehobene Projekte sind breiter. */}
      <div className="wrap pb-[var(--section)]">
        <ProjectBrowser projects={projects} />
      </div>
    </>
  );
}
