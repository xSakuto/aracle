import Link from "next/link";
import Portrait from "@/components/Portrait";
import type { TeamMember } from "@/lib/team";

// Das Team als lockerer Kartenfächer. Beim Überfahren richtet sich eine Karte auf.
export default function TeamDeck({ members }: { members: TeamMember[] }) {
  const tilts = [-5, 3, -2, 4, -3, 2, -4, 5];
  return (
    <section aria-labelledby="team-title" data-shape="helix" className="wrap py-[var(--section)]">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 id="team-title" className="mega" data-split>
          Das Team
        </h2>
        <Link href="/team" className="link-under inline-flex min-h-11 items-center font-semibold" data-cursor="Alle">
          Alle mit ihren Projekten
        </Link>
      </div>

      <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-0">
        {members.map((m, i) => (
          <li
            key={m.id}
            data-reveal
            style={{ ["--i" as string]: i % 3, ["--tilt" as string]: `${tilts[i % tilts.length]}deg` }}
            className="lg:-mx-2"
          >
            <Link
              href={`/team#${m.slug}`}
              data-cursor={m.name.split(" ")[0]}
              className="group block transition-transform duration-500 ease-[var(--ease-out)] hover:z-10 hover:!rotate-0 hover:-translate-y-4 lg:[transform:rotate(var(--tilt))]"
            >
              <div className="overflow-hidden rounded-[var(--radius)] bg-surface p-2 shadow-[0_30px_60px_-30px_rgba(0,255,255,0.25)]">
                <div className="overflow-hidden rounded-[calc(var(--radius)-6px)]">
                  <Portrait name={m.name} photo={m.photo} accent={m.accent} />
                </div>
                <div className="px-2 pb-2 pt-3">
                  <p className="font-bold uppercase leading-tight [font-stretch:115%]">{m.name}</p>
                  <p className="small mt-0.5 text-muted">{m.role}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
