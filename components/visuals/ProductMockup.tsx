// PLATZHALTER-GRAFIKEN für Highside-Produkte.
// Bewusst als Linienzeichnung im Stil der Alpine Line Art gehalten, damit sie
// nicht als echte Produktfotos missverstanden werden. Ersetzen, sobald Fotos da sind
// (in data/projects.ts den Galerie-Eintrag von "placeholder" auf "photo" umstellen).

type Motif = "tee" | "hoodie" | "patch" | "label" | "wordmark";

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, vectorEffect: "non-scaling-stroke" as const };

function Tee() {
  return (
    <g>
      <path {...stroke} d="M150 70 L200 50 Q230 78 260 50 L310 70 L360 130 L325 155 L300 130 L300 330 L160 330 L160 130 L135 155 L100 130 Z" />
      <path {...stroke} d="M200 50 Q230 92 260 50" />
      <text x="230" y="192" textAnchor="middle" textLength={104} lengthAdjust="spacingAndGlyphs" className="mock-word">HIGHSIDE</text>
      <path {...stroke} strokeOpacity={0.5} d="M196 212 L205 202 L214 205 L226 188 L240 206 L250 198 L270 210" />
    </g>
  );
}

function Hoodie() {
  return (
    <g>
      <path {...stroke} d="M160 90 Q230 20 300 90 L360 150 L330 330 L300 330 L300 345 L160 345 L160 330 L130 330 L100 150 Z" />
      <path {...stroke} d="M185 92 Q230 140 275 92" />
      <path {...stroke} strokeOpacity={0.6} d="M215 120 L212 170 M245 120 L248 170" />
      <path {...stroke} d="M180 255 L280 255 L290 300 L170 300 Z" />
      <text x="230" y="215" textAnchor="middle" textLength={124} lengthAdjust="spacingAndGlyphs" className="mock-word">HIGHSIDE</text>
    </g>
  );
}

function Patch() {
  return (
    <g>
      <circle {...stroke} cx="230" cy="190" r="120" />
      <circle {...stroke} strokeOpacity={0.5} cx="230" cy="190" r="106" strokeDasharray="4 6" />
      <path {...stroke} d="M140 225 L178 170 L196 192 L222 140 L252 196 L268 178 L320 225" />
      <text x="230" y="258" textAnchor="middle" textLength={124} lengthAdjust="spacingAndGlyphs" className="mock-word">HIGHSIDE</text>
      <text x="230" y="134" textAnchor="middle" textLength={128} lengthAdjust="spacingAndGlyphs" className="mock-small">SWISS BIKER STREETWEAR</text>
    </g>
  );
}

function Label() {
  return (
    <g>
      <rect {...stroke} x="120" y="110" width="220" height="150" rx="4" />
      <path {...stroke} strokeOpacity={0.5} d="M120 140 L340 140 M120 230 L340 230" />
      <text x="230" y="194" textAnchor="middle" className="mock-word">HIGHSIDE</text>
      <text x="230" y="130" textAnchor="middle" className="mock-small">EST. 2024</text>
      <text x="230" y="250" textAnchor="middle" className="mock-small">MADE FOR THE CURVE</text>
    </g>
  );
}

function Wordmark() {
  return (
    <g>
      <text x="230" y="205" textAnchor="middle" className="mock-word mock-word-xl">HIGHSIDE</text>
      <path {...stroke} strokeOpacity={0.6} d="M100 240 Q230 280 360 240" />
    </g>
  );
}

export default function ProductMockup({
  motif,
  caption,
  className = "",
}: {
  motif: Motif;
  caption?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={caption ? `Platzhalter: ${caption}` : "Platzhalter-Grafik"}
      className={`mockup relative flex items-center justify-center overflow-hidden bg-[#1a1512] text-glow ${className}`}
    >
      <svg viewBox="0 0 460 380" className="h-[78%] w-[78%]" aria-hidden>
        {motif === "tee" && <Tee />}
        {motif === "hoodie" && <Hoodie />}
        {motif === "patch" && <Patch />}
        {motif === "label" && <Label />}
        {motif === "wordmark" && <Wordmark />}
      </svg>
      {caption && (
        <span className="absolute bottom-3 left-3 rounded-full border border-glow/30 px-2.5 py-1 text-[0.6875rem] tracking-[0.02em] text-glow/80">
          {caption}
        </span>
      )}
    </div>
  );
}
