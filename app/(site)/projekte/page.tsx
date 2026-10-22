import ProjectCard from "@/components/ProjectCard";
import AlpineLines from "@/components/alpine/AlpineLines";
import { PILLARS, projects, type Pillar } from "@/data/projects";

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
  return (
    <>
      <header className="wrap pt-28 md:pt-36">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="kicker text-aqua" data-rise>Portfolio</p>
            <h1 className="mega mt-5" data-split="load">Selected work.</h1>
          </div>
          <p className="text-ink/80 md:col-span-4" data-rise style={{ ["--i" as string]: 2 }}>
            {projects.length} eigene Marken und Projekte seit 2017. Was läuft,
            was entsteht und was wir unterwegs gelernt haben.
          </p>
        </div>

        {/* Sprungmarken zu den Bereichen */}
        <nav aria-label="Bereiche" className="mt-10 flex flex-wrap gap-2" data-rise style={{ ["--i" as string]: 3 }}>
          {used.map((pl) => (
            <a
              key={pl}
              href={`#${anchor(pl)}`}
              className="inline-flex min-h-9 items-center rounded-full border border-line px-4 text-[0.875rem] transition-colors hover:border-aqua hover:text-aqua"
            >
              {pl}
              <span className="nums ml-2 text-muted">{projects.filter((p) => p.pillar === pl).length}</span>
            </a>
          ))}
        </nav>
      </header>

      <AlpineLines height={140} layers={3} seed={29} className="mt-8 opacity-60" />

      <div className="wrap pb-[var(--section)]">
        {used.map((pl, gi) => {
          const group = projects.filter((p) => p.pillar === pl);
          return (
            <section key={pl} id={anchor(pl)} aria-labelledby={`${anchor(pl)}-title`} className="scroll-mt-20 border-t border-line pt-10 [&:not(:first-child)]:mt-[calc(var(--section)*0.7)]">
              <div className="grid gap-4 md:grid-cols-12 md:items-baseline">
                <h2 id={`${anchor(pl)}-title`} className="head md:col-span-7">{pl}</h2>
                <p className="text-muted md:col-span-4 md:col-start-9">{pillarText[pl]}</p>
              </div>
              <ul className={`mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 ${gi === 0 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
                {group.map((p, i) => (
                  <li key={p.slug} data-reveal style={{ ["--i" as string]: i % 4 }}>
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
