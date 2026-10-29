"use client";

import { useState } from "react";
import Link from "next/link";
import ProjectTile, { type TilePerson } from "@/components/project/ProjectTile";
import { PILLARS, projectHref, type Pillar, type Project } from "@/data/projects";

const pillarText: Record<Pillar, string> = {
  "Marken & Produkte": "Eigene Marken, Apps und Spiele.",
  "Kanäle": "Content-Kanäle und Creator.",
  "Communitys & Server": "Discord-Communities und Minecraft-Server.",
  "Cloud & Hosting": "Hosting auf eigener Hardware.",
};

const posterTone: Record<string, "slate" | "glacier" | "glow"> = {
  highside: "glow",
  "beer-game": "glacier",
};

type StatusFilter = "alle" | "aktiv" | "entsteht";
const statusFilters: { id: StatusFilter; label: string; match: (p: Project) => boolean }[] = [
  { id: "alle", label: "Alle", match: () => true },
  { id: "aktiv", label: "Aktiv", match: (p) => p.status === "Aktiv" },
  { id: "entsteht", label: "In Arbeit", match: (p) => p.status === "In Entwicklung" || p.status === "Konzept" },
];

export const pillarAnchor = (p: string) => p.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-");

const chip =
  "seg-host relative inline-flex min-h-10 shrink-0 whitespace-nowrap items-center rounded-full border px-4 text-[0.875rem] backdrop-blur transition-[border-color,color,background-color,transform] duration-200 focus-visible:border-aqua active:scale-[0.97]";

// Übersicht aller Projekte mit Filter nach Bereich und Stand.
// Eingestellte Projekte stehen ruhig im Archiv am Ende, nicht im Raster.
export default function ProjectBrowser({
  projects,
  stats = {},
  people = {},
}: {
  projects: Project[];
  stats?: Record<string, string>;
  people?: Record<string, TilePerson[]>;
}) {
  const [pillar, setPillar] = useState<Pillar | null>(null);
  const [status, setStatus] = useState<StatusFilter>("alle");

  const live = projects.filter((p) => p.status !== "Eingestellt" && p.status !== "Pausiert");
  const archive = projects.filter((p) => p.status === "Eingestellt" || p.status === "Pausiert");
  const statusMatch = statusFilters.find((s) => s.id === status)!.match;
  const visible = (p: Project) => (!pillar || p.pillar === pillar) && statusMatch(p);
  const used = PILLARS.filter((pl) => live.some((p) => p.pillar === pl));
  const shownCount = live.filter(visible).length;

  return (
    <>
      <div className="z-20 -mx-[var(--margin)] md:sticky border-b border-line bg-bg/75 px-[var(--margin)] py-3 backdrop-blur-md md:top-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="group" aria-label="Bereich" className="-mx-[var(--margin)] flex w-[calc(100%+2*var(--margin))] gap-2 overflow-x-auto md:w-auto px-[var(--margin)] [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
            <button
              type="button"
              aria-pressed={pillar === null}
              onClick={() => setPillar(null)}
              className={`${chip} ${pillar === null ? "border-aqua text-aqua" : "border-line bg-bg/60 hover:border-ink/40 hover:text-ink"}`}
            >
              Alle Bereiche
            </button>
            {used.map((pl) => {
              const on = pillar === pl;
              const n = live.filter((p) => p.pillar === pl && statusMatch(p)).length;
              return (
                <button
                  key={pl}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPillar(on ? null : pl)}
                  disabled={n === 0 && !on}
                  className={`${chip} disabled:pointer-events-none disabled:opacity-40 ${on ? "border-aqua text-aqua" : "border-line bg-bg/60 hover:border-ink/40 hover:text-ink"}`}
                >
                  {pl}
                  <span className="nums ml-2 text-muted">{n}</span>
                </button>
              );
            })}
          </div>
          <div role="group" aria-label="Stand" className="flex rounded-full border border-line p-1">
            {statusFilters.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={status === s.id}
                onClick={() => setStatus(s.id)}
                className={`min-h-8 rounded-full px-3 text-[0.8125rem] transition-[background-color,color,transform] duration-200 active:scale-[0.97] ${
                  status === s.id ? "bg-ink text-bg" : "text-muted hover:text-ink"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">{shownCount} Projekte angezeigt</p>

      {used.map((pl, pi) => {
        const group = live.filter((p) => p.pillar === pl);
        const any = group.some(visible);
        return (
          <section
            key={pl}
            id={pillarAnchor(pl)}
            aria-labelledby={`${pillarAnchor(pl)}-title`}
            hidden={!any}
            className={`scroll-mt-40 border-t border-line pt-8 ${pi === 0 ? "mt-12" : "mt-16"}`}
          >
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <div>
                <h2 id={`${pillarAnchor(pl)}-title`} className="kicker text-aqua">{pl}</h2>
                <p className="head mt-1">{pillarText[pl]}</p>
              </div>
              <p className="small text-muted">
                {group.filter(visible).length} {group.filter(visible).length === 1 ? "Projekt" : "Projekte"}
              </p>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
              {group.map((p, i) => {
                // Breite Kacheln nur, wenn der Bereich ungefiltert ist, sonst entstehen Lücken
                const wide = p.featured && !pillar && status === "alle";
                return (
                  <li
                    key={p.slug}
                    hidden={!visible(p)}
                    className={wide ? "col-span-2" : ""}
                    data-reveal
                    style={{ ["--i" as string]: i % 4 }}
                  >
                    <ProjectTile project={p} wide={wide} tone={posterTone[p.slug]} eager={pi === 0 && i < 2} showTagline people={people[p.slug]} />
                    {!wide && (
                      <p className="small mt-1 flex flex-wrap justify-between gap-x-3 text-muted">
                        <span>{p.category}</span>
                        {stats[p.slug] && <span className="nums text-aqua">{stats[p.slug]}</span>}
                      </p>
                    )}
                    {wide && stats[p.slug] && <p className="small nums mt-1 text-aqua">{stats[p.slug]}</p>}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {shownCount === 0 && (
        <p className="mt-16 text-muted">
          Gerade nichts in diesem Stand.{" "}
          <button type="button" onClick={() => { setPillar(null); setStatus("alle"); }} className="link-under">
            Filter zurücksetzen
          </button>
        </p>
      )}

      {archive.length > 0 && (
        <section aria-labelledby="archiv-title" className="mt-[var(--section)] border-t border-line pt-8">
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 id="archiv-title" className="head">Archiv.</h2>
              <p className="small mt-3 max-w-[32ch] text-muted">Projekte, die nicht mehr laufen, aber zur Geschichte von Aracle gehören.</p>
            </div>
            <ul className="border-b border-line md:col-span-7 md:col-start-6">
              {archive.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={projectHref(p)}
                    className="group grid grid-cols-[1fr_auto] items-baseline gap-4 border-t border-line py-4 transition-colors hover:text-aqua focus-visible:text-aqua"
                  >
                    <span>
                      <span className="font-semibold tracking-[-0.015em]">{p.title}</span>
                      <span className="small ml-3 text-muted">{p.category}</span>
                    </span>
                    <span className="small nums text-muted">
                      {p.year} bis {p.timeline.at(-1)?.date ?? p.year}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
