import Link from "next/link";
import Contours from "@/components/alpine/Contours";
import Panorama from "@/components/alpine/Panorama";
import type { Project } from "@/data/projects";
import { meters } from "@/lib/panorama";
import { PILLAR_MOUNTAIN } from "@/lib/mountains";

const tint: Record<string, string> = {
  highside: "rgb(242 169 143 / 0.16)",
  "beer-game": "rgb(143 214 211 / 0.16)",
};

/**
 * Projektkopf über die volle Höhe. Mit Foto: das Bild als Bühne.
 * Ohne Foto: der Glarner Gipfel des Bereichs als grosse Linienzeichnung.
 */
export default function ProjectHero({ p }: { p: Project }) {
  const mt = PILLAR_MOUNTAIN[p.pillar];
  const facts: [string, string][] = [
    ["Status", p.status],
    ["Seit", p.year],
    ["Bereich", p.pillar],
    ["Verantwortlich", p.owner],
  ];

  return (
    <header className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {p.coverImage ? (
        <div aria-hidden className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.coverImage}
            alt=""
            width={1600}
            height={1067}
            fetchPriority="high"
            data-parallax="0.12"
            className="h-[115%] w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0b1115]/35 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/10" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg/70 to-transparent" />
        </div>
      ) : (
        <div aria-hidden className="absolute inset-0">
          <div className="swiss-grid absolute inset-0" />
          <div
            className="absolute left-1/2 top-[45%] h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: `radial-gradient(closest-side, ${tint[p.slug] ?? "rgb(143 214 211 / 0.09)"}, transparent)` }}
          />
          <div className="absolute inset-x-0 top-[26%] text-ink">
            {mt.view ? (
              <Panorama data={mt.view} labels={[{ peak: mt.peak, row: 0, ...(mt.peak !== mt.name ? { title: mt.name, sub: mt.peak } : {}) }]} yMax={520} guide={false} mobileView={{ x0: 250, x1: 1150 }} />
            ) : (
              <div className="mx-auto w-[max(100%,64rem)] -translate-y-[18%] opacity-80">
                <Contours />
              </div>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-bg via-bg/80 to-transparent" />
        </div>
      )}

      <div className="wrap relative z-10 flex flex-1 flex-col pt-28 md:pt-32">
        <nav aria-label="Brotkrumen" className="small text-ink/70" data-rise>
          <Link href="/projekte" className="transition-colors hover:text-ink focus-visible:text-ink">Projekte</Link>
          <span aria-hidden className="mx-2">/</span>
          <Link href={`/projekte#${p.pillar.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}`} className="transition-colors hover:text-ink focus-visible:text-ink">
            {p.pillar}
          </Link>
        </nav>

        <div className="mt-auto grid gap-8 pb-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="kicker text-aqua" data-rise style={{ ["--i" as string]: 1 }}>{p.category}</p>
            <h1 className="mega mt-4" data-split="load">{p.title}</h1>
            <p className="lead mt-5 text-ink/90" data-rise style={{ ["--i" as string]: 2 }}>{p.tagline}</p>
          </div>
          <p className="text-ink/85 md:col-span-4" data-rise style={{ ["--i" as string]: 3 }}>{p.shortDescription}</p>
        </div>

        <dl className="mb-8 grid grid-cols-2 rounded-[var(--radius)] border border-line/80 bg-bg/55 backdrop-blur-md md:grid-cols-4" data-rise style={{ ["--i" as string]: 4 }}>
          {facts.map(([k, v], i) => (
            <div key={k} className={`px-4 py-3.5 ${i % 2 ? "" : "border-r border-line/80"} ${i < 2 ? "border-b border-line/80 md:border-b-0" : ""} md:border-r md:last:border-r-0`}>
              <dt className="kicker text-muted">{k}</dt>
              <dd className="mt-1 font-medium">
                {k === "Status" && p.status !== "Aktiv" ? <span className="text-glow">{v}</span> : v}
              </dd>
            </div>
          ))}
        </dl>
        {!p.coverImage && (
          <p className="small -mt-4 mb-6 text-muted">
            Im Hintergrund: {mt.name}, {meters(mt.m)} m, {mt.from}
          </p>
        )}
      </div>
    </header>
  );
}
