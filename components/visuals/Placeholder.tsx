// PLATZHALTER für fehlende Bilder auf Projektseiten.
// Linienzeichnung im Stil der Alpine Line Art, damit niemand sie für ein echtes
// Bild hält. Ersetzen: in data/projects.ts den Galerie-Eintrag von
// { kind: "placeholder" } auf { kind: "photo", src, alt, width, height } umstellen.

export type PlaceholderMotif = "screen" | "phone" | "photo" | "video";

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, vectorEffect: "non-scaling-stroke" as const };

function Ridge() {
  return <path {...s} strokeOpacity={0.55} d="M40 250 L110 180 L140 205 L200 130 L250 190 L280 165 L360 250" />;
}

function Motif({ motif }: { motif: PlaceholderMotif }) {
  switch (motif) {
    case "screen":
      return (
        <g>
          <rect {...s} x="70" y="70" width="260" height="170" rx="6" />
          <path {...s} strokeOpacity={0.5} d="M70 92 L330 92" />
          <circle {...s} strokeOpacity={0.5} cx="84" cy="81" r="3" />
          <circle {...s} strokeOpacity={0.5} cx="96" cy="81" r="3" />
          <path {...s} strokeOpacity={0.45} d="M92 120 L200 120 M92 138 L250 138 M92 156 L170 156" />
          <rect {...s} strokeOpacity={0.45} x="232" y="160" width="76" height="58" rx="3" />
          <path {...s} d="M170 262 L230 262" />
        </g>
      );
    case "phone":
      return (
        <g>
          <rect {...s} x="150" y="40" width="100" height="210" rx="16" />
          <path {...s} strokeOpacity={0.5} d="M185 54 L215 54" />
          <path {...s} strokeOpacity={0.45} d="M166 90 L234 90 M166 106 L220 106" />
          <rect {...s} strokeOpacity={0.45} x="166" y="124" width="68" height="44" rx="4" />
          <path {...s} strokeOpacity={0.45} d="M166 186 L234 186 M166 202 L206 202" />
        </g>
      );
    case "video":
      return (
        <g>
          <rect {...s} x="60" y="70" width="280" height="160" rx="6" />
          <Ridge />
          <circle {...s} cx="200" cy="150" r="30" />
          <path {...s} d="M190 135 L215 150 L190 165 Z" />
        </g>
      );
    default:
      return (
        <g>
          <rect {...s} x="60" y="60" width="280" height="190" rx="4" />
          <circle {...s} strokeOpacity={0.6} cx="290" cy="105" r="14" />
          <Ridge />
        </g>
      );
  }
}

export default function Placeholder({
  motif = "photo",
  caption,
  className = "",
}: {
  motif?: PlaceholderMotif;
  caption?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={caption ? `Platzhalter: ${caption}` : "Platzhalter-Grafik"}
      className={`relative flex items-center justify-center overflow-hidden border border-dashed border-line bg-surface text-aqua/70 ${className}`}
    >
      <div aria-hidden className="swiss-grid pointer-events-none absolute inset-0 opacity-40" />
      <svg viewBox="0 0 400 300" className="relative h-[74%] w-[74%]" aria-hidden>
        <Motif motif={motif} />
      </svg>
      {caption && (
        <span className="absolute bottom-3 left-3 right-3 truncate text-[0.75rem] text-muted">{caption}</span>
      )}
    </div>
  );
}
