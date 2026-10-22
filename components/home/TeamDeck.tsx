import Link from "next/link";
import Portrait from "@/components/Portrait";
import type { TeamMember } from "@/lib/team";

// Das Team: ruhiges Raster, beim Überfahren hebt sich eine Karte.
export default function TeamDeck({ members }: { members: TeamMember[] }) {
  return (
    <section aria-labelledby="team-title" className="wrap py-[var(--section)]">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="kicker text-aqua">Team</p>
          <h2 id="team-title" className="display mt-4" data-split>
            The people.
          </h2>
        </div>
        <Link href="/team" className="link-under inline-flex min-h-11 items-center font-medium" data-cursor="Alle">
          Alle mit ihren Projekten
        </Link>
      </div>

      <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
        {members.map((m, i) => (
          <li key={m.id} data-reveal style={{ ["--i" as string]: i % 3 }}>
            <Link
              href={`/team#${m.slug}`}
              data-cursor={m.name.split(" ")[0]}
              className="group block transition-transform duration-500 ease-[var(--ease-out)] hover:-translate-y-2"
            >
              <div className="overflow-hidden rounded-[var(--radius)]">
                <Portrait
                  name={m.name}
                  photo={m.photo}
                  accent={m.accent}
                  className="grayscale-[35%] transition-[filter,transform] duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                />
              </div>
              <div className="mt-3 border-t border-line pt-3">
                <p className="font-semibold tracking-[-0.015em]">{m.name}</p>
                <p className="small mt-0.5 text-muted">{m.role}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
