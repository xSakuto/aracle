import Link from "next/link";
import type { Project, ProjectStatus } from "@/data/projects";

const statusStyle: Record<ProjectStatus, string> = {
  Aktiv: "bg-aqua/15 text-aqua border-aqua/30",
  "In Planung": "bg-sky-400/15 text-sky-300 border-sky-400/30",
  Pausiert: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  Eingestellt: "bg-white/10 text-white/50 border-white/15",
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projekte/${project.slug}`}
      className="group relative block overflow-hidden rounded-2xl"
    >
      <div
        className="aspect-[4/5] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${project.coverImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      <span
        className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle[project.status]}`}
      >
        {project.status}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-6">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-aqua">
          {project.category}
        </span>
        <h3 className="mt-2 text-2xl font-bold leading-tight tracking-tight">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-muted">{project.owner}</p>
        <p className="mt-3 line-clamp-2 text-sm text-white/70">
          {project.shortDescription}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md transition group-hover:border-aqua group-hover:bg-aqua group-hover:text-black">
          Mehr erfahren →
        </span>
      </div>
    </Link>
  );
}
