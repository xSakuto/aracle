import Link from "next/link";
import ProjectPoster from "@/components/visuals/ProjectPoster";
import type { Project } from "@/data/projects";

const posterTone: Record<string, "slate" | "glacier" | "glow"> = {
  highside: "glow",
  "beer-game": "glacier",
};

// Projektkarte für Übersicht und "Weitere Projekte": Foto oder Projektplakat.
export default function ProjectCard({ project: p, large = false }: { project: Project; large?: boolean }) {
  return (
    <Link href={`/projekte/${p.slug}`} className="group block">
      <div className={`relative overflow-hidden rounded-[var(--radius)] ${large ? "aspect-[4/3]" : "aspect-[4/5]"}`}>
        {p.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.coverImage}
            alt={p.title}
            width={1600}
            height={1067}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
          />
        ) : (
          <ProjectPoster
            project={p}
            tone={posterTone[p.slug] ?? "slate"}
            className="h-full w-full transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.02]"
          />
        )}
        {p.status !== "Aktiv" && (
          <span className="absolute bottom-3 left-3 rounded-full bg-bg/85 px-3 py-1 text-[0.75rem] font-medium backdrop-blur">
            {p.status}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-3">
        <h3 className="text-[1.1875rem] font-semibold tracking-[-0.02em] transition-colors group-hover:text-aqua">{p.title}</h3>
        <span className="small nums shrink-0 text-muted">{p.year}</span>
      </div>
      <p className="mt-1 text-muted">{p.shortDescription}</p>
    </Link>
  );
}
