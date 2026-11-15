import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ProjectPoster from "@/components/visuals/ProjectPoster";
import { projectHref, projects as staticProjects, type Project, type ProjectStatus } from "@/data/projects";
import { getProjects, getProjectUpdates } from "@/lib/projects";
import { formatStat, getExternalUpdates, getProjectStats } from "@/lib/stats";
import Changelog from "@/components/project/Changelog";
import { MemberChip } from "@/components/MemberLink";
import Gallery from "@/components/project/Gallery";
import SectionIndex from "@/components/project/SectionIndex";
import ProjectTile from "@/components/project/ProjectTile";
import { getTeam } from "@/lib/team";
import YouTubeFeed from "@/components/swizzly/YouTubeFeed";
import SakutoStage from "@/components/sakuto/SakutoStage";
import { SITE_URL } from "@/lib/site";

export const revalidate = 60;

export function generateStaticParams() {
  return staticProjects.filter((p) => !p.landing).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = (await getProjects()).find((x) => x.slug === slug);
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

function ExtLink({ url, label, className = "link-under" }: { url: string; label: string; className?: string }) {
  return url.startsWith("/") ? (
    <Link href={url} className={className}>{label}</Link>
  ) : (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
      {label} <span aria-hidden>↗</span>
    </a>
  );
}

// Projektseite. Aufbau wie die eigenen Landing Pages: grosses Bild, dann
// Abschnitte mit Titel und Inhalt. Links ein Inhaltsverzeichnis mit den
// Eckdaten, das beim Lesen mitläuft. Abschnitte ohne Daten fallen weg.
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = await getProjects();
  const p = all.find((x) => x.slug === slug);
  if (!p) notFound();
  if (p.landing) redirect(p.landing);

  const [team, ownUpdates, externalUpdates, stats] = await Promise.all([
    getTeam(),
    getProjectUpdates(slug),
    getExternalUpdates(slug),
    getProjectStats(slug),
  ]);
  const updates = [...ownUpdates, ...externalUpdates].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const people = team.flatMap((m) => m.projects.filter((x) => x.slug === slug).map(() => m));
  const gallery = (p.gallery ?? []).filter((g) => !(g.kind === "photo" && g.src === p.coverImage));
  const primaryLink = p.links.find((l) => !l.url.startsWith("/")) ?? p.links[0];

  const sections = [
    { id: "ueberblick", label: "Überblick", show: true },
    { id: "bausteine", label: "Was dazugehört", show: p.includes.length > 0 },
    { id: "einblicke", label: "Einblicke", show: gallery.length > 0 },
    { id: "changelog", label: "Changelog", show: updates.length > 0 },
    { id: "verlauf", label: "Verlauf", show: p.timeline.length + (p.next?.length ?? 0) > 1 },
    { id: "fragen", label: "Fragen", show: (p.faq?.length ?? 0) > 0 },
  ].filter((s) => s.show);

  const related = (p.related ?? []).map((s) => all.find((x) => x.slug === s)).filter(Boolean) as Project[];
  const idx = all.findIndex((x) => x.slug === p.slug);
  const prev = all[(idx - 1 + all.length) % all.length];
  const next = all[(idx + 1) % all.length];

  const facts: [string, React.ReactNode][] = [
    [
      "Status",
      <>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${p.status === "Aktiv" ? "bg-aqua" : p.status === "Eingestellt" ? "bg-muted" : "bg-glow"}`} />
          <span className={p.status === "Aktiv" ? "" : "text-glow"}>{p.status}</span>
        </span>
        {statusNote[p.status] && <span className="block text-muted">{statusNote[p.status]}</span>}
      </>,
    ],
    ["Seit", <span key="y" className="nums">{p.year}</span>],
    ["Bereich", <Link key="b" href="/projekte" className="link">{p.pillar}</Link>],
    [
      "Team",
      people.length ? (
        <ul className="-my-1">
          {people.map((m) => (
            <li key={m.id}>
              <MemberChip
                slug={m.slug}
                name={m.name}
                photo={m.photo}
                accent={m.accent}
                sub={m.projects.find((x) => x.slug === slug)?.role || m.role}
              />
            </li>
          ))}
        </ul>
      ) : (
        p.owner
      ),
    ],
    ...(p.techStack.length ? ([["Technik", p.techStack.join(", ")]] as [string, React.ReactNode][]) : []),
    ...(p.links.length
      ? ([
          [
            "Links",
            <ul key="l">
              {p.links.map((l) => (
                <li key={l.url}><ExtLink url={l.url} label={l.label} /></li>
              ))}
            </ul>,
          ],
        ] as [string, React.ReactNode][])
      : []),
  ];

  return (
    // key: beim Wechsel zwischen Projekten neu aufbauen (zerlegte Titel)
    <article key={p.slug} className="pb-[var(--section)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd(p)) }} />

      {/* Hero: grosses Hintergrundbild, wie bei den eigenen Landing Pages */}
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
                style={p.coverPosition ? { objectPosition: p.coverPosition } : undefined}
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

          <div className="mt-8 flex flex-col gap-6 border-t border-ink/15 pt-6 md:flex-row md:items-end md:justify-between" data-rise style={{ ["--i" as string]: 2 }}>
            <p className="lead max-w-[38ch] text-ink/90">{p.tagline}</p>
            {primaryLink && <ExtLink url={primaryLink.url} label={primaryLink.label} className="btn self-start md:self-auto" />}
          </div>
        </div>
      </header>

      <div className="wrap mt-12 grid gap-x-10 gap-y-12 md:mt-16 lg:grid-cols-12">
        {/* Eckdaten und Inhaltsverzeichnis, laufen auf grossen Bildschirmen mit */}
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            {sections.length > 2 && (
              <div className="mb-10 hidden lg:block">
                <SectionIndex items={sections.map(({ id, label }) => ({ id, label }))} />
              </div>
            )}
            <dl className="border-b border-line">
              {facts.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-4 border-t border-line py-3 text-[0.9375rem]">
                  <dt className="text-muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>

        <div className="min-w-0 lg:col-span-8 lg:col-start-5">
          <section id="ueberblick" aria-labelledby="ueberblick-title" className="scroll-mt-28">
            <h2 id="ueberblick-title" className="head">Worum geht es?</h2>
            <p className="lead mt-6 max-w-[46ch] text-ink/90">{p.longDescription}</p>
            <div className="mt-10 grid gap-8 border-t border-line pt-6 sm:grid-cols-2">
              <div>
                <h3 className="small text-muted">Ziel</h3>
                <p className="mt-2 max-w-[42ch] text-ink/80">{p.goal}</p>
              </div>
              {p.scope.length > 0 && (
                <div>
                  <h3 className="small text-muted">Was Aracle beiträgt</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {p.scope.map((s) => (
                      <li key={s} className="rounded-full border border-line px-3 py-1 text-[0.875rem] text-ink/85">{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {stats.length > 0 && (
              <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dd className="nums text-[clamp(1.75rem,1.2rem+1.4vw,2.5rem)] font-[620] leading-none tracking-[-0.04em]">{formatStat(s.value)}</dd>
                    <dt className="small mt-2 text-muted">
                      {s.label}
                      {s.url ? (
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="link ml-1">auf {s.source}</a>
                      ) : (
                        <span className="ml-1">auf {s.source}</span>
                      )}
                    </dt>
                  </div>
                ))}
              </dl>
            )}

            {p.slug === "milvia" && (
              <ul className="mt-10 flex flex-wrap gap-3" aria-label="Apps und Store">
                <li>
                  <a href="https://milvia.ch" target="_blank" rel="noopener noreferrer" className="btn">
                    Web-Preview öffnen <span aria-hidden>↗</span>
                  </a>
                </li>
                {["App Store", "Google Play"].map((s) => (
                  <li key={s}>
                    <span aria-disabled="true" className="btn-quiet inline-flex cursor-not-allowed items-center gap-2 opacity-50">
                      {s} <span className="small text-muted">bald</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {p.includes.length > 0 && (
            <section id="bausteine" aria-labelledby="bausteine-title" className="mt-[var(--section)] scroll-mt-28">
              <h2 id="bausteine-title" className="head">Was dazugehört.</h2>
              <ul className="mt-8 border-b border-line">
                {p.includes.map((it) => (
                  <li key={it.title} className="grid gap-1 border-t border-line py-5 sm:grid-cols-[13rem_1fr] sm:gap-6">
                    <h3 className="font-semibold tracking-[-0.015em]">{it.title}</h3>
                    <p className="max-w-[52ch] text-ink/75">{it.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {gallery.length > 0 && (
            <section id="einblicke" aria-labelledby="einblicke-title" className="mt-[var(--section)] scroll-mt-28">
              <h2 id="einblicke-title" className="head mb-8">Einblicke.</h2>
              <Gallery items={gallery} />
            </section>
          )}

          {updates.length > 0 && (
            <section id="changelog" aria-labelledby="changelog-title" className="mt-[var(--section)] scroll-mt-28">
              <h2 id="changelog-title" className="head mb-8">Changelog.</h2>
              <Changelog updates={updates} />
            </section>
          )}

          {p.timeline.length + (p.next?.length ?? 0) > 1 && (
            <section id="verlauf" aria-labelledby="verlauf-title" className="mt-[var(--section)] scroll-mt-28">
              <h2 id="verlauf-title" className="head">Verlauf.</h2>
              <ol className="relative mt-8 border-l border-line pl-6">
                {p.timeline.map((t, i) => (
                  <li key={i} className="relative pb-6">
                    <span aria-hidden className="absolute -left-[1.6rem] top-[0.45rem] h-2 w-2 rounded-full bg-aqua" />
                    <span className="nums small text-muted">{t.date}</span>
                    <p className="mt-0.5">{t.label}</p>
                  </li>
                ))}
                {p.next?.map((n) => (
                  <li key={n} className="relative pb-6 last:pb-0">
                    <span aria-hidden className="absolute -left-[1.6rem] top-[0.45rem] h-2 w-2 rounded-full border border-glow bg-bg" />
                    <span className="small text-glow">Geplant</span>
                    <p className="mt-0.5 text-ink/80">{n}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {p.faq && p.faq.length > 0 && (
            <section id="fragen" aria-labelledby="fragen-title" className="mt-[var(--section)] scroll-mt-28">
              <h2 id="fragen-title" className="head">Fragen.</h2>
              <div className="mt-8 border-b border-line">
                {p.faq.map((f) => (
                  <details key={f.q} className="faq group border-t border-line">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 font-semibold tracking-[-0.015em] transition-colors hover:text-aqua focus-visible:text-aqua [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <span aria-hidden className="text-[1.25rem] font-normal text-muted transition-transform duration-300 ease-[var(--ease-out)] group-open:rotate-45">+</span>
                    </summary>
                    <p className="max-w-[52ch] pb-5 text-ink/80">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {p.slug === "sakuto" && <SakutoStage />}
      {p.slug === "sakuto" && <YouTubeFeed channelId="UCQmuxJXLoovdUOQcaQnyFTA" handle="@Sakuto.mp4" />}

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="wrap mt-[var(--section)] border-t border-line pt-8">
          <h2 id="related-title" className="head">Hängt zusammen mit.</h2>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {related.map((r, i) => (
              <li key={r.slug} data-reveal style={{ ["--i" as string]: i }}>
                <ProjectTile
                  project={r}
                  tone={posterTone[r.slug]}
                  people={team.filter((m) => m.projects.some((x) => x.slug === r.slug)).map((m) => ({ slug: m.slug, name: m.name, photo: m.photo, accent: m.accent }))}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Blättern zwischen den Projekten */}
      <nav aria-label="Weitere Projekte" className="wrap mt-[var(--section)] grid border-t border-line sm:grid-cols-2">
        {[
          { p: prev, dir: "Vorheriges Projekt", arrow: "←" },
          { p: next, dir: "Nächstes Projekt", arrow: "→" },
        ].map(({ p: q, dir, arrow }, i) => (
          <Link
            key={dir}
            href={projectHref(q)}
            className={`seg-host group relative flex items-baseline gap-6 pt-6 pb-2 ${i === 1 ? "justify-end text-right sm:border-l sm:border-line sm:pl-6" : "sm:pr-6"}`}
          >
            <span aria-hidden className="seg seg-top" />
            {i === 0 && <span aria-hidden className="text-[1.75rem] transition-transform duration-500 group-hover:-translate-x-1.5">{arrow}</span>}
            <span>
              <span className="small block text-muted">{dir}</span>
              <span className="head mt-2 block transition-colors group-hover:text-aqua">{q.title}</span>
            </span>
            {i === 1 && <span aria-hidden className="text-[1.75rem] transition-transform duration-500 group-hover:translate-x-1.5">{arrow}</span>}
          </Link>
        ))}
      </nav>
      <p className="wrap mt-8">
        <Link href="/projekte" className="link-under">Alle Projekte</Link>
      </p>
    </article>
  );
}
