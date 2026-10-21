import Link from "next/link";
import Portrait from "@/components/Portrait";
import type { TeamMember } from "@/lib/team";

// "Das Team" bleibt stehen, die Leute ziehen abwechselnd links und rechts vorbei.
export default function TeamPass({ members }: { members: TeamMember[] }) {
  const shown = members.slice(0, 4);
  return (
    <section aria-labelledby="team-title" className="relative">
      <div className="pointer-events-none sticky top-0 z-10 flex h-svh items-start justify-center pt-24 md:items-center md:pt-0">
        <h2
          id="team-title"
          className="display text-center md:leading-[0.85]"
        >
          Das Team
        </h2>
      </div>

      <ol className="wrap relative -mt-[60svh] grid grid-cols-12 gap-y-12 pb-[24svh] md:-mt-[50svh] md:gap-y-[10svh]">
        {shown.map((m, i) => (
          <li
            key={m.id}
            data-reveal
            className={`col-span-9 sm:col-span-8 md:col-span-3 ${
              i % 2 === 0
                ? "col-start-1"
                : "col-start-4 sm:col-start-5 md:col-start-10"
            }`}
          >
            <Portrait name={m.name} photo={m.photo} accent={m.accent} />
            <p className="mt-4 font-medium leading-snug">
              {m.name}
            </p>
            <p className="small text-muted">{m.role}</p>
            <p className="mt-2 max-w-[300px]">
              {m.bio}
            </p>
          </li>
        ))}
      </ol>

      <div className="wrap relative z-10 -mt-[14svh] pb-8 text-center">
        <Link href="/team" className="btn-quiet">
          Alle {members.length} mit ihren Projekten
        </Link>
      </div>
    </section>
  );
}
