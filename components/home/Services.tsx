const services = [
  { name: "Video & Drohne", desc: "Social-Clips, Imagefilme, Luftaufnahmen. Geplant, gedreht und geschnitten im Haus." },
  { name: "Design & Branding", desc: "Logo, Farben, Schrift und alles, was eine Marke wiedererkennbar macht." },
  { name: "Web", desc: "Schnelle Websites und Web-Apps, sauber gebaut und einfach zu pflegen." },
  { name: "Hosting", desc: "Auf eigenen Servern in der Schweiz. Updates, Backups, Monitoring inklusive." },
  { name: "Immobilien", desc: "Fotos, 360°-Rundgänge und Luftbilder für die Vermarktung, mit Aracle Living." },
  { name: "Social Content", desc: "Kurzvideos für TikTok und Instagram, die nach Mensch aussehen statt nach Werbung." },
];

export default function Services() {
  return (
    <section aria-labelledby="services-title" className="wrap py-[var(--section)]">
      <div className="inner">
        <div className="mx-auto max-w-[44rem] text-center">
          <h2 id="services-title" className="head" data-reveal>
            Alles aus einer Hand.
          </h2>
          <p className="lead mt-4 text-muted" data-reveal style={{ ["--i" as string]: 1 }}>
            Vom ersten Bild bis zum Server, auf dem es läuft. Ein Team, ein
            Ansprechpartner.
          </p>
        </div>
        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <li key={s.name} className="tile p-8" data-reveal style={{ ["--i" as string]: i % 3 }}>
              <h3 className="text-[1.3125rem] leading-tight tracking-[-0.02em]">{s.name}</h3>
              <p className="mt-3 text-muted">{s.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
