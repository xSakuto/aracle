import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ProductMockup from "@/components/visuals/ProductMockup";
import ProjectPoster from "@/components/visuals/ProjectPoster";
import { getProject, projects, type GalleryItem, type Project, type ProjectStatus } from "@/data/projects";
import { getTeam } from "@/lib/team";
import YouTubeFeed from "@/components/swizzly/YouTubeFeed";
import SakutoStage from "@/components/sakuto/SakutoStage";
import { SITE_URL } from "@/lib/site";

export const revalidate = 60;

export function generateStaticParams() {
  return projects.filter((p) => !p.landing).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "Projekt" };
  return {
    title: p.title,
    alternates: { canonical: `/projekte/${p.slug}` },
    description: p.shortDescription,
    keywords: [p.title, p.category, p.pillar, "Aracle", "Glarus"],
    openGraph: {
      title: `${p.title} · Aracle`,
      description: p.shortDescription,
      url: `/projekte/${p.slug}`,
      siteName: "Aracle",
      images: p.coverImage ? [{ url: p.coverImage, width: 1600, height: 1067, alt: p.title }] : undefined,
    },
  };
}

// Schema.org-Typ je nach Projektart: Software, Spiel oder einfach ein Werk.
const schemaType: Record<string, string> = {
  milvia: "SoftwareApplication",
  "beer-game": "VideoGame",
  "all-the-clients": "SoftwareApplication",
};

function projectJsonLd(p: Project) {
  const url = `${SITE_URL}/projekte/${p.slug}`;
  const type = schemaType[p.slug] ?? "CreativeWork";
  const entity: Record<string, unknown> = {
    "@type": type,
    "@id": `${url}#entity`,
    name: p.title,
    description: p.shortDescription,
    url,
    ...(p.coverImage ? { image: `${SITE_URL}${p.coverImage}` } : {}),
    dateCreated: p.year,
    creator: { "@id": `${SITE_URL}/#org` },
  };
  if (type === "SoftwareApplication") {
    entity.applicationCategory = p.slug === "milvia" ? "LifestyleApplication" : "GameApplication";
  }
  if (type === "VideoGame") {
    entity.genre = p.category;
  }
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: `${p.title} · Aracle`,
        description: p.shortDescription,
        inLanguage: "de",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: { "@id": `${url}#entity` },
        publisher: { "@id": `${SITE_URL}/#org` },
      },
      entity,
    ],
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

  const primaryLink = p.links.find((l) => !l.url.startsWith("/")) ?? p.links[0];

  return (
    // key: beim Wechsel zwischen Projekten neu aufbauen (zerlegte Titel)
    <article key={p.slug} className="pb-[var(--section)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd(p)) }} />

      {/* Hero: grosses Hintergrundbild, wie bei den eigenen Landing Pages, damit alle "kleinen" Projektseiten gleich aufgebaut sind */}
      <header className="relative flex min-h-[64svh] flex-col overflow-hidden md:min-h-[74svh]">
        <div aria-hidden className="absolute inset-0">
          {p.coverImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.coverImage}
                alt=""
                width={1600}
                height={1067}
                fetchPriority="high"
                data-parallax="0.06"
                className="h-[112%] w-full object-cover"
              />
              <div className="absolute inset-0 bg-[#0b1115]/30 mix-blend-multiply" />
            </>
          ) : (
            <ProjectPoster project={p} tone={posterTone[p.slug] ?? "slate"} size="lg" className="h-full w-full" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-bg)_12%,rgb(11_17_21/0.55)_55%,rgb(11_17_21/0.25))]" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg/70 to-transparent" />
        </div>

        <div className="wrap relative mt-auto pb-10 pt-28 md:pb-14 md:pt-36">
          <nav aria-label="Brotkrumen" className="small text-muted" data-rise>
            <Link href="/projekte" className="transition-colors hover:text-ink">Projekte</Link>
            <span aria-hidden className="mx-2">/</span>
            <span>{p.category}</span>
          </nav>

          {(p.slug === "milvia" || p.slug === "sakuto") && p.markTile ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.markTile} alt="" aria-hidden width={480} height={480} className="mt-6 h-auto w-[min(40vw,14rem)] bg-transparent" />
              <h1 className="sr-only">{p.title}</h1>
            </>
          ) : (
            <h1 className="mega mt-6" data-split="load">{p.title}</h1>
          )}

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between" data-rise style={{ ["--i" as string]: 2 }}>
            <p className="lead max-w-[38ch] text-ink/90">{p.tagline}</p>
            {primaryLink && (
              <a href={primaryLink.url} target="_blank" rel="noopener noreferrer" className="btn self-start md:self-auto">
                {primaryLink.label} <span aria-hidden>↗</span>
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="wrap mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
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

      {p.slug === "milvia" && (
        <section aria-label="Apps und Store" className="wrap mt-[calc(var(--section)*0.5)]">
          <p className="small mb-4 text-muted">Milvia gibt es vorerst als Web-Preview</p>
          <ul className="flex flex-wrap gap-3">
            <li>
              <a href="https://milvia.ch" target="_blank" rel="noopener noreferrer" className="btn">
                Web-Preview öffnen <span aria-hidden>↗</span>
              </a>
            </li>
            <li>
              <span aria-disabled="true" className="btn-quiet inline-flex cursor-not-allowed items-center gap-2 opacity-50">
                App Store
                <span className="small text-muted">bald</span>
              </span>
            </li>
            <li>
              <span aria-disabled="true" className="btn-quiet inline-flex cursor-not-allowed items-center gap-2 opacity-50">
                Google Play
                <span className="small text-muted">bald</span>
              </span>
            </li>
          </ul>
        </section>
      )}

      {p.slug === "sakuto" && <SakutoStage />}

      {p.slug === "sakuto" && (
        <YouTubeFeed channelId="UCoYpRaDlbs40VW_01KMWQ7Q" handle="@xSakuto" />
      )}

      {gallery.length > 0 && (
        <section aria-label="Einblicke" className="wrap mt-[calc(var(--section)*0.7)]">
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
        href="/projekte"
        className="seg-host group wrap relative mt-[var(--section)] flex items-baseline justify-between gap-6 border-t border-line pt-6"
      >
        <span aria-hidden className="seg seg-top" />
        <span aria-hidden className="text-[1.75rem] transition-transform duration-500 group-hover:-translate-x-1.5">←</span>
        <span className="text-right">
          <span className="small block text-muted">Übersicht</span>
          <span className="head mt-2 block transition-colors group-hover:text-aqua">Zurück zu den Projekten</span>
        </span>
      </Link>
    </article>
  );
}
