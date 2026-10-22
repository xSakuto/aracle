"use client";

import Link from "next/link";
import { useState } from "react";
import Portrait from "@/components/Portrait";
import type { TeamMember } from "@/lib/team";

// Personenregister: links ein Porträt, rechts die Namen auf Haarlinien.
// Die Zeile unter dem Zeiger oder Fokus bestimmt, wer im Bild steht.
export default function PeopleIndex({ members }: { members: TeamMember[] }) {
  const [active, setActive] = useState(0);
  const current = members[active];

  return (
    <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-12">
      <figure aria-hidden className="hidden md:col-span-4 md:block">
        <div className="relative overflow-hidden rounded-[var(--radius)]">
          {members.map((m, i) => (
            <div
              key={m.id}
              className={`transition-opacity duration-500 ease-[var(--ease-out)] ${i === 0 ? "relative" : "absolute inset-0"} ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            >
              <Portrait name={m.name} photo={m.photo} accent={m.accent} sizes="30vw" />
            </div>
          ))}
        </div>
        {current && (
          <figcaption className="small mt-3 flex items-baseline justify-between border-t border-line pt-3 text-muted">
            <span className="text-ink/85">{current.name}</span>
            <span className="nums">
              {current.projects.length} {current.projects.length === 1 ? "Projekt" : "Projekte"}
            </span>
          </figcaption>
        )}
      </figure>

      <ul className="border-b border-line md:col-span-7 md:col-start-6 md:self-start" onMouseLeave={() => setActive(0)}>
        {members.map((m, i) => (
          <li key={m.id} data-reveal style={{ ["--i" as string]: i }}>
            <Link
              href={`/team#${m.slug}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={`seg-host group relative grid grid-cols-[3.5rem_1fr] items-center gap-x-4 border-t border-line py-5 md:flex md:items-baseline md:justify-between md:gap-8 md:py-7 ${
                i === active ? "is-on" : ""
              }`}
            >
              <span aria-hidden className="seg seg-top" />
              <span className="overflow-hidden rounded-[4px] md:hidden">
                <Portrait name={m.name} photo={m.photo} accent={m.accent} sizes="56px" />
              </span>
              <span className="min-w-0">
                <span
                  className={`block font-[family-name:var(--font-display)] text-[clamp(1.75rem,1rem+2.4vw,3.25rem)] font-[600] leading-[1] tracking-[-0.035em] transition-colors duration-300 ${
                    i === active ? "text-ink" : "text-ink md:text-ink/45"
                  }`}
                >
                  {m.name}
                </span>
                <span className="small mt-1.5 block text-muted md:hidden">{m.role}</span>
              </span>
              <span className="small hidden shrink-0 text-muted md:block">{m.role}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
