import { notFound } from "next/navigation";
import Link from "next/link";
import PillarMark from "@/components/alpine/PillarMark";
import Portrait from "@/components/Portrait";
import ProjectCard from "@/components/ProjectCard";
import ProjectHero from "@/components/project/ProjectHero";
import SectionIndex from "@/components/project/SectionIndex";
import ProductMockup from "@/components/visuals/ProductMockup";
import { getProject, neighbours, projects, type GalleryItem, type ProjectStatus } from "@/data/projects";
import { PILLAR_MOUNTAIN } from "@/lib/mountains";
import { getTeam } from "@/lib/team";

export const revalidate = 60;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "Projekt · Aracle" };
  return {
    title: `${p.title} · Aracle`,
    description: p.shortDescription,
    openGraph: { title: `${p.title} · Aracle`, description: p.shortDescription, images: p.coverImage ? [p.coverImage] : undefined },
  };
}

// Ehrliche Einordnung für alles, was nicht "Aktiv" ist
const statusNote: Record<ProjectStatus, string> = {
  Aktiv: "Läuft und wird aktiv weiterentwickelt.",
  "In Entwicklung": "In Entwicklung. Details und Bilder folgen.",
  Konzept: "Ein Konzept, aktuell kein buchbares Angebot.",
  Pausiert: "Pausiert, kann wieder aufgenommen werden.",
  Eingestellt: "Abgeschlossen und nicht mehr in Betrieb.",
};

function GalleryTile({ item, wide }: { item: GalleryItem; wide: boolean }) {
  const cls = `overflow-hidden rounded-[var(--radius)] ${wide ? "aspect-[16/10]" : "aspect-[4/5]"}`;
  if (item.kind === "placeholder") {
    // PLATZHALTER: wird durch echtes Foto ersetzt, sobald vorhanden
    return <ProductMockup motif={item.motif} caption={item.caption} className={`h-full w-full ${cls}`} />;
  }
  return (
    <figure>
      <div className={cls}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" data-clip className="h-full w-full object-cover" />
      </div>
      {item.caption && <figcaption className="small mt-2 text-muted">{item.caption}</figcaption>}
    </figure>
  );
}

