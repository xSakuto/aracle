import Link from "next/link";

// Drei echte Zahlen, die hochzählen.
export default function Numbers({ people, projects }: { people: number; projects: number }) {
  const facts = [
    { value: 2017, from: 1999, label: "Angefangen mit einem YouTube-Kanal" },
    { value: projects, from: 0, label: "Marken und Projekte seither" },
    { value: people, from: 0, label: "Leute im Team" },
  ];
  return (
    <section aria-labelledby="numbers-title" className="wrap py-[var(--section)]">
      <p className="kicker text-aqua">Seit 2017</p>
      <h2 id="numbers-title" className="head mt-4 max-w-[18ch]" data-split>
        From a Minecraft server to a studio.
      </h2>
      <dl className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
        {facts.map((f) => (
          <div key={f.label} data-reveal>
            <dt className="sr-only">{f.label}</dt>
            <dd
              data-count={f.value}
              data-count-from={f.from}
              className="nums border-t border-line pt-6 font-[family-name:var(--font-display)] text-[clamp(4rem,2rem+6vw,8rem)] font-[600] leading-[0.9] tracking-[-0.05em]"
            >
              {f.value}
            </dd>
            <dd className="lead mt-4 text-muted">{f.label}</dd>
          </div>
        ))}
      </dl>
      <Link href="/history" className="link-under mt-12 inline-flex min-h-11 items-center font-semibold">
        The Aracle Journey
      </Link>
    </section>
  );
}
