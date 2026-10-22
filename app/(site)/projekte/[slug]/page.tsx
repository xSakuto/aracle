import { notFound } from "next/navigation";
import Link from "next/link";
import AlpineLines from "@/components/alpine/AlpineLines";
import Portrait from "@/components/Portrait";
import ProjectCard from "@/components/ProjectCard";
import ProductMockup from "@/components/visuals/ProductMockup";
import ProjectPoster from "@/components/visuals/ProjectPoster";
import { getProject, neighbours, projects, type GalleryItem, type ProjectStatus } from "@/data/projects";
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
const statusNote: Partial<Record<ProjectStatus, string>> = {
  "In Entwicklung": "Dieses Projekt ist in Entwicklung. Details und Bilder folgen.",
  Konzept: "Dieses Projekt ist ein Konzept und aktuell kein buchbares Angebot.",
  Pausiert: "Dieses Projekt ist pausiert.",
  Eingestellt: "Dieses Projekt ist abgeschlossen und wird nicht mehr betrieben.",
};

const posterTone: Record<string, "slate" | "glacier" | "glow"> = { highside: "glow", "beer-game": "glacier" };

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
        <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" className="h-full w-full object-cover" />
      </div>
      {item.caption && <figcaption className="small mt-2 text-muted">{item.caption}</figcaption>}
    </figure>
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

  const facts: [string, string][] = [
    ["Status", p.status],
    ["Seit", p.year],
    ["Bereich", p.pillar],
    ["Verantwortlich", p.owner],
  ];

  return (
    <article>
      {/* Kopf */}
      <header className="wrap pt-28 md:pt-36">
        <nav aria-label="Brotkrumen" className="small text-muted" data-rise>
          <Link href="/projekte" className="transition-colors hover:text-ink">Projekte</Link>
          <span aria-hidden className="mx-2">/</span>
          <span>{p.pillar}</span>
        </nav>
        <div className="mt-6 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <h1 className="mega" data-split="load">{p.title}</h1>
            <p className="lead mt-5 text-aqua" data-rise style={{ ["--i" as string]: 2 }}>{p.tagline}</p>
          </div>
          <p className="text-ink/85 md:col-span-4" data-rise style={{ ["--i" as string]: 3 }}>
            {p.shortDescription}
          </p>
        </div>

        {/* Steckbrief im Schweizer Raster */}
        <dl className="mt-12 grid grid-cols-2 border-t border-line md:grid-cols-4" data-rise style={{ ["--i" as string]: 4 }}>
          {facts.map(([k, v]) => (
            <div key={k} className="border-b border-line py-4 pr-4 md:border-b-0 md:border-r md:px-4 md:first:pl-0 md:last:border-r-0">
              <dt className="kicker text-muted">{k}</dt>
              <dd className="mt-1.5 font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* Schlüsselbild */}
      <div className="wrap mt-10">
        <div className="overflow-hidden rounded-[var(--radius)]">
          {p.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.coverImage}
              alt={p.title}
              width={1600}
              height={1067}
              fetchPriority="high"
              data-clip
              className="aspect-[4/5] w-full object-cover sm:aspect-[21/9]"
            />
          ) : (
            <ProjectPoster project={p} tone={posterTone[p.slug] ?? "slate"} size="lg" className="aspect-[4/5] w-full sm:aspect-[21/9]" />
          )}
        </div>
        {statusNote[p.status] && (
          <p className="small mt-3 flex items-center gap-2 text-muted">
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-aqua" />
            {statusNote[p.status]}
          </p>
        )}
      </div>

      {/* Über das Projekt */}
      <section aria-labelledby="about-title" className="wrap grid gap-8 py-[var(--section)] md:grid-cols-12">
        <h2 id="about-title" className="kicker text-aqua md:col-span-3 md:pt-2">Über das Projekt</h2>
        <div className="md:col-span-9">
          <p data-scrub-words className="max-w-[34ch] text-[clamp(1.5rem,1rem+1.6vw,2.5rem)] font-[520] leading-[1.15] tracking-[-0.03em]">
            {p.longDescription}
          </p>

          <div className="mt-14 grid gap-10 border-t border-line pt-10 sm:grid-cols-3">
            <div>
              <h3 className="kicker text-muted">Unser Beitrag</h3>
              <ul className="mt-3 flex flex-col gap-1.5">
                {p.scope.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
            {p.techStack.length > 0 && (
              <div>
                <h3 className="kicker text-muted">Stack</h3>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {p.techStack.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            )}
            {p.links.length > 0 && (
              <div>
                <h3 className="kicker text-muted">Links</h3>
                <ul className="mt-3 flex flex-col gap-1">
                  {p.links.map((l) => (
                    <li key={l.url}>
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="link-under inline-flex min-h-9 items-center">
                        {l.label} <span aria-hidden className="ml-1">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Galerie */}
      {gallery.length > 0 && (
        <section aria-labelledby="gallery-title" className="wrap pb-[var(--section)]">
          <div className="flex items-baseline justify-between border-t border-line pt-6">
            <h2 id="gallery-title" className="kicker text-aqua">Einblicke</h2>
            {gallery.some((g) => g.kind === "placeholder") && (
              <p className="small text-muted">Produktbilder folgen</p>
            )}
          </div>
          <ul className="mt-8 grid gap-4 md:grid-cols-12">
            {gallery.map((g, i) => {
              const wide = i === 0 && g.kind === "photo" && gallery.length > 2;
              return (
                <li key={i} data-reveal style={{ ["--i" as string]: i % 3 }} className={wide ? "md:col-span-12" : gallery.length === 1 ? "md:col-span-8 md:col-start-3" : "md:col-span-6 lg:col-span-3"}>
                  <GalleryTile item={g} wide={wide} />
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Verlauf als kleiner Weg */}
      {p.timeline.length > 0 && (
        <section aria-labelledby="timeline-title" className="wrap pb-[var(--section)]">
          <div className="border-t border-line pt-6">
            <h2 id="timeline-title" className="kicker text-aqua">Verlauf</h2>
          </div>
          <ol className="relative mt-10 grid gap-8 md:grid-flow-col md:auto-cols-fr">
            <span aria-hidden className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px bg-line md:left-0 md:top-[5px] md:h-px md:w-full" />
            {p.timeline.map((t, i) => (
              <li key={i} className="relative pl-8 md:pl-0 md:pt-8" data-reveal style={{ ["--i" as string]: i }}>
                <span aria-hidden className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border border-aqua bg-bg md:top-0" />
                <p className="nums text-[1.75rem] font-[620] leading-none tracking-[-0.04em]">{t.date}</p>
                <p className="mt-2 max-w-[22rem] text-ink/80">{t.label}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Team */}
      {people.length > 0 && (
        <section aria-labelledby="people-title" className="wrap pb-[var(--section)]">
          <div className="border-t border-line pt-6">
            <h2 id="people-title" className="kicker text-aqua">Team</h2>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
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

      {/* Verwandte Projekte */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="wrap pb-[var(--section)]">
          <div className="flex items-baseline justify-between border-t border-line pt-6">
            <h2 id="related-title" className="kicker text-aqua">Mehr aus {p.pillar}</h2>
            <Link href="/projekte" className="link-under small">Alle Projekte</Link>
          </div>
          <ul className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}><ProjectCard project={r} /></li>
            ))}
          </ul>
        </section>
      )}

      {/* Nächstes Projekt */}
      <Link
        href={`/projekte/${next.slug}`}
        data-cursor="Weiter"
        className="group relative block overflow-hidden border-t border-line"
      >
        <div className="wrap flex items-end justify-between gap-6 py-14 md:py-20">
          <div>
            <p className="kicker text-muted">Nächstes Projekt</p>
            <p className="mega mt-4 transition-colors group-hover:text-aqua">{next.title}</p>
          </div>
          <span aria-hidden className="mb-3 text-[2rem] transition-transform duration-500 group-hover:translate-x-2">→</span>
        </div>
        <AlpineLines height={90} layers={2} seed={next.title.length * 3} draw="scroll" className="opacity-50" />
      </Link>
    </article>
  );
}
