import Link from "next/link";
import { team, type Member, type SocialType } from "@/data/team";

export const metadata = {
  title: "Team · Aracle",
  description: "Die Köpfe hinter dem Aracle Creative Studio.",
};

const socialPaths: Record<SocialType, string> = {
  x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  discord:
    "M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 14.09 14.09 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.2 13.2 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.094.252-.192.372-.291a.072.072 0 0 1 .077-.01c3.927 1.764 8.18 1.764 12.061 0a.072.072 0 0 1 .078.009c.12.099.246.198.373.292a.075.075 0 0 1-.006.125c-.598.35-1.22.642-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.964 19.964 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z",
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
};

function Socials({ member }: { member: Member }) {
  return (
    <div className="flex gap-2.5">
      {member.socials.map((s) => (
        <a
          key={s.type}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.type}
          className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition hover:border-aqua/40 hover:text-aqua"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d={socialPaths[s.type]} />
          </svg>
        </a>
      ))}
    </div>
  );
}

function Avatar({ member, size }: { member: Member; size: number }) {
  return (
    <div
      className="grid shrink-0 place-items-center rounded-2xl font-bold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        color: member.accent,
        background: `linear-gradient(135deg, ${member.accent}2e, ${member.accent}0d)`,
        border: `1px solid ${member.accent}40`,
      }}
    >
      {member.initials}
    </div>
  );
}

export default function TeamPage() {
  const lead = team.find((m) => m.lead) ?? team[0];
  const rest = team.filter((m) => m !== lead);

  return (
    <div className="px-6 pb-28 pt-36 md:px-12">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-aqua">
          <span className="h-px w-8 bg-aqua/60" /> Das Team
        </div>
        <h1 className="text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.96] tracking-[-0.04em]">
          Die Köpfe hinter Aracle<span className="text-gradient">.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-dim">
          Ein kleines Studio mit klaren Rollen. Jede:r führt eigene Bereiche
          und Projekte mit vollem Einsatz.
        </p>

        {/* Lead */}
        <div
          id={lead.slug}
          className="mt-16 grid scroll-mt-28 overflow-hidden rounded-3xl border border-line bg-surface md:grid-cols-[0.72fr_1fr]"
        >
          {lead.photo ? (
            <div
              className="min-h-[20rem] bg-cover bg-top md:min-h-full"
              style={{ backgroundImage: `url(${lead.photo})` }}
              role="img"
              aria-label={lead.name}
            />
          ) : (
            <div className="grid min-h-[20rem] place-items-center">
              <Avatar member={lead} size={140} />
            </div>
          )}
          <div className="flex flex-col justify-center p-8 md:p-12">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-aqua">
              {lead.role}
            </span>
            <h2 className="mt-2 text-[clamp(2.4rem,4vw,3.4rem)] font-bold tracking-tight">
              {lead.name}
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-dim">
              {lead.bio}
            </p>
            <div className="mt-7">
              <Socials member={lead} />
            </div>
          </div>
        </div>

        {/* Rest */}
        <div className="mt-6 flex flex-col gap-4">
          {rest.map((m) => (
            <div
              key={m.slug}
              id={m.slug}
              className="group flex scroll-mt-28 flex-col gap-5 rounded-2xl border border-line bg-surface/60 p-6 transition hover:border-aqua/30 hover:bg-surface sm:flex-row sm:items-center sm:gap-7"
            >
              <Avatar member={m} size={72} />
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h3 className="text-xl font-bold tracking-tight">{m.name}</h3>
                  <span className="text-sm font-semibold text-aqua">
                    {m.role}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                  {m.bio}
                </p>
              </div>
              <div className="opacity-70 transition group-hover:opacity-100">
                <Socials member={m} />
              </div>
            </div>
          ))}
        </div>

        {/* Wir wachsen */}
        <div className="mt-6 flex flex-col items-start gap-5 rounded-2xl border border-dashed border-aqua/30 bg-aqua/[0.04] p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Wir wachsen.</h3>
            <p className="mt-1 max-w-md text-sm text-muted">
              Du kannst etwas richtig gut und willst Teil von Aracle werden?
              Schreib uns, wir freuen uns.
            </p>
          </div>
          <Link
            href="/kontakt"
            className="shrink-0 rounded-lg bg-aqua px-5 py-2.5 text-sm font-bold text-black transition hover:-translate-y-px hover:opacity-90"
          >
            Mitmachen →
          </Link>
        </div>
      </div>
    </div>
  );
}
