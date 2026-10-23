import Link from "next/link";
import ProjectTile from "@/components/project/ProjectTile";
import { type Project } from "@/data/projects";

// Kleine Sammlung: alle weiteren Projekte als kompakte Kacheln, vier pro Reihe.
export default function WorkGrid({ items, total }: { items: Project[]; total: number }) {
  return (
    <section aria-labelledby="more-title" className="wrap py-[var(--section)]">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 id="more-title" className="display" data-split>
          More work.
        </h2>
        <p className="max-w-[24rem] text-ink/80">
          Kanäle, Communities und Experimente. Vieles davon ist der Grund, warum es Aracle heute gibt.
        </p>
      </div>

      <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">
        {items.map((p, i) => (
          <li key={p.slug} data-reveal style={{ ["--i" as string]: i % 4 }}>
            <ProjectTile project={p} />
          </li>
        ))}
        <li data-reveal style={{ ["--i" as string]: items.length % 4 }}>
          <Link
            href="/projekte"
            className="group flex aspect-square flex-col justify-end rounded-[var(--radius)] border border-line p-5 transition-colors hover:border-aqua"
          >
            <span className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,1rem+1.4vw,2.25rem)] font-bold leading-[1] tracking-[-0.03em] transition-colors group-hover:text-aqua">
              All {total} projects
            </span>
            <span className="small mt-2 text-muted">Von Streetwear bis Server</span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
