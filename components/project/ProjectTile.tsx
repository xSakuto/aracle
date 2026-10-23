import Link from "next/link";
import ProjectPoster from "@/components/visuals/ProjectPoster";
import { projectHref, type Project } from "@/data/projects";

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
}: {
  project: Project;
  wide?: boolean;
  tone?: "slate" | "glacier" | "glow";
  eager?: boolean;
  showTagline?: boolean;
  className?: string;
}) {
  return (
    <Link href={projectHref(p)} className={`group block ${className}`}>
      <div className={`relative overflow-hidden rounded-[var(--radius)] ${wide ? "aspect-[16/10]" : "aspect-square"}`}>
        {p.coverImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.coverImage}
              alt={p.title}
              width={1600}
              height={1067}
              loading={eager ? "eager" : "lazy"}
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
              <p className="absolute bottom-3 left-3 right-3 font-[family-name:var(--font-display)] text-[1.0625rem] font-bold leading-[1.05] tracking-[-0.025em] text-white drop-shadow-[0_2px_6px_rgb(0_0_0/0.6)] md:bottom-4 md:left-4">
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
