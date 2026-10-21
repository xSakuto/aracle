// Wofür Aracle steht, Wort für Wort beim Scrollen. Dahinter werden die Partikel zu Bergen.
export default function Manifesto() {
  return (
    <section aria-labelledby="manifest-title" data-shape="mountains" className="wrap py-[var(--section)]">
      <h2 id="manifest-title" className="kicker text-aqua">Wer wir sind</h2>
      <p
        data-scrub-words
        className="mt-8 max-w-[22ch] text-[clamp(2rem,1rem+3.6vw,5rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.01em] [font-stretch:115%]"
      >
        Ein kleines Studio zwischen Glärnisch und Linth. Wir filmen, gestalten,
        programmieren und betreiben eigene Server. Und wir bauen eigene Marken,
        um zu zeigen, dass es funktioniert.
      </p>
    </section>
  );
}
