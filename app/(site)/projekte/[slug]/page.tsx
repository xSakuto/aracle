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
    <article>
      <header className="wrap grid grid-cols-12 items-end gap-x-8 gap-y-10 pb-[calc(var(--section)/2)] pt-32 md:pt-40">
        <div className={project.hasPhoto ? "col-span-12 md:col-span-7" : "col-span-12 md:col-span-9"}>
          <h1 className="display" data-rise>
            {project.title}
          </h1>
          <p className="lead mt-8 max-w-[36rem]" data-rise style={{ ["--i" as string]: 1 }}>
            {project.shortDescription}
          </p>
          <p className="small mt-4 text-muted" data-rise style={{ ["--i" as string]: 2 }}>
            {category}, seit {project.year ?? "unbekannt"}, {statusLine[project.status]}
          </p>
        </div>
        {project.hasPhoto && (
          <div className="col-span-12 overflow-hidden md:col-span-5" data-rise style={{ ["--i" as string]: 2 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverImage}
              alt={project.title}
              width={1600}
              height={1067}
              className="drift aspect-[4/5] w-full object-cover"
            />
          </div>
        )}
      </header>

      <div className="wrap grid grid-cols-12 gap-x-8 gap-y-16 pb-[var(--section)]">
        <section aria-labelledby="about-title" className="col-span-12 md:col-span-6">
          <h2 id="about-title" className="head" data-reveal>
            Worum es geht
          </h2>
          <p className="mt-6 max-w-[60ch]" data-reveal style={{ ["--i" as string]: 1 }}>
            {project.longDescription}
          </p>

          {project.timeline.length > 0 && (
            <ol className="mt-12 flex flex-col gap-6">
              {project.timeline.map((t, i) => (
                <li key={i} className="grid grid-cols-[5rem_1fr] gap-4" data-reveal style={{ ["--i" as string]: i + 2 }}>
                  <span className="nums font-display lead">{t.date}</span>
                  <span className="pt-1">{t.label}</span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <aside className="col-span-12 flex flex-col gap-12 md:col-span-4 md:col-start-9">
          <section aria-labelledby="team-title">
            <h2 id="team-title" className="lead font-display" data-reveal>
              Wer dran ist
            </h2>
            {team.length > 0 ? (
              <ul className="mt-4 flex flex-col gap-1">
                {team.map((m) => (
                  <li key={m.slug} data-reveal>
                    <Link
                      href={`/team#${m.slug}`}
                      className="group flex min-h-12 items-baseline justify-between gap-4 bg-surface px-4 py-3 transition-[background-color,transform] duration-200 hover:bg-raised active:scale-[0.99]"
                    >
                      <span className="font-medium group-hover:text-aqua">{m.name}</span>
                      <span className="small text-muted">{m.role}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-muted">Noch niemand eingetragen.</p>
            )}
          </section>

          {project.techStack.length > 0 && (
            <section aria-labelledby="stack-title">
              <h2 id="stack-title" className="lead font-display">Womit</h2>
              <p className="mt-3">{project.techStack.join(", ")}</p>
            </section>
          )}

          {project.links.length > 0 && (
            <section aria-labelledby="links-title">
              <h2 id="links-title" className="lead font-display">Links</h2>
              <ul className="mt-3 flex flex-col gap-1">
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

          <div className="flex flex-col items-start gap-4">
            <Link href="/kontakt" className="btn">
              Projekt anfragen
            </Link>
            <Link href="/projekte" className="link-under inline-flex min-h-11 items-center">
              Alle Projekte ansehen
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
