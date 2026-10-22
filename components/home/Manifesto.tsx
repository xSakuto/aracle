// Haltung: ein Satz auf Englisch, die Erklärung auf Deutsch, Wort für Wort beim Scrollen.
export default function Manifesto() {
  return (
    <section aria-labelledby="manifest-title" className="wrap grid gap-8 py-[var(--section)] md:grid-cols-12">
      <div className="md:col-span-4">
        <p className="kicker text-aqua">Haltung</p>
        <h2 id="manifest-title" className="head mt-4 max-w-[14ch]" data-split>
          Swiss precision meets creative technology.
        </h2>
      </div>
      <p
        data-scrub-words
        className="max-w-[28ch] text-[clamp(1.75rem,1rem+2.4vw,3.5rem)] font-[540] leading-[1.08] tracking-[-0.035em] md:col-span-8"
      >
        Wir sind ein kleines Studio zwischen Glärnisch und Linth. Wir filmen,
        gestalten, entwickeln und betreiben unsere eigenen Server. Ohne leere
        Versprechen, dafür mit Sorgfalt in jedem Detail.
      </p>
    </section>
  );
}
