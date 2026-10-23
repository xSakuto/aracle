import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ProductMockup from "@/components/visuals/ProductMockup";
import ProjectPoster from "@/components/visuals/ProjectPoster";
import { getProject, neighbours, projectHref, projects, type GalleryItem, type ProjectStatus } from "@/data/projects";
import { getTeam } from "@/lib/team";

export const revalidate = 60;

export function generateStaticParams() {
  return projects.filter((p) => !p.landing).map((p) => ({ slug: p.slug }));
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
  "In Entwicklung": "Details und Bilder folgen.",
  Konzept: "Aktuell kein buchbares Angebot.",
  Pausiert: "Kann wieder aufgenommen werden.",
  Eingestellt: "Nicht mehr in Betrieb.",
};

const posterTone: Record<string, "slate" | "glacier" | "glow"> = { highside: "glow", "beer-game": "glacier" };

function GalleryTile({ item }: { item: GalleryItem }) {
  if (item.kind === "placeholder") {
    return <ProductMockup motif={item.motif} caption={item.caption} className="aspect-square h-full w-full overflow-hidden rounded-[var(--radius)]" />;
  }
  return (
    <figure>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" className="aspect-[16/10] w-full rounded-[var(--radius)] object-cover" />
      {item.caption && <figcaption className="small mt-2 text-muted">{item.caption}</figcaption>}
    </figure>
  );
}

// Projektseite: Titel, ein Bild, ein Absatz, die Eckdaten. Mehr braucht es nicht.
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  if (p.landing) redirect(p.landing);

  const team = await getTeam();
  const people = team.flatMap((m) => m.projects.filter((x) => x.slug === slug).map(() => m));
  const { next } = neighbours(slug);
  const gallery = (p.gallery ?? []).filter((g) => !(g.kind === "photo" && g.src === p.coverImage));

  const facts: [string, React.ReactNode][] = [
    [
      "Status",
      <>
        <span className={p.status === "Aktiv" ? "" : "text-glow"}>{p.status}</span>
        {statusNote[p.status] && <span className="block text-muted">{statusNote[p.status]}</span>}
      </>,
    ],
    ["Seit", p.year],
    ["Bereich", p.pillar],
    [
      "Team",
      people.length ? (
        <ul>
          {people.map((m) => (
            <li key={m.id}>
              <Link href={`/team#${m.slug}`} className="link">{m.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        p.owner
      ),
    ],
    ...(p.links.length
      ? ([
          [
            "Links",
            <ul key="l">
              {p.links.map((l) => (
                <li key={l.url}>
                  {l.url.startsWith("/") ? (
                    <Link href={l.url} className="link-under">{l.label}</Link>
                  ) : (
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="link-under">
                      {l.label} <span aria-hidden>↗</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>,
          ],
        ] as [string, React.ReactNode][])
      : []),
  ];

  return (
    // key: beim Wechsel zwischen Projekten neu aufbauen (zerlegte Titel)
    <article key={p.slug} className="wrap pb-[var(--section)] pt-28 md:pt-36">
      <nav aria-label="Brotkrumen" className="small text-muted" data-rise>
        <Link href="/projekte" className="transition-colors hover:text-ink">Projekte</Link>
        <span aria-hidden className="mx-2">/</span>
        <span>{p.category}</span>
      </nav>

      <header className="mt-6 grid gap-6 md:grid-cols-12 md:items-end">
        <h1 className="mega md:col-span-8" data-split="load">{p.title}</h1>
        <p className="lead text-ink/85 md:col-span-4" data-rise style={{ ["--i" as string]: 2 }}>{p.tagline}</p>
      </header>

      <div className="mt-10 overflow-hidden rounded-[var(--radius)] md:mt-14">
        {p.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.coverImage}
            alt={p.title}
            width={1600}
            height={1067}
            fetchPriority="high"
            data-clip
            className="aspect-[4/3] w-full object-cover sm:aspect-[21/9]"
          />
        ) : (
          <ProjectPoster project={p} tone={posterTone[p.slug] ?? "slate"} size="lg" className="aspect-[4/3] w-full sm:aspect-[21/9]" />
        )}
      </div>

      <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
        <p className="lead max-w-[38ch] text-ink/90 md:col-span-7">{p.longDescription}</p>
        <dl className="border-b border-line md:col-span-4 md:col-start-9">
          {facts.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[6rem_1fr] gap-4 border-t border-line py-3 text-[0.9375rem]">
              <dt className="text-muted">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {gallery.length > 0 && (
        <section aria-label="Einblicke" className="mt-[calc(var(--section)*0.7)]">
          {gallery.every((g) => g.kind === "placeholder") && (
            <p className="small mb-4 text-muted">Platzhalter, Produktbilder folgen</p>
          )}
          <ul className={`grid gap-4 md:gap-6 ${gallery.every((g) => g.kind === "placeholder") ? "grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2"}`}>
            {gallery.map((g, i) => (
              <li key={i} data-reveal style={{ ["--i" as string]: i % 2 }}>
                <GalleryTile item={g} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link
        href={projectHref(next)}
        className="seg-host group relative mt-[var(--section)] flex items-baseline justify-between gap-6 border-t border-line pt-6"
      >
        <span aria-hidden className="seg seg-top" />
        <span>
          <span className="small block text-muted">Nächstes Projekt</span>
          <span className="head mt-2 block transition-colors group-hover:text-aqua">{next.title}</span>
        </span>
        <span aria-hidden className="text-[1.75rem] transition-transform duration-500 group-hover:translate-x-1.5">→</span>
      </Link>
    </article>
  );
}