/** Abschnittskopf: Nummer, Titel, feine Linie */
function Head({ n, id, title }: { n: number; id: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 border-t border-line pt-5">
      <span className="nums text-[0.8125rem] text-aqua">{String(n).padStart(2, "0")}</span>
      <h2 id={`${id}-title`} className="kicker text-ink/90">{title}</h2>
    </div>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const team = await getTeam();
  const people = team.flatMap((m) =>
    m.projects.filter((x) => x.slug === slug).map((x) => ({ ...m, projectRole: x.role || m.role })),
  );
  const { next } = neighbours(slug);
  const related = projects.filter((x) => x.pillar === p.pillar && x.slug !== p.slug).slice(0, 3);
  const gallery = (p.gallery ?? []).filter((g, i) => !(i === 0 && g.kind === "photo" && g.src === p.coverImage));

  const sections = [
    { id: "ziel", label: "Ziel" },
    { id: "inhalt", label: "Was dazugehört" },
    { id: "umsetzung", label: "Umsetzung" },
    ...(gallery.length ? [{ id: "einblicke", label: "Einblicke" }] : []),
    { id: "stand", label: "Stand und Verlauf" },
    ...(people.length ? [{ id: "team", label: "Team" }] : []),
  ];
  const num = (id: string) => sections.findIndex((s) => s.id === id) + 1;
  const nextMt = PILLAR_MOUNTAIN[next.pillar];

  return (
    <article>
      <ProjectHero p={p} />

      {/* Inhalt als Blatt, das sich über den Kopf schiebt */}
      <div className="relative z-10 -mt-8 rounded-t-[1.75rem] border-t border-line bg-bg shadow-[0_-24px_60px_-30px_rgb(143_214_211/0.18)]">
        <div className="wrap grid gap-10 pb-[var(--section)] pt-16 md:grid-cols-12 md:pt-24">
          <aside className="md:col-span-3">
            <div className="flex flex-col gap-8 md:sticky md:top-24">
              <SectionIndex items={sections} />
              <div className="hidden rounded-[var(--radius)] border border-line p-4 md:block">
                <p className="kicker text-muted">Status</p>
                <p className="mt-1 font-medium">{p.status}</p>
                <p className="small mt-2 text-muted">{statusNote[p.status]}</p>
              </div>
            </div>
          </aside>

          <div className="flex flex-col gap-[calc(var(--section)*0.7)] md:col-span-9">
            {/* 01 Ziel */}
            <section id="ziel" aria-labelledby="ziel-title" className="scroll-mt-24">
              <Head n={num("ziel")} id="ziel" title="Ziel" />
              <p data-scrub-words className="mt-8 max-w-[30ch] text-[clamp(1.75rem,1rem+2.2vw,3.25rem)] font-[560] leading-[1.08] tracking-[-0.035em]">
                {p.goal}
              </p>
            </section>

            {/* 02 Was dazugehört */}
            <section id="inhalt" aria-labelledby="inhalt-title" className="scroll-mt-24">
              <Head n={num("inhalt")} id="inhalt" title="Was dazugehört" />
              <ul className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-2">
                {p.includes.map((it, i) => (
                  <li key={it.title} data-reveal style={{ ["--i" as string]: i % 2 }} className="group bg-bg p-6 transition-colors hover:bg-surface md:p-8">
                    <span className="nums text-[0.75rem] text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-6 text-[clamp(1.25rem,1rem+0.8vw,1.625rem)] font-[620] tracking-[-0.025em] transition-colors group-hover:text-aqua">
                      {it.title}
                    </h3>
                    <p className="mt-2 text-ink/75">{it.text}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* 03 Umsetzung */}
            <section id="umsetzung" aria-labelledby="umsetzung-title" className="scroll-mt-24">
              <Head n={num("umsetzung")} id="umsetzung" title="Umsetzung" />
              <p className="lead mt-8 max-w-[44rem] text-ink/90">{p.longDescription}</p>
              <dl className="mt-10 grid gap-x-8 gap-y-8 border-t border-line pt-8 sm:grid-cols-3">
                <div>
                  <dt className="kicker text-muted">Unser Beitrag</dt>
                  <dd className="mt-3">
                    <ul className="flex flex-col gap-1.5">{p.scope.map((s) => <li key={s}>{s}</li>)}</ul>
                  </dd>
                </div>
                {p.techStack.length > 0 && (
                  <div>
                    <dt className="kicker text-muted">Stack</dt>
                    <dd className="mt-3 flex flex-wrap gap-2">
                      {p.techStack.map((s) => (
                        <span key={s} className="rounded-full border border-line px-3 py-1 text-[0.875rem]">{s}</span>
                      ))}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="kicker text-muted">{p.links.length ? "Links" : "Verantwortlich"}</dt>
                  <dd className="mt-3">
                    {p.links.length ? (
                      <ul className="flex flex-col gap-1">
                        {p.links.map((l) => (
                          <li key={l.url}>
                            <a href={l.url} target="_blank" rel="noopener noreferrer" className="link-under inline-flex min-h-9 items-center">
                              {l.label} <span aria-hidden className="ml-1">↗</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      p.owner
                    )}
                  </dd>
                </div>
              </dl>
            </section>

            {/* 04 Einblicke */}
            {gallery.length > 0 && (
              <section id="einblicke" aria-labelledby="einblicke-title" className="scroll-mt-24">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex-1"><Head n={num("einblicke")} id="einblicke" title="Einblicke" /></div>
                </div>
                {gallery.some((g) => g.kind === "placeholder") && (
                  <p className="small mt-3 text-muted">Platzhalter: Produktbilder folgen.</p>
                )}
                <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                  {gallery.map((g, i) => {
                    const wide = i === 0 && g.kind === "photo" && gallery.length > 2;
                    return (
                      <li key={i} data-reveal style={{ ["--i" as string]: i % 2 }} className={wide || gallery.length === 1 ? "sm:col-span-2" : ""}>
                        <GalleryTile item={g} wide={wide || gallery.length === 1} />
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {/* 05 Stand und Verlauf */}
            <section id="stand" aria-labelledby="stand-title" className="scroll-mt-24">
              <Head n={num("stand")} id="stand" title="Stand und Verlauf" />
              <div className="mt-8 grid gap-10 md:grid-cols-9">
                <div className="md:col-span-3">
                  <p className="text-[clamp(1.5rem,1rem+1vw,2rem)] font-[620] tracking-[-0.03em]">{p.status}</p>
                  <p className="mt-2 text-ink/75">{statusNote[p.status]}</p>
                </div>
                <ol className="relative md:col-span-6">
                  <span aria-hidden className="absolute bottom-2 left-[5px] top-2 w-px bg-line" />
                  {p.timeline.map((t, i) => (
                    <li key={i} className="relative pb-7 pl-9 last:pb-0" data-reveal style={{ ["--i" as string]: i }}>
                      <span aria-hidden className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border border-aqua bg-bg" />
                      <p className="nums text-[1.5rem] font-[620] leading-none tracking-[-0.04em]">{t.date}</p>
                      <p className="mt-2 text-ink/80">{t.label}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* 06 Team */}
            {people.length > 0 && (
              <section id="team" aria-labelledby="team-title" className="scroll-mt-24">
                <Head n={num("team")} id="team" title="Team" />
                <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {people.map((m) => (
                    <li key={m.id}>
                      <Link href={`/team#${m.slug}`} className="group block">
                        <div className="overflow-hidden rounded-[var(--radius)]">
                          <Portrait name={m.name} photo={m.photo} accent={m.accent} className="transition-transform duration-700 group-hover:scale-[1.03]" />
                        </div>
                        <p className="mt-3 font-semibold transition-colors group-hover:text-aqua">{m.name}</p>
                        <p className="small text-muted">{m.projectRole}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        {/* Mehr aus dem Bereich */}
        {related.length > 0 && (
          <section aria-labelledby="related-title" className="wrap pb-[var(--section)]">
            <div className="flex items-baseline justify-between border-t border-line pt-6">
              <h2 id="related-title" className="kicker text-aqua">Mehr aus {p.pillar}</h2>
              <Link href="/projekte" className="link-under small">Alle Projekte</Link>
            </div>
            <ul className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug} data-reveal><ProjectCard project={r} /></li>
              ))}
            </ul>
          </section>
        )}

        {/* Nächstes Projekt: grosse Fläche mit Bild oder Gipfel */}
        <Link
          href={`/projekte/${next.slug}`}
          data-cursor="Weiter"
          className="group relative block min-h-[60svh] overflow-hidden border-t border-line focus-visible:outline-offset-[-4px]"
        >
          <div aria-hidden className="absolute inset-0">
            {next.coverImage ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={next.coverImage}
                  alt=""
                  width={1600}
                  height={1067}
                  loading="lazy"
                  className="h-full w-full scale-[1.06] object-cover opacity-40 transition-[transform,opacity] duration-[1400ms] ease-[var(--ease-out)] group-hover:scale-100 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20" />
              </>
            ) : (
              <div className="absolute inset-x-0 bottom-0 text-ink opacity-50 transition-opacity duration-700 group-hover:opacity-80">
                <PillarMark mountain={nextMt} ratio={4} caption={false} />
              </div>
            )}
          </div>
          <div className="wrap relative flex min-h-[60svh] flex-col justify-between py-14 md:py-20">
            <p className="kicker text-muted">Nächstes Projekt · {next.pillar}</p>
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="mega transition-colors duration-500 group-hover:text-aqua">{next.title}</p>
                <p className="lead mt-4 max-w-[36rem] text-ink/80">{next.tagline}</p>
              </div>
              <span aria-hidden className="mb-3 text-[2rem] transition-transform duration-500 group-hover:translate-x-2">→</span>
            </div>
          </div>
        </Link>
      </div>
    </article>
  );
}
