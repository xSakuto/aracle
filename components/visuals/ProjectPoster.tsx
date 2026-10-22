import PillarMark from "@/components/alpine/PillarMark";
import type { Project } from "@/data/projects";
import { PILLAR_MOUNTAIN } from "@/lib/mountains";

// Typografisches Projektplakat für Projekte ohne eigenes Foto:
// Titel, Kategorie und der Glarner Gipfel des Bereichs. Kein Stockfoto.
const tones = {
  slate: { bg: "#151d22", ink: "var(--color-ink)", line: "var(--color-aqua)" },
  glacier: { bg: "#8fd6d3", ink: "#0b1418", line: "#0b1418" },
  glow: { bg: "#f2a98f", ink: "#0b1418", line: "#0b1418" },
} as const;

export default function ProjectPoster({
  project,
  tone = "slate",
  className = "",
  size = "md",
}: {
  project: Pick<Project, "slug" | "title" | "category" | "year" | "pillar">;
  tone?: keyof typeof tones;
  className?: string;
  size?: "md" | "lg";
}) {
  const t = tones[tone];
  const mountain = PILLAR_MOUNTAIN[project.pillar];
  const longest = Math.max(4, ...project.title.split(/\s+/).map((w) => w.length));
  return (
    <div
      role="img"
      aria-label={`${project.title}, ${project.category}`}
      className={`@container relative flex flex-col overflow-hidden p-6 md:p-8 ${className}`}
      style={{ background: t.bg, color: t.ink, ["--curtain" as string]: t.bg }}
    >
      <div className="kicker flex justify-between opacity-70">
        <span>{project.category}</span>
        <span className="nums">{project.year}</span>
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0" style={{ color: t.line }}>
        <PillarMark mountain={mountain} ratio={16 / 10} caption={false} className="opacity-80" />
      </div>
      <p
        className="relative mt-5 font-[650] leading-[0.9] tracking-[-0.05em]"
        // Schriftgrösse nach längstem Wort, damit lange Namen nie aus der Karte laufen
        style={{ fontSize: `min(${size === "lg" ? "8rem" : "4.5rem"}, ${Math.round(140 / longest)}cqi)` }}
      >
        {project.title}
      </p>
    </div>
  );
}
