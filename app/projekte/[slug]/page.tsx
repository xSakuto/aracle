import { notFound } from "next/navigation";
import Link from "next/link";
import { projects, getProject, type ProjectStatus } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProject(slug);
  return { title: p ? `${p.title} · Aracle` : "Projekt · Aracle" };
}

const statusStyle: Record<ProjectStatus, string> = {
  Aktiv: "bg-aqua/15 text-aqua border-aqua/30",
  "In Planung": "bg-sky-400/15 text-sky-300 border-sky-400/30",
  Pausiert: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  Eingestellt: "bg-white/10 text-white/50 border-white/15",
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <article>
      {/* HERO */}
      <header className="relative flex min-h-[60vh] items-end overflow-hidden px-6 pb-12 pt-32 md:px-12">
        {/* Banner-Stripe */}
        <div className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-aqua via-sky-400 to-aqua" />
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.coverImage})` }}
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.55) 55%, var(--color-bg) 100%)",
          }}
        />
        <div className="mx-auto w-full max-w-[1100px]">
          <Link
            href="/projekte"
            className="mb-6 inline-block text-sm text-white/70 transition hover:text-aqua"
          >
            ← Alle Projekte
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle[project.status]}`}
            >
              {project.status}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-aqua">
              {project.category}
            </span>
          </div>
          <h1 className="mt-4 text-[clamp(2.6rem,6vw,5rem)] font-bold leading-[1] tracking-[-0.04em] [text-shadow:0_4px_24px_rgba(0,0,0,0.5)]">
            {project.title}
          </h1>
          <p className="mt-3 text-lg text-white/80">{project.owner}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1100px] gap-14 px-6 py-20 md:grid-cols-[1.6fr_1fr] md:px-12">
        {/* MAIN */}
        <div>
          <p className="text-xl leading-relaxed text-dim">
            {project.longDescription}
          </p>

          {project.timeline.length > 0 && (
            <div className="mt-14">
              <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.16em] text-muted">
                Verlauf
              </h2>
              <ul className="flex flex-col gap-5 border-l border-line pl-6">
                {project.timeline.map((t, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[1.7rem] top-2 h-2.5 w-2.5 rounded-full bg-aqua" />
                    <span className="text-sm font-semibold text-aqua">
                      {t.date}
                    </span>
                    <p className="text-base text-dim">{t.label}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="flex flex-col gap-10">
          {project.team.length > 0 && (
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-muted">
                Team
              </h3>
              <ul className="flex flex-col gap-3">
                {project.team.map((m) => (
                  <li key={m.slug}>
                    <Link
                      href={`/team#${m.slug}`}
                      className="group flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 transition hover:border-aqua/40"
                    >
                      <span className="font-semibold">{m.name}</span>
                      <span className="text-sm text-muted transition group-hover:text-aqua">
                        {m.role}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.techStack.length > 0 && (
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-muted">
                Tech-Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-dim"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.links.length > 0 && (
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-muted">
                Links
              </h3>
              <div className="flex flex-col gap-2">
                {project.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-aqua transition hover:underline"
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </div>
          )}

          <Link
            href="/kontakt"
            className="rounded-lg bg-aqua px-6 py-3 text-center font-bold text-black transition hover:-translate-y-px hover:opacity-90"
          >
            Projekt kontaktieren →
          </Link>
        </aside>
      </div>
    </article>
  );
}
