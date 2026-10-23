"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import DuoPortrait from "@/components/DuoPortrait";
import TouchLight from "@/components/TouchLight";
import { APPLY_ROLES } from "@/data/apply";
import ContactLinks from "@/components/ContactLinks";
import type { TeamMember } from "@/lib/team";

type ProjectRef = { slug: string; title: string; href: string; mark?: string };

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
  const hrefOf = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.slug, p.href])),
    [projects],
  );
  const markOf = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.slug, p.mark])),
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
              className={`duo-host grid scroll-mt-24 grid-cols-[7.5rem_1fr] gap-x-5 gap-y-6 border-t border-line py-8 transition-opacity duration-500 sm:grid-cols-[10rem_1fr] md:grid-cols-12 md:gap-x-8 md:py-12 ${
                on ? "opacity-100" : "opacity-25"
              }`}
            >
              <div className="overflow-hidden rounded-[var(--radius)] md:col-span-3">
                <DuoPortrait name={m.name} photo={m.photo} accent={m.accent} sizes="(min-width: 768px) 22vw, 10rem" />
              </div>

              <div className="flex min-w-0 flex-col md:col-span-5">
                <h2 className="head">{m.name}</h2>
                <p className="mt-2 text-muted">{m.role}</p>
                <p className="mt-6 hidden max-w-[44ch] text-ink/80 sm:block">{m.bio}</p>

                {m.quote && (
                  <blockquote className="mt-6 max-w-[40ch] border-l border-aqua pl-4 text-ink/90">«{m.quote}»</blockquote>
                )}

                <ContactLinks name={m.name} socials={m.socials} email={m.contactEmail} className="mt-auto pt-6" />
              </div>

              <p className="col-span-2 -mt-2 max-w-[44ch] text-ink/80 sm:hidden">{m.bio}</p>

              {m.projects.length > 0 && (
                <div className="col-span-2 md:col-span-4">
                  {/* Nach Rolle gruppiert: die Rolle steht einmal, darunter die Projekte mit Logo */}
                  {Object.entries(
                    m.projects.reduce<Record<string, string[]>>((acc, p) => {
                      (acc[p.role || m.role] ??= []).push(p.slug);
                      return acc;
                    }, {}),
                  ).map(([role, slugs]) => (
                    <div key={role} className="[&+&]:mt-6">
                      <h3 className="small text-muted">
                        {role} <span className="nums">· {slugs.length}</span>
                      </h3>
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {slugs.map((slug) => (
                          <li key={slug}>
                            <Link
                              href={hrefOf[slug] ?? `/projekte/${slug}`}
                              className={`group inline-flex min-h-9 items-center gap-2 rounded-[var(--radius)] border py-1 pl-1 pr-3 text-[0.875rem] transition-[border-color,color] duration-200 hover:border-aqua hover:text-aqua ${
                                filter === slug ? "border-aqua text-ink" : "border-line"
                              }`}
                            >
                              <span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-[4px] bg-raised">
                                {markOf[slug] ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={markOf[slug]} alt="" width={28} height={28} loading="lazy" className="max-h-5 max-w-5 bg-transparent object-contain" />
                                ) : (
                                  <span className="text-[0.6875rem] font-semibold text-muted">{(titleOf[slug] ?? slug).slice(0, 2)}</span>
                                )}
                              </span>
                              {titleOf[slug] ?? slug}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
        <li className="grid grid-cols-[7.5rem_1fr] gap-x-5 gap-y-6 border-t border-line py-8 sm:grid-cols-[10rem_1fr] md:grid-cols-12 md:gap-x-8 md:py-12">
          <Link
            href="/apply"
            aria-label="Bewerben"
            className="group grid aspect-[4/5] place-items-center rounded-[var(--radius)] border border-dashed border-ink/25 transition-colors hover:border-aqua md:col-span-3"
          >
            <span aria-hidden className="text-[2.5rem] font-light text-muted transition-colors group-hover:text-aqua">+</span>
          </Link>
          <div className="flex min-w-0 flex-col md:col-span-5">
            <p className="kicker text-aqua">Wir suchen</p>
            <h2 className="head mt-2">Dein Platz im Team.</h2>
            <p className="mt-6 max-w-[44ch] text-ink/80">
              Du programmierst, gestaltest oder hilfst gerne bei Moderation und Organisation? Dann bewirb dich direkt.
            </p>
            <Link href="/apply" className="btn mt-6 self-start">Jetzt bewerben</Link>
          </div>
          <div className="col-span-2 md:col-span-4">
            <h3 className="small text-muted">Offen</h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {APPLY_ROLES.map((r) => (
                <li key={r.key}>
                  <Link href={`/apply?bereich=${r.key}`} className="inline-flex min-h-9 items-center rounded-[var(--radius)] border border-line px-3 text-[0.875rem] transition-[border-color,color] hover:border-aqua hover:text-aqua">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </li>
      </ul>
      <TouchLight />
    </>
  );
}
