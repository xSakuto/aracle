import { MemberChip } from "@/components/MemberLink";
import { getTeam } from "@/lib/team";

// "Gemacht von" auf den Landing Pages: Porträt und Name, führt aufs Profil.
export default async function ProjectCredits({ slug, fallback = [] }: { slug: string; fallback?: { name: string; slug: string }[] }) {
  const team = await getTeam();
  const people = team
    .filter((m) => m.projects.some((x) => x.slug === slug))
    .map((m) => ({ ...m, projectRole: m.projects.find((x) => x.slug === slug)?.role || m.role }));
  const list = people.length
    ? people
    : fallback
        .map((f) => team.find((m) => m.slug === f.slug))
        .filter((m): m is NonNullable<typeof m> => Boolean(m))
        .map((m) => ({ ...m, projectRole: m.role }));
  if (!list.length) return null;
  return (
    <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
      {list.map((m) => (
        <li key={m.slug}>
          <MemberChip slug={m.slug} name={m.name} photo={m.photo} accent={m.accent} sub={m.projectRole} />
        </li>
      ))}
    </ul>
  );
}
