import Link from "next/link";
import ContactLinks from "@/components/ContactLinks";
import Portrait from "@/components/Portrait";
import type { TeamMember } from "@/lib/team";

// Team als Karten: Name und Rolle liegen unten auf dem Bild, darunter Zitat,
// Projekte und Kontakte. Kein Einblenden per Script, damit nichts unsichtbar bleibt.
export default function PeopleIndex({ members, titles }: { members: TeamMember[]; titles: Record<string, string> }) {
  return (
    <ul className="mt-12 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
      {members.map((m) => (
        <li key={m.id} className="flex flex-col">
          <Link href={`/team#${m.slug}`} className="group relative block overflow-hidden rounded-[var(--radius)]">
            <Portrait
              name={m.name}
              photo={m.photo}
              accent={m.accent}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
              className="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
            />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0b1115]/95 via-[#0b1115]/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,1.2rem+1.4vw,2.5rem)] font-bold leading-[1] tracking-[-0.03em] transition-colors group-hover:text-aqua">
                {m.name}
              </p>
              <p className="mt-1.5 text-[0.9375rem] text-ink/80">{m.role}</p>
            </div>
          </Link>

          <div className="flex flex-1 flex-col pt-4">
            {m.quote && <p className="max-w-[36ch] text-ink/85">«{m.quote}»</p>}
            {m.projects.length > 0 && (
              <p className="small mt-3 text-muted">
                {m.projects.slice(0, 4).map((p) => titles[p.slug] ?? p.slug).join(", ")}
                {m.projects.length > 4 && ` und ${m.projects.length - 4} weitere`}
              </p>
            )}
            <ContactLinks name={m.name} socials={m.socials} email={m.contactEmail} className="mt-auto pt-3" />
          </div>
        </li>
      ))}
    </ul>
  );
}
