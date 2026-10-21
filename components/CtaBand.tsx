import Link from "next/link";

// Abschluss einer Unterseite: eine ruhige Kachel mit einer Aktion.
export default function CtaBand({
  title,
  text,
  action,
  href = "/kontakt",
}: {
  title: string;
  text: string;
  action: string;
  href?: string;
}) {
  return (
    <section aria-label={title} className="wrap pb-[var(--section)]">
      <div className="inner tile px-6 py-[calc(var(--section)*0.7)] text-center">
        <h2 className="head" data-reveal>
          {title}
        </h2>
        <p className="lead mx-auto mt-4 max-w-[36rem] text-muted" data-reveal style={{ ["--i" as string]: 1 }}>
          {text}
        </p>
        <Link href={href} className="btn mt-8" data-reveal style={{ ["--i" as string]: 2 }}>
          {action}
        </Link>
      </div>
    </section>
  );
}
