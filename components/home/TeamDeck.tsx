import Link from "next/link";
import PeopleIndex from "@/components/home/PeopleIndex";
import type { TeamMember } from "@/lib/team";

// Das Team als Register: Namen gross auf Haarlinien, ein Porträt daneben.
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
        <Link href="/team" className="link-under inline-flex min-h-11 items-center font-medium">
          Alle mit ihren Projekten
        </Link>
      </div>
      <PeopleIndex members={members} />
    </section>
  );
}
