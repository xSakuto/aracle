import { ridge } from "@/lib/alpine";
import type { Project } from "@/data/projects";

// Typografisches Projektplakat für Projekte ohne eigenes Foto:
// Titel, Kategorie und eine projekteigene Kammlinie. Kein Stockfoto.
const tones = {
  slate: { bg: "#151d22", ink: "var(--color-ink)", line: "var(--color-aqua)" },
  glacier: { bg: "#8fd6d3", ink: "#0b1418", line: "#0b1418" },
  glow: { bg: "#f2a98f", ink: "#0b1418", line: "#0b1418" },
} as const;

function seedOf(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return (h % 50) + 1;
}

export default function ProjectPoster({
  project,
  tone = "slate",
  className = "",
  size = "md",
}: {
  project: Pick<Project, "slug" | "title" | "category" | "year">;
  tone?: keyof typeof tones;
  className?: string;
  size?: "md" | "lg";
}) {
  const t = tones[tone];
  const seed = seedOf(project.slug);
  const longest = Math.max(4, ...project.title.split(/\s+/).map((w) => w.length));
  const lines = [0, 1, 2].map((l) => ridge(800, 260, l, seed, 90));
  return (
    <div
      role="img"
      aria-label={`${project.title}, ${project.category}`}
      className={`@container relative flex flex-col overflow-hidden p-6 md:p-8 ${className}`}
      style={{ background: t.bg, color: t.ink }}
    >
      <div className="kicker flex justify-between opacity-70">
        <span>{project.category}</span>
        <span className="nums">{project.year}</span>
      </div>
      <svg viewBox="0 0 800 260" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[45%] w-full" aria-hidden>
        {lines.map((r, i) => (
          <path
            key={i}
            d={r.d}
            fill="none"
            vectorEffect="non-scaling-stroke"
            style={{ stroke: t.line, strokeOpacity: i === 0 ? 0.9 : 0.25 + i * 0.1, strokeWidth: 1 }}
          />
        ))}
      </svg>
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
