// Leistungen als ruhige Zweispalten-Liste: Name links, Beschreibung rechts.
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
    <section aria-label={title} className="wrap grid grid-cols-12 gap-x-8 py-[var(--section)]">
      <div className="col-span-12 md:col-span-4">
        <h2 className="head" data-reveal>
          {title}
        </h2>
        {intro && (
          <p className="mt-6 max-w-[28rem]" data-reveal style={{ ["--i" as string]: 1 }}>
            {intro}
          </p>
        )}
      </div>
      <dl className="col-span-12 mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 md:col-span-7 md:col-start-6 md:mt-0">
        {items.map((f, i) => (
          <div key={f.name} data-reveal style={{ ["--i" as string]: i + 1 }}>
            <dt className="lead font-display">{f.name}</dt>
            <dd className="mt-3 max-w-[34ch]">{f.desc}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
