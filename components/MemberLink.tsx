import Link from "next/link";
import { initials } from "@/lib/initials";

export const profileHref = (slug: string) => `/team/${slug}`;

// Ein Name aus dem Team, überall gleich: führt aufs Profil.
export default function MemberLink({
  slug,
  name,
  className = "link",
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  return (
    <Link href={profileHref(slug)} className={className}>
      {name}
    </Link>
  );
}

// Name mit kleinem Porträt, für Listen wie "Team" auf Projektseiten.
export function MemberChip({
  slug,
  name,
  photo,
  accent,
  sub,
}: {
  slug: string;
  name: string;
  photo?: string;
  accent: string;
  sub?: string;
}) {
  return (
    <Link
      href={profileHref(slug)}
      className="group inline-flex min-h-10 items-center gap-2.5 rounded-full py-1 pr-2 transition-colors hover:text-aqua focus-visible:text-aqua active:opacity-70"
    >
      <Avatar name={name} photo={photo} accent={accent} className="h-7 w-7 ring-1 ring-line transition-[box-shadow] group-hover:ring-aqua" />
      <span className="leading-tight">
        {name}
        {sub && <span className="small block text-muted">{sub}</span>}
      </span>
    </Link>
  );
}

// Rundes Mini-Porträt: Foto oder Initialen in der Profilfarbe.
export function Avatar({ name, photo, accent, className = "" }: { name: string; photo?: string; accent: string; className?: string }) {
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center overflow-hidden rounded-full ${className}`} style={{ background: `color-mix(in oklab, ${accent} 22%, var(--color-raised))` }}>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" width={64} height={64} loading="lazy" className="h-full w-full object-cover object-top" />
      ) : (
        <span className="text-[0.625rem] font-semibold" style={{ color: accent }}>{initials(name)}</span>
      )}
    </span>
  );
}
