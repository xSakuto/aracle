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

  const pill = (on: boolean) =>
    `min-h-9 rounded-full px-4 text-[0.875rem] transition-[background-color,color,transform] duration-200 active:scale-[0.97] ${
      on ? "bg-ink text-bg" : "bg-raised text-ink hover:bg-[#2a2a2d]"
    }`;

  return (
    <>
      <div className="mt-12 flex flex-col border-t border-line pt-6" role="group" aria-label="Nach Projekt filtern">
        <p className="small text-muted">Wer arbeitet woran?</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" aria-pressed={filter === null} onClick={() => setFilter(null)} className={pill(filter === null)}>
            Alle
          </button>
          {used.map((p) => (
            <button
              key={p.slug}
              type="button"
              aria-pressed={filter === p.slug}
              onClick={() => setFilter(filter === p.slug ? null : p.slug)}
              className={pill(filter === p.slug)}
            >
              {p.title}
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {shown.length} Personen angezeigt
        </p>
      </div>

      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((m) => (
          <li key={m.id} id={m.slug} data-reveal className="tile flex scroll-mt-24 flex-col p-3">
            <div className="overflow-hidden rounded-[calc(var(--radius)-8px)]">
              <Portrait name={m.name} photo={m.photo} accent={m.accent} />
            </div>
            <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
              <h2 className="text-[1.5rem] leading-tight tracking-[-0.025em]">{m.name}</h2>
              <p className="mt-1 text-muted">{m.role}</p>
              <p className="mt-4">{m.bio}</p>

              {m.projects.length > 0 && (
                <div className="mt-5">
                  <h3 className="sr-only">Projekte</h3>
                  <ul className="flex flex-wrap gap-1.5">
                    {m.projects.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/projekte/${p.slug}`}
                          className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-raised px-3 text-[0.8125rem] transition-[background-color,transform] duration-200 hover:bg-[#2a2a2d] active:scale-[0.97]"
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
                <ul className="mt-auto flex flex-wrap gap-1 pt-5">
                  {m.socials.map((s) => (
                    <li key={s.type + s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${m.name} auf ${SOCIAL_LABELS[s.type]}`}
                        title={SOCIAL_LABELS[s.type]}
                        className="grid h-10 w-10 place-items-center rounded-full text-muted transition-[color,background-color,transform] duration-200 hover:bg-raised hover:text-ink active:scale-90"
                      >
                        <SocialIcon type={s.type} className="h-[18px] w-[18px]" />
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
