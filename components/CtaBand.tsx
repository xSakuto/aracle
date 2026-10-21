import Link from "next/link";

// Abschluss einer Unterseite auf dem Gletscher-Feld.
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
    <section
      aria-label={title}
      className="wrap grid grid-cols-12 gap-x-8 gap-y-6 bg-field py-[calc(var(--section)*0.6)]"
    >
      <h2 className="head col-span-12 md:col-span-6" data-reveal>
        {title}
      </h2>
      <div className="col-span-12 md:col-span-5 md:col-start-8" data-reveal style={{ ["--i" as string]: 1 }}>
        <p>{text}</p>
        <Link href={href} className="btn mt-8">
          {action}
        </Link>
      </div>
    </section>
  );
}
