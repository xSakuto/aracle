import Link from "next/link";
import ProjectPoster from "@/components/visuals/ProjectPoster";
import { projectHref, type Project } from "@/data/projects";

const posterTone: Record<string, "slate" | "glacier" | "glow"> = {
  highside: "glow",
  "beer-game": "glacier",
};

// Selected work: Die Projekte laufen horizontal vorbei, während der Abschnitt steht.
// Auf dem Handy liegen sie untereinander. Daten kommen direkt aus data/projects.ts.
export default function BrandRun({ items, total }: { items: Project[]; total: number }) {
  // Der äussere Rahmen gehört React allein. GSAP legt beim Fixieren einen Hilfscontainer
  // um die Section; ohne diesen Rahmen stürzt React beim Seitenwechsel ab (removeChild).
  return (
    <div>
    <section aria-labelledby="work-title" data-hscroll className="relative overflow-hidden">
      <div
        data-hscroll-track
        className="flex flex-col gap-12 px-[var(--margin)] py-[var(--section)] md:h-svh md:w-max md:flex-row md:items-center md:gap-8 md:py-0"
      >
        <div className="shrink-0 md:w-[28vw]">
          <p className="kicker text-aqua">Portfolio</p>
          <h2 id="work-title" className="display mt-4" data-split>
            Selected work
          </h2>
          <p className="mt-6 max-w-[24rem] text-ink/80">
            Eigene Marken und Projekte. Was wir für andere bauen, setzen wir
            zuerst bei uns selbst um.
          </p>
        </div>

        {items.map((p) => (
          <Link
            key={p.slug}
            href={projectHref(p)}
            className={`group flex shrink-0 flex-col ${p.coverImage ? "md:w-[46vw]" : "md:w-[30vw]"}`}
          >
            <div className="relative h-[56svh] overflow-hidden rounded-[var(--radius)] md:h-[62svh]">
              {p.coverImage ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    width={1600}
                    height={1067}
                    loading="lazy"
                    data-hscroll-img
                    className="absolute inset-0 h-full w-[116%] max-w-none object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03] md:-left-[8%]"
                  />
                  <div aria-hidden className="absolute inset-0 bg-[#0b1115]/15" />
                </>
              ) : (
                <ProjectPoster
                  project={p}
                  tone={posterTone[p.slug] ?? "slate"}
                  className="h-full w-full transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.02]"
                />
              )}
              {p.status !== "Aktiv" && (
                <span className="absolute bottom-4 left-4 rounded-full bg-bg/80 px-3 py-1 text-[0.75rem] font-medium backdrop-blur">
                  {p.status}
                </span>
              )}
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-6 border-t border-line pt-4">
              <h3 className="text-[1.25rem] font-semibold tracking-[-0.02em] transition-colors group-hover:text-aqua">
                {p.title}
              </h3>
              <p className="small shrink-0 text-muted">
                {p.pillar}, {p.year}
              </p>
            </div>
            <p className="mt-1 max-w-[34rem] text-muted">{p.shortDescription}</p>
          </Link>
        ))}

      </div>
    </section>
    </div>
  );
}
