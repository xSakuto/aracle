"use client";

import Link from "next/link";
import DuoPortrait from "@/components/DuoPortrait";
import TouchLight from "@/components/TouchLight";
import { APPLY_ROLES } from "@/data/apply";
import ContactLinks from "@/components/ContactLinks";
import type { TeamMember } from "@/lib/team";

// Team als Register auf dem Raster: Porträt, Name und Rolle, kurze Bio und Zitat.
// Wer woran arbeitet, steht auf den Projekten selbst und im Profil.
export default function TeamDirectory({ members }: { members: TeamMember[] }) {
  // Nicht gelistete Personen (z. B. ein Discord-Mod) stehen nur auf ihren Projektseiten.
  const shown = members.filter((m) => m.listed);

  return (
    <>
      <ul className="mt-14 border-b border-line">
        {shown.map((m) => {
          return (
            <li
              key={m.id}
              id={m.slug}
              className="duo-host grid scroll-mt-24 grid-cols-[7.5rem_1fr] gap-x-5 gap-y-6 border-t border-line py-8 sm:grid-cols-[10rem_1fr] md:grid-cols-12 md:gap-x-8 md:py-12"
            >
              <div className="overflow-hidden rounded-[var(--radius)] md:col-span-3">
                <DuoPortrait name={m.name} photo={m.photo} accent={m.accent} sizes="(min-width: 768px) 22vw, 10rem" />
              </div>

              <div className="flex min-w-0 flex-col md:col-span-5">
                <h2 className="head">
                  <Link href={`/team/${m.slug}`} className="transition-colors hover:text-aqua focus-visible:text-aqua">{m.name}</Link>
                </h2>
                <p className="mt-2 text-muted">{m.role}</p>
                <p className="mt-6 hidden max-w-[44ch] text-ink/80 sm:block">{m.bio}</p>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-6">
                  <ContactLinks name={m.name} socials={m.socials} email={m.contactEmail} />
                  <Link href={`/team/${m.slug}`} className="link-under text-[0.9375rem]">Profil ansehen</Link>
                </div>
              </div>

              <p className="col-span-2 -mt-2 max-w-[44ch] text-ink/80 sm:hidden">{m.bio}</p>

              {m.quote && (
                <blockquote
                  className="col-span-2 max-w-[32ch] border-l-2 pl-5 text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] leading-snug tracking-[-0.015em] text-ink/90 md:col-span-4 md:self-start"
                  style={{ borderColor: m.accent }}
                >
                  «{m.quote}»
                </blockquote>
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
