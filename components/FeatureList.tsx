// Leistungen als Kacheln.
export default function FeatureList({
  title,
  intro,
  items,
}: {
  title: string;
  intro?: string;
  items: { name: string; desc: string }[];
}) {
  return (
    <section aria-label={title} className="wrap py-[var(--section)]">
      <div className="inner">
        <div className="mx-auto max-w-[44rem] text-center">
          <h2 className="head" data-reveal>
            {title}
          </h2>
          {intro && (
            <p className="lead mt-4 text-muted" data-reveal style={{ ["--i" as string]: 1 }}>
              {intro}
            </p>
          )}
        </div>
        <dl className="mt-14 grid gap-3 sm:grid-cols-2">
          {items.map((f, i) => (
            <div key={f.name} className="tile p-8 md:p-10" data-reveal style={{ ["--i" as string]: i % 2 }}>
              <dt className="text-[1.3125rem] font-semibold leading-tight tracking-[-0.02em]">{f.name}</dt>
              <dd className="mt-3 text-muted">{f.desc}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
