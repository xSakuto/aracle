import SocialIcon from "@/components/SocialIcon";
import { SOCIAL_LABELS, type Social } from "@/data/socials";

// Socials und öffentliche Mail einer Person als ruhige Icon-Reihe.
export default function ContactLinks({
  name,
  socials,
  email,
  className = "",
}: {
  name: string;
  socials: Social[];
  email?: string;
  className?: string;
}) {
  if (!socials.length && !email) return null;
  const cls =
    "grid h-10 w-10 place-items-center text-muted transition-[color,transform] duration-200 hover:text-aqua focus-visible:text-aqua active:scale-90";
  return (
    <ul className={`-ml-2.5 flex flex-wrap ${className}`}>
      {email && (
        <li>
          <a href={`mailto:${email}`} aria-label={`${name} per E-Mail an ${email}`} title={email} className={cls}>
            <svg viewBox="0 0 24 24" aria-hidden className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="2.5" y="4.5" width="19" height="15" rx="1.5" />
              <path d="m3 6 9 7 9-7" />
            </svg>
          </a>
        </li>
      )}
      {socials.map((s) => (
        <li key={s.type + s.url}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} auf ${SOCIAL_LABELS[s.type]}`}
            title={SOCIAL_LABELS[s.type]}
            className={cls}
          >
            <SocialIcon type={s.type} className="h-[18px] w-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
