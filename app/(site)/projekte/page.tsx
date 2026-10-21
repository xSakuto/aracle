import Link from "next/link";
import ProjectIndex from "@/components/ProjectIndex";
import { projects, STATUS_ORDER } from "@/data/projects";

export const metadata = {
  title: "Projekte · Aracle",
  description: "Alle Marken und Projekte aus dem Aracle Studio, von aktiv bis eingestellt.",
};

const groupTitle: Record<string, string> = {
  Aktiv: "Laufen gerade",
  "In Planung": "In Planung",
  Pausiert: "Pausiert",
  Eingestellt: "Abgeschlossen",
};

export default function ProjektePage() {
  const withPhoto = projects.filter((p) => p.hasPhoto);
  return (
    <div data-shape="wheel" className="wrap pb-[var(--section)] pt-28 md:pt-36">
      <div className="inner">
      <div className="text-center">
        <h1 className="display" data-split="load">
          Projekte.
        </h1>
        <p className="lead mx-auto mt-5 max-w-[36rem] text-muted" data-rise style={{ ["--i" as string]: 1 }}>
          {projects.length} Marken und Projekte seit 2017. Was läuft, was geplant
          ist und was wir unterwegs gelernt haben.
        </p>
      </div>

      {/* Die drei Marken mit eigenen Fotos */}
      <ul className="mt-14 grid gap-3 sm:grid-cols-3">
        {withPhoto.map((p, i) => (
          <li key={p.slug} data-reveal style={{ ["--i" as string]: i }}>
            <Link href={`/projekte/${p.slug}`} className="tile group block p-3 transition-transform active:scale-[0.99]">
              <div className="overflow-hidden rounded-[calc(var(--radius)-8px)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.coverImage}
                  alt={p.title}
                  width={1600}
                  height={1067}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
                />
              </div>
              <div className="px-3 pb-3 pt-5">
                <p className="text-[1.3125rem] font-semibold tracking-[-0.02em]">{p.title}</p>
                <p className="mt-1 text-muted">{p.shortDescription}</p>
                <p className="link-under mt-3 inline-block">Mehr erfahren</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {STATUS_ORDER.map((status) => {
        const group = projects.filter((p) => p.status === status);
        if (!group.length) return null;
        return (
          <section key={status} aria-label={groupTitle[status]} className="mt-[calc(var(--section)*0.6)]">
            <h2 className="mb-5 text-[clamp(1.5rem,1.2rem+1vw,2rem)] tracking-[-0.025em]" data-reveal>
              {groupTitle[status]}
            </h2>
            <ProjectIndex
              rows={group.map((p) => ({
                slug: p.slug,
                title: p.title,
                category: p.category.replace(" · ", ", "),
                desc: p.shortDescription,
                year: p.year,
              }))}
            />
          </section>
        );
      })}
      </div>
    </div>
  );
}
