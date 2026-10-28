"use client";

import { useState } from "react";
import Link from "next/link";
import Markdown from "@/components/news/Markdown";
import type { ProjectUpdate } from "@/lib/projects";

const date = new Intl.DateTimeFormat("de-CH", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Zurich" });

// Changelog eines Projekts: neueste zuerst, die ersten drei offen, der Rest auf Klick.
// Einträge mit Text lassen sich auf- und zuklappen.
export default function Changelog({
  updates,
  initial = 3,
  showProject,
}: {
  updates: ProjectUpdate[];
  initial?: number;
  /** Projektnamen pro Eintrag zeigen (auf Profilen), Slug zu Titel und Link */
  showProject?: Record<string, { title: string; href: string }>;
}) {
  const [all, setAll] = useState(false);
  const shown = all ? updates : updates.slice(0, initial);

  return (
    <>
      <ol className="relative border-l border-line pl-6">
        {shown.map((u, i) => {
          const proj = showProject?.[u.projectSlug];
          return (
            <li key={u.id} className="relative pb-8 last:pb-0">
              <span
                aria-hidden
                className={`absolute -left-[1.6rem] top-[0.5rem] h-2 w-2 rounded-full ${i === 0 ? "bg-aqua" : "border border-aqua bg-bg"}`}
              />
              <p className="small flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
                <time dateTime={u.publishedAt} className="nums">{date.format(new Date(u.publishedAt))}</time>
                {u.version && (
                  <span className="nums rounded-full border border-line px-2 py-px text-[0.75rem] text-ink/80">{u.version}</span>
                )}
                {proj && (
                  <Link href={proj.href} className="link">{proj.title}</Link>
                )}
                {u.author && (
                  <span>
                    von <Link href={`/team/${u.author.slug}`} className="link">{u.author.name}</Link>
                  </span>
                )}
                {u.source === "modrinth" && u.url && (
                  <a href={u.url} target="_blank" rel="noopener noreferrer" className="link">
                    Modrinth <span aria-hidden>↗</span>
                  </a>
                )}
              </p>
              {u.body ? (
                <details className="group mt-1" open={i === 0 && !showProject}>
                  <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 font-semibold tracking-[-0.015em] transition-colors hover:text-aqua focus-visible:text-aqua [&::-webkit-details-marker]:hidden">
                    {u.title}
                    <span aria-hidden className="text-muted transition-transform duration-300 ease-[var(--ease-out)] group-open:rotate-45">+</span>
                  </summary>
                  <div className="mt-2 max-w-[60ch] text-[0.9375rem] [&_h2]:!text-base [&_h3]:!text-base [&_h4]:!text-base">
                    <Markdown text={u.body} />
                  </div>
                </details>
              ) : (
                <p className="mt-1 font-semibold tracking-[-0.015em]">{u.title}</p>
              )}
            </li>
          );
        })}
      </ol>
      {updates.length > initial && (
        <button type="button" onClick={() => setAll((v) => !v)} className="btn-quiet mt-8" aria-expanded={all}>
          {all ? "Weniger anzeigen" : `Alle ${updates.length} Einträge`}
        </button>
      )}
    </>
  );
}
