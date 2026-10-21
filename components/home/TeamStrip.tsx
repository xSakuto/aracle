import Link from "next/link";
import Portrait from "@/components/Portrait";
import type { TeamMember } from "@/lib/team";

// Das Team als Reihe von Karten.
export default function TeamStrip({ members }: { members: TeamMember[] }) {
  return (
    <section aria-labelledby="team-title" className="py-[var(--section)]">
      <div className="wrap">
        <div className="inner text-center">
          <h2 id="team-title" className="head" data-reveal>Das Team.</h2>
          <p className="lead mx-auto mt-3 max-w-[32rem] text-muted" data-reveal style={{ ["--i" as string]: 1 }}>
            Klein, aus Glarus, und jede und jeder führt einen eigenen Bereich.
          </p>
        </div>
      </div>

      <div className="wrap">
      <ul className="inner mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {members.map((m, i) => (
          <li key={m.id} data-reveal style={{ ["--i" as string]: i % 3 }}>
            <Link href={`/team#${m.slug}`} className="group block transition-transform active:scale-[0.98]">
              <div className="overflow-hidden rounded-[var(--radius)]">
                <Portrait
                  name={m.name}
                  photo={m.photo}
                  accent={m.accent}
                  className="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-3 font-semibold tracking-[-0.015em]">{m.name}</p>
              <p className="small text-muted">{m.role}</p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="inner mt-8 text-center">
        <Link href="/team" className="btn-quiet">Alle mit ihren Projekten</Link>
      </div>
      </div>
    </section>
  );
}
