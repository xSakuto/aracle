import Link from "next/link";

// Die Geschichte in drei echten Zahlen.
export default function Facts({ people, projects }: { people: number; projects: number }) {
  const facts = [
    { value: "2017", label: "Angefangen mit einem YouTube-Kanal" },
    { value: String(projects), label: "Marken und Projekte seither" },
    { value: String(people), label: "Leute im Team" },
  ];
  return (
    <section aria-labelledby="facts-title" className="wrap py-3">
      <div className="inner tile px-6 py-[calc(var(--section)*0.8)] text-center">
        <h2 id="facts-title" className="head mx-auto max-w-[18ch]" data-reveal>
          Vom Minecraft-Server zum Studio.
        </h2>
        <dl className="mx-auto mt-14 grid max-w-[56rem] gap-10 sm:grid-cols-3">
          {facts.map((f, i) => (
            <div key={f.label} data-reveal style={{ ["--i" as string]: i }}>
              <dt className="sr-only">{f.label}</dt>
              <dd className="nums text-[clamp(3rem,2rem+3vw,4.5rem)] font-semibold leading-none tracking-[-0.04em]">
                {f.value}
              </dd>
              <dd className="mt-3 text-muted">{f.label}</dd>
            </div>
          ))}
        </dl>
        <Link href="/history" className="link-under mt-12 inline-flex min-h-11 items-center" data-reveal>
          Die ganze Geschichte
        </Link>
      </div>
    </section>
  );
}
