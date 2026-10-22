"use client";

import Link from "next/link";
import { useState } from "react";
import ContactLinks from "@/components/ContactLinks";
import Portrait from "@/components/Portrait";
import type { TeamMember } from "@/lib/team";

// Personenregister: links Porträt und Zitat, rechts die Namen auf Haarlinien,
// mit Kontakten direkt in der Zeile. Zeiger oder Fokus bestimmt, wer im Bild steht.
export default function PeopleIndex({ members }: { members: TeamMember[] }) {
  const [active, setActive] = useState(0);
  const current = members[active];

  return (
    <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-12">
      <div className="hidden md:col-span-4 md:block">
        <div aria-hidden className="relative overflow-hidden rounded-[var(--radius)]">
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
        {current?.quote && (
          <blockquote key={current.id} className="people-quote mt-6 border-l border-aqua pl-4">
            <p className="text-[1.0625rem] leading-snug text-ink/90">«{current.quote}»</p>
            <footer className="small mt-2 text-muted">{current.name}</footer>
          </blockquote>
        )}
      </div>

      <ul className="border-b border-line md:col-span-7 md:col-start-6 md:self-start" onMouseLeave={() => setActive(0)}>
        {members.map((m, i) => (
          <li
            key={m.id}
            data-reveal
            style={{ ["--i" as string]: i }}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className={`seg-host relative grid grid-cols-[3.5rem_1fr] gap-x-4 border-t border-line py-5 md:grid-cols-[1fr_auto] md:items-center md:gap-8 md:py-7 ${
              i === active ? "is-on" : ""
            }`}
          >
            <span aria-hidden className="seg seg-top" />
            <span className="row-span-2 self-start overflow-hidden rounded-[4px] md:hidden">
              <Portrait name={m.name} photo={m.photo} accent={m.accent} sizes="56px" small />
            </span>
            <div className="min-w-0">
              <Link
                href={`/team#${m.slug}`}
                className={`block font-[family-name:var(--font-display)] text-[clamp(1.75rem,1rem+2.4vw,3.25rem)] font-[600] leading-[1] tracking-[-0.035em] transition-colors duration-300 hover:text-aqua ${
                  i === active ? "text-ink" : "text-ink md:text-ink/45"
                }`}
              >
                {m.name}
              </Link>
              <p className="small mt-2 text-muted">{m.role}</p>
              {m.quote && <p className="small mt-3 max-w-[40ch] text-ink/75 md:hidden">«{m.quote}»</p>}
            </div>
            <ContactLinks name={m.name} socials={m.socials} email={m.contactEmail} className="col-start-2 mt-2 md:col-start-auto md:mt-0 md:justify-end" />
          </li>
        ))}
      </ul>
    </div>
  );
}
