import Link from "next/link";

// Drei echte Zahlen, die hochzählen.
export default function Numbers({ people, projects }: { people: number; projects: number }) {
  const facts = [
    { value: 2017, from: 1999, label: "Angefangen mit einem YouTube-Kanal" },
    { value: projects, from: 0, label: "Marken und Projekte seither" },
    { value: people, from: 0, label: "Leute im Team" },
  ];
  return (
    <section aria-labelledby="numbers-title" data-shape="room" className="wrap py-[var(--section)]">
      <h2 id="numbers-title" className="kicker text-aqua">Vom Minecraft-Server zum Studio</h2>
      <dl className="mt-10 grid gap-12 md:grid-cols-3">
        {facts.map((f) => (
          <div key={f.label} data-reveal>
            <dt className="sr-only">{f.label}</dt>
            <dd
              data-count={f.value}
              data-count-from={f.from}
              className="nums text-[clamp(4.5rem,2rem+8vw,10rem)] font-black leading-[0.85] tracking-[-0.03em] [font-stretch:125%]"
            >
              {f.value}
            </dd>
            <dd className="lead mt-4 text-muted">{f.label}</dd>
          </div>
        ))}
      </dl>
      <Link href="/history" className="link-under mt-12 inline-flex min-h-11 items-center font-semibold" data-cursor="Lesen">
        Die ganze Geschichte
      </Link>
    </section>
  );
}
