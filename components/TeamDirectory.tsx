"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Portrait from "@/components/Portrait";
import SocialIcon from "@/components/SocialIcon";
import { SOCIAL_LABELS } from "@/data/socials";
import type { TeamMember } from "@/lib/team";

type ProjectRef = { slug: string; title: string };

// Team mit Projekt-Tags. Ein Klick auf ein Projekt zeigt, wer daran arbeitet.
export default function TeamDirectory({
  members,
  projects,
}: {
  members: TeamMember[];
  projects: ProjectRef[];
}) {
  const [filter, setFilter] = useState<string | null>(null);
  const titleOf = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.slug, p.title])),
    [projects],
  );
  // Nur Projekte zeigen, an denen jemand beteiligt ist.
  const used = projects.filter((p) =>
    members.some((m) => m.projects.some((x) => x.slug === p.slug)),
  );
  const shown = filter
    ? members.filter((m) => m.projects.some((p) => p.slug === filter))
    : members;

  return (
    <>
      <div className="mt-14 md:mt-20" role="group" aria-label="Nach Projekt filtern">
        <p className="small text-muted">Wer arbeitet woran?</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={filter === null}
            onClick={() => setFilter(null)}
            className={`min-h-10 px-3.5 transition-[background-color,color,transform] duration-200 active:scale-[0.97] ${
              filter === null ? "bg-aqua text-accent-ink" : "bg-raised text-ink hover:bg-[#2a2d33]"
            }`}
          >
            Alle
          </button>
          {used.map((p) => (
            <button
              key={p.slug}
              type="button"
              aria-pressed={filter === p.slug}
              onClick={() => setFilter(filter === p.slug ? null : p.slug)}
              className={`min-h-10 px-3.5 transition-[background-color,color,transform] duration-200 active:scale-[0.97] ${
                filter === p.slug ? "bg-aqua text-accent-ink" : "bg-raised text-ink hover:bg-[#2a2d33]"
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {shown.length} Personen angezeigt
        </p>
      </div>

      <ul className="mt-16 flex flex-col gap-24 md:mt-24 md:gap-32">
        {shown.map((m) => (
          <li
            key={m.id}
            id={m.slug}
            data-reveal
            className="grid scroll-mt-28 grid-cols-12 gap-x-8 gap-y-6"
          >
            <div className="col-span-8 sm:col-span-5 md:col-span-3">
              <Portrait name={m.name} photo={m.photo} accent={m.accent} />
            </div>
            <div className="col-span-12 sm:col-span-7 md:col-span-8 md:col-start-5">
              <h2 className="head">{m.name}</h2>
              <p className="lead mt-2 text-muted">{m.role}</p>
              <p className="mt-6 max-w-[60ch]">{m.bio}</p>

              {m.projects.length > 0 && (
                <div className="mt-8">
                  <h3 className="small font-sans font-medium tracking-normal text-muted">
                    Projekte
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {m.projects.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/projekte/${p.slug}`}
                          className="inline-flex min-h-10 items-center gap-2 bg-raised px-3.5 transition-[background-color,transform] duration-200 hover:bg-[#2a2d33] active:scale-[0.97]"
                        >
                          {titleOf[p.slug] ?? p.slug}
                          {p.role && <span className="text-muted">{p.role}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {m.socials.length > 0 && (
                <ul className="mt-8 flex flex-wrap gap-1">
                  {m.socials.map((s) => (
                    <li key={s.type + s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${m.name} auf ${SOCIAL_LABELS[s.type]}`}
                        title={SOCIAL_LABELS[s.type]}
                        className="grid h-11 w-11 place-items-center text-ink transition-[color,transform] duration-200 hover:text-aqua active:scale-90"
                      >
                        <SocialIcon type={s.type} className="h-5 w-5" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
