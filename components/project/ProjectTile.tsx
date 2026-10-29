import Link from "next/link";
import ProjectPoster from "@/components/visuals/ProjectPoster";
import { Avatar } from "@/components/MemberLink";
import { projectHref, type Project } from "@/data/projects";

export type TilePerson = { slug: string; name: string; photo?: string; accent: string };

const first = (n: string) => n.split(/\s+/)[0];
function peopleLabel(people: TilePerson[]) {
  if (people.length === 1) return people[0].name;
  if (people.length === 2) return `${first(people[0].name)} & ${first(people[1].name)}`;
  return `${first(people[0].name)}, ${first(people[1].name)} +${people.length - 2}`;
}

// Wer am Projekt arbeitet: Porträts übereinander und die Namen, als Glas-Pille auf dem Bild.
function PeoplePill({ people }: { people: TilePerson[] }) {
  return (
    <span className="absolute left-2.5 top-2.5 inline-flex max-w-[calc(100%-1.25rem)] items-center gap-2 rounded-full bg-[#0b1418]/55 py-1 pl-1 pr-3 text-[0.75rem] text-ink/95 ring-1 ring-white/10 backdrop-blur-md md:left-3 md:top-3">
      <span className="flex -space-x-1.5">
        {people.slice(0, 3).map((m) => (
          <Avatar key={m.slug} name={m.name} photo={m.photo} accent={m.accent} className="h-6 w-6 ring-2 ring-[#0b1418]" />
        ))}
      </span>
      <span className="truncate">{peopleLabel(people)}</span>
    </span>
  );
}

// Eine Kachel für alle Projekt-Raster (Startseite "More work", /projekte).
// Mit Foto: Bild, leicht entsättigt und eingefärbt, damit die ganz
// unterschiedlichen Quellen (Screenshots, Fotos, Spielgrafik) als ein
// Set wirken. Logo klein unten links drauf, sonst der Titel als Text.
// Ohne Foto: das typografische Poster (ProjectPoster).
export default function ProjectTile({
  project: p,
  wide = false,
  tone,
  eager = false,
  showTagline = false,
  className = "",
  people = [],
}: {
  project: Project;
  wide?: boolean;
  tone?: "slate" | "glacier" | "glow";
  eager?: boolean;
  showTagline?: boolean;
  className?: string;
  /** Team des Projekts, erscheint als Pille oben links */
  people?: TilePerson[];
}) {
  return (
    <Link href={projectHref(p)} className={`group block ${className}`}>
      <div className={`relative overflow-hidden rounded-[var(--radius)] ${wide ? "aspect-[2/1]" : "aspect-square"}`}>
        {p.coverImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.coverImage}
              alt={p.title}
              width={1600}
              height={1067}
              loading={eager ? "eager" : "lazy"}
              style={p.coverPosition ? { objectPosition: p.coverPosition } : undefined}
              className="h-full w-full object-cover grayscale-[0.3] saturate-[0.85] transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
            />
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(155deg,rgb(143_214_211/0.9),transparent_62%)] mix-blend-multiply opacity-40" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0b1418]/90 via-[#0b1418]/15 to-transparent" />
            {p.markTile ?? p.mark ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.markTile ?? p.mark}
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute bottom-3 left-3 h-auto max-h-[44%] w-[40%] bg-transparent object-contain object-left-bottom drop-shadow-[0_4px_14px_rgb(0_0_0/0.6)] md:bottom-4 md:left-4"
              />
            ) : (
              <p className="absolute bottom-3 left-3 right-3 font-[family-name:var(--font-display)] text-[1.5rem] font-bold leading-[1.05] tracking-[-0.025em] text-white drop-shadow-[0_2px_6px_rgb(0_0_0/0.6)] md:bottom-4 md:left-4 md:text-[1.875rem]">
                {p.title}
              </p>
            )}
          </>
        ) : (
          <ProjectPoster
            project={p}
            tone={tone ?? "slate"}
            size={wide ? "lg" : "md"}
            className="h-full w-full transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
          />
        )}
        {people.length > 0 && <PeoplePill people={people} />}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-line pt-3">
        <h3 className={`font-semibold tracking-[-0.015em] transition-colors group-hover:text-aqua ${wide ? "text-[1.1875rem]" : ""}`}>
          {p.title}
        </h3>
        <span className={`small nums shrink-0 ${p.status === "Aktiv" ? "text-muted" : "text-glow"}`}>
          {p.status === "Aktiv" ? p.year : p.status}
        </span>
      </div>
      {showTagline && wide && <p className="mt-1 max-w-[42ch] text-ink/70">{p.tagline}</p>}
    </Link>
  );
}
