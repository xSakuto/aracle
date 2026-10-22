// Schweizer Fahne: quadratisch, Kreuzarme 1/6 länger als breit (Bundesgesetz über den Schutz
// des Schweizerwappens). Auf 32 Einheiten: Arme 6 breit, 7 lang, Kreuz gesamt 20.
export default function SwissFlag({ className = "", title = "Schweiz" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 32 32" role="img" aria-label={title} className={`shrink-0 ${className}`}>
      <rect width="32" height="32" fill="#da291c" />
      <path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" fill="#fff" />
    </svg>
  );
}
