import ProjectCard from "@/components/ProjectCard";
import { projects, STATUS_ORDER } from "@/data/projects";

export const metadata = {
  title: "Projekte · Aracle",
  description: "Eigene Marken und Projekte aus dem Aracle Studio.",
};

export default function ProjektePage() {
  return (
    <div className="px-6 pb-28 pt-36 md:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-aqua">
          <span className="h-px w-8 bg-aqua/60" /> Portfolio
        </div>
        <h1 className="text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.96] tracking-[-0.04em]">
          Projekte<span className="text-gradient">.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-dim">
          Eigene Marken und Projekte aus dem Studio. Von aktiv über pausiert
          bis abgeschlossen.
        </p>

        {STATUS_ORDER.map((status) => {
          const group = projects.filter((p) => p.status === status);
          if (!group.length) return null;
          return (
            <section key={status} className="mt-20">
              <h2 className="mb-8 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-muted">
                {status}
                <span className="text-aqua">{group.length}</span>
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((p) => (
                  <ProjectCard key={p.slug} project={p} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
