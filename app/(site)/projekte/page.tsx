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
    <div className="wrap pb-[var(--section)] pt-32 md:pt-40">
      <div className="grid grid-cols-12 items-end gap-x-8 gap-y-8">
        <h1 className="display col-span-12 md:col-span-7" data-rise>
          Projekte
        </h1>
        <p className="lead col-span-12 md:col-span-5" data-rise style={{ ["--i" as string]: 1 }}>
          {projects.length} Marken und Projekte seit 2017. Was läuft, was geplant
          ist und was wir unterwegs gelernt haben.
        </p>
      </div>

      {/* Die drei Marken mit eigenen Fotos */}
      <ul className="mt-16 grid gap-8 sm:grid-cols-3">
        {withPhoto.map((p, i) => (
          <li key={p.slug} data-reveal style={{ ["--i" as string]: i }}>
            <Link href={`/projekte/${p.slug}`} className="group block active:scale-[0.99] transition-transform">
              <div className="overflow-hidden">
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
              <p className="lead mt-4 font-display group-hover:text-aqua">{p.title}</p>
              <p className="mt-1">{p.shortDescription}</p>
            </Link>
          </li>
        ))}
      </ul>

      {STATUS_ORDER.map((status) => {
        const group = projects.filter((p) => p.status === status);
        if (!group.length) return null;
        return (
          <section key={status} aria-label={groupTitle[status]} className="mt-[calc(var(--section)*0.6)]">
            <h2 className="head mb-6" data-reveal>
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
  );
}
