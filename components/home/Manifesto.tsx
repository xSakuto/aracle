// Wofür Aracle steht, Wort für Wort beim Scrollen.
export default function Manifesto() {
  return (
    <section aria-labelledby="manifest-title" className="wrap grid gap-8 py-[var(--section)] md:grid-cols-12">
      <h2 id="manifest-title" className="kicker text-aqua md:col-span-3 md:pt-3">Wer mir sind</h2>
      <p
        data-scrub-words
        className="max-w-[26ch] text-[clamp(1.875rem,1rem+2.8vw,4rem)] font-[560] leading-[1.06] tracking-[-0.035em] md:col-span-9"
      >
        Ein kleines Studio zwischen Glärnisch und Linth. Wir filmen,
        gestalten, programmieren und betreiben unsere eigenen Server.
        Ehrlich, sauber, mit Schweizer Präzision und ohne leere Versprechen.
      </p>
    </section>
  );
}
