"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Portrait from "@/components/Portrait";
import SocialIcon from "@/components/SocialIcon";
import { SOCIAL_LABELS } from "@/data/socials";
import type { TeamMember } from "@/lib/team";

type ProjectRef = { slug: string; title: string };

// Team als Register auf dem Raster: Porträt, Name und Rolle, kurze Bio,
// Projekte als ruhige Liste. Der Filter blendet nicht aus, er nimmt zurück,
// damit das Layout beim Filtern stehen bleibt.
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
  // Nur Projekte zeigen, an denen jemand beteiligt ist, in der Reihenfolge der Projektliste.
  const used = projects.filter((p) =>
    members.some((m) => m.projects.some((x) => x.slug === p.slug)),
  );
  const match = (m: TeamMember) => !filter || m.projects.some((p) => p.slug === filter);
  const count = members.filter(match).length;

  return (
    <>
      <div className="mt-14 border-t border-line pt-5" role="group" aria-label="Nach Projekt filtern">
        <p className="small text-muted">Wer arbeitet woran?</p>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
          {[{ slug: null as string | null, title: "Alle" }, ...used].map((p) => {
            const on = filter === p.slug;
            return (
              <button
                key={p.slug ?? "alle"}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(on && p.slug ? null : p.slug)}
                className={`seg-host relative inline-flex min-h-10 items-center text-[0.9375rem] transition-colors duration-200 active:opacity-70 ${
                  on ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {p.title}
                <span aria-hidden className="seg" style={{ bottom: "0.375rem" }} />
              </button>
            );
          })}
        </div>
        <p className="sr-only" aria-live="polite">
          {filter ? `${count} von ${members.length} Personen arbeiten an ${titleOf[filter]}` : `${members.length} Personen`}
        </p>
      </div>

      <ul className="mt-10 border-b border-line">
        {members.map((m) => {
          const on = match(m);
          return (
            <li
              key={m.id}
              id={m.slug}
              className={`grid scroll-mt-24 grid-cols-[7.5rem_1fr] gap-x-5 gap-y-6 border-t border-line py-8 transition-opacity duration-500 sm:grid-cols-[10rem_1fr] md:grid-cols-12 md:gap-x-8 md:py-12 ${
                on ? "opacity-100" : "opacity-25"
              }`}
            >
              <div className="overflow-hidden rounded-[var(--radius)] md:col-span-3">
                <Portrait name={m.name} photo={m.photo} accent={m.accent} sizes="(min-width: 768px) 22vw, 10rem" />
              </div>

              <div className="flex min-w-0 flex-col md:col-span-5">
                <h2 className="head">{m.name}</h2>
                <p className="mt-2 text-muted">{m.role}</p>
                <p className="mt-6 hidden max-w-[44ch] text-ink/80 sm:block">{m.bio}</p>

                {m.socials.length > 0 && (
                  <ul className="-ml-2.5 mt-auto flex flex-wrap pt-6">
                    {m.socials.map((s) => (
                      <li key={s.type + s.url}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${m.name} auf ${SOCIAL_LABELS[s.type]}`}
                          title={SOCIAL_LABELS[s.type]}
                          className="grid h-10 w-10 place-items-center text-muted transition-[color,transform] duration-200 hover:text-aqua active:scale-90"
                        >
                          <SocialIcon type={s.type} className="h-[18px] w-[18px]" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <p className="col-span-2 -mt-2 max-w-[44ch] text-ink/80 sm:hidden">{m.bio}</p>

              {m.projects.length > 0 && (
                <div className="col-span-2 md:col-span-4">
                  <h3 className="small text-muted">Projekte</h3>
                  <ul className="mt-3 border-b border-line/70">
                    {m.projects.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/projekte/${p.slug}`}
                          className={`seg-host relative flex min-h-10 items-center justify-between gap-4 border-t border-line/70 text-[0.9375rem] transition-colors hover:text-aqua ${
                            filter === p.slug ? "is-current text-ink" : ""
                          }`}
                        >
                          <span aria-hidden className="seg seg-top" />
                          {titleOf[p.slug] ?? p.slug}
                          {p.role && <span className="small shrink-0 text-muted">{p.role}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
