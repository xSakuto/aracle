import { notFound } from "next/navigation";
import Link from "next/link";
import PillarMark from "@/components/alpine/PillarMark";
import Portrait from "@/components/Portrait";
import ProjectCard from "@/components/ProjectCard";
import ProjectHero from "@/components/project/ProjectHero";
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
  const cls = `overflow-hidden rounded-[var(--radius)] ${wide ? "aspect-[16/10]" : item.kind === "placeholder" ? "aspect-square" : "aspect-[4/5]"}`;
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

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const team = await getTeam();
  const people = team.flatMap((m) =>
    m.projects.filter((x) => x.slug === slug).map((x) => ({ ...m, projectRole: x.role || m.role })),
  );
  const { next } = neighbours(slug);
  const related = projects.filter((x) => x.pillar === p.pillar && x.slug !== p.slug && x.slug !== next.slug).slice(0, 3);
  const gallery = (p.gallery ?? []).filter((g, i) => !(i === 0 && g.kind === "photo" && g.src === p.coverImage));

  const nextMt = PILLAR_MOUNTAIN[next.pillar];
  const specs: { label: string; body: React.ReactNode }[] = [
    { label: "Unser Beitrag", body: <ul className="flex flex-col gap-1">{p.scope.map((s) => <li key={s}>{s}</li>)}</ul> },
    ...(p.techStack.length ? [{ label: "Stack", body: <ul className="flex flex-col gap-1">{p.techStack.map((s) => <li key={s}>{s}</li>)}</ul> }] : []),
    ...(p.links.length
      ? [{
          label: "Links",
          body: (
            <ul className="flex flex-col gap-1">
              {p.links.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="link-under">
                    {l.label} <span aria-hidden>↗</span>
                  </a>
                </li>
              ))}
            </ul>
          ),
        }]
      : []),
    { label: "Stand", body: statusNote[p.status] },
  ];

  return (
    // key: beim Wechsel zwischen Projekten neu aufbauen (zerlegte Titel, Animationen)
    <article key={p.slug}>
      <ProjectHero p={p} />

      {/* Inhalt als Blatt, das sich über den Kopf schiebt */}
      <div className="relative z-10 -mt-8 rounded-t-[1.75rem] border-t border-line bg-bg shadow-[0_-24px_60px_-30px_rgb(143_214_211/0.18)]">
        <div className="wrap flex flex-col gap-[var(--section)] pb-[var(--section)] pt-16 md:pt-24">
          {/* Überblick: Ziel gross, Beschreibung daneben, Eckdaten als eine Zeile */}
          <section aria-labelledby="ueberblick-title">
            <h2 id="ueberblick-title" className="sr-only">Überblick</h2>
            <div className="grid gap-x-8 gap-y-10 md:grid-cols-12">
              <p data-scrub-words className="max-w-[24ch] text-[clamp(1.75rem,1rem+2.2vw,3.25rem)] font-[560] leading-[1.08] tracking-[-0.035em] md:col-span-8">
                {p.goal}
              </p>
              <p className="max-w-[44ch] text-ink/80 md:col-span-4 md:pt-2">{p.longDescription}</p>
            </div>
            <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-line pt-6 md:grid-cols-12">
              {specs.map((sp) => (
                <div key={sp.label} className="md:col-span-3">
                  <dt className="small text-muted">{sp.label}</dt>
                  <dd className="mt-2 text-[0.9375rem] leading-relaxed">{sp.body}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Einblicke: Bilder bekommen Platz, ohne Rahmen */}
          {gallery.length > 0 && (
            <section aria-labelledby="einblicke-title">
              <div className="flex items-baseline justify-between gap-4 border-t border-line pt-5">
                <h2 id="einblicke-title" className="small text-muted">Einblicke</h2>
                {gallery.some((g) => g.kind === "placeholder") && (
                  <p className="small text-muted">Platzhalter, Produktbilder folgen</p>
                )}
              </div>
              <ul className={`mt-6 grid gap-4 md:gap-6 ${gallery.every((g) => g.kind === "placeholder") ? "grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2"}`}>
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

          {/* Was dazugehört: Liniensatz statt Kästen */}
          <section aria-labelledby="inhalt-title" className="grid gap-x-8 gap-y-6 md:grid-cols-12">
            <h2 id="inhalt-title" className="small border-t border-line pt-5 text-muted md:col-span-3">Was dazugehört</h2>
            <ul className="border-b border-line md:col-span-9">
              {p.includes.map((it) => (
                <li key={it.title} className="grid gap-x-8 gap-y-1 border-t border-line py-5 sm:grid-cols-9">
                  <h3 className="font-medium tracking-[-0.015em] sm:col-span-3">{it.title}</h3>
                  <p className="text-ink/70 sm:col-span-6">{it.text}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Verlauf und Team in einem Abschnitt */}
          <section aria-labelledby="verlauf-title" className="grid gap-x-8 gap-y-10 md:grid-cols-12">
            <h2 id="verlauf-title" className="small border-t border-line pt-5 text-muted md:col-span-3">Verlauf</h2>
            <ol className={`border-b border-line ${people.length ? "md:col-span-5" : "md:col-span-9"}`}>
              {p.timeline.map((t, i) => (
                <li key={i} className="grid grid-cols-[4.5rem_1fr] gap-x-4 border-t border-line py-4">
                  <span className="nums font-[620] tracking-[-0.02em] text-aqua">{t.date}</span>
                  <span className="text-ink/85">{t.label}</span>
                </li>
              ))}
            </ol>
            {people.length > 0 && (
              <div className="md:col-span-4">
                <h3 className="small border-t border-line pt-5 text-muted md:border-t-0 md:pt-0">Team</h3>
                <ul className="mt-3 border-b border-line">
                  {people.map((m) => (
                    <li key={m.id}>
                      <Link href={`/team#${m.slug}`} className="seg-host group relative flex items-center gap-4 border-t border-line py-3">
                        <span aria-hidden className="seg seg-top" />
                        <span className="w-10 shrink-0 overflow-hidden rounded-[4px]">
                          <Portrait name={m.name} photo={m.photo} accent={m.accent} sizes="40px" />
                        </span>
                        <span className="min-w-0 flex-1 font-medium transition-colors group-hover:text-aqua">{m.name}</span>
                        <span className="small shrink-0 text-muted">{m.projectRole}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
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
