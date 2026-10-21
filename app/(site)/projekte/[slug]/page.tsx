import { notFound } from "next/navigation";
import Link from "next/link";
import { projects, getProject } from "@/data/projects";
import { getProjectTeam } from "@/lib/team";

export const revalidate = 60;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  return {
    title: p ? `${p.title} · Aracle` : "Projekt · Aracle",
    description: p?.shortDescription,
  };
}

const statusLine: Record<string, string> = {
  Aktiv: "läuft",
  "In Planung": "in Planung",
  Pausiert: "pausiert",
  Eingestellt: "eingestellt",
};

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const team = await getProjectTeam(slug);
  const category = project.category.replace(" · ", ", ");

  return (
    <article className="wrap pb-[var(--section)] pt-28 md:pt-36">
      <div className="inner">
        <header className="text-center">
          <h1 className="display" data-rise>
            {project.title}
          </h1>
          <p className="lead mx-auto mt-5 max-w-[36rem] text-muted" data-rise style={{ ["--i" as string]: 1 }}>
            {project.shortDescription}
          </p>
          <p className="small mt-4 text-muted" data-rise style={{ ["--i" as string]: 2 }}>
            {category}, seit {project.year ?? "unbekannt"}, {statusLine[project.status]}
          </p>
        </header>

        {project.hasPhoto && (
          <div className="mt-12 overflow-hidden rounded-[var(--radius)] md:mt-16" data-rise style={{ ["--i" as string]: 2 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverImage}
              alt={project.title}
              width={1600}
              height={1067}
              fetchPriority="high"
              className="zoom-in aspect-[4/5] w-full object-cover sm:aspect-[16/9]"
            />
          </div>
        )}

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <section aria-labelledby="about-title" className="tile p-8 md:col-span-2 md:p-10" data-reveal>
            <h2 id="about-title" className="text-[1.5rem] tracking-[-0.025em]">
              Worum es geht
            </h2>
            <p className="mt-4 max-w-[60ch] text-ink/90">{project.longDescription}</p>

            {project.timeline.length > 0 && (
              <ol className="mt-8 flex flex-col gap-4">
                {project.timeline.map((t, i) => (
                  <li key={i} className="grid grid-cols-[4.5rem_1fr] gap-4">
                    <span className="nums font-semibold">{t.date}</span>
                    <span className="text-muted">{t.label}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <aside className="tile flex flex-col gap-8 p-8" data-reveal style={{ ["--i" as string]: 1 }}>
            <section aria-labelledby="team-title">
              <h2 id="team-title" className="text-[1.1875rem] tracking-[-0.02em]">Wer dran ist</h2>
              {team.length > 0 ? (
                <ul className="mt-3 flex flex-col">
                  {team.map((m) => (
                    <li key={m.slug}>
                      <Link
                        href={`/team#${m.slug}`}
                        className="group -mx-3 flex min-h-11 items-baseline justify-between gap-4 rounded-xl px-3 py-2 transition-colors hover:bg-raised"
                      >
                        <span className="font-medium">{m.name}</span>
                        <span className="small text-muted">{m.role}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-muted">Noch niemand eingetragen.</p>
              )}
            </section>

            {project.techStack.length > 0 && (
              <section aria-labelledby="stack-title">
                <h2 id="stack-title" className="text-[1.1875rem] tracking-[-0.02em]">Womit</h2>
                <p className="mt-2 text-muted">{project.techStack.join(", ")}</p>
              </section>
            )}

            {project.links.length > 0 && (
              <section aria-labelledby="links-title">
                <h2 id="links-title" className="text-[1.1875rem] tracking-[-0.02em]">Links</h2>
                <ul className="mt-2">
                  {project.links.map((l) => (
                    <li key={l.url}>
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="link-under inline-flex min-h-11 items-center">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-auto flex flex-col items-start gap-2">
              <Link href="/kontakt" className="btn">Projekt anfragen</Link>
              <Link href="/projekte" className="link-under inline-flex min-h-11 items-center">
                Alle Projekte
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
