const items = ["Video", "Design", "Web", "Hosting", "Immobilien", "Content", "Drohne", "Branding"];

function Peak() {
  // Kleiner Berggipfel als Trenner, aus dem Aracle-Zeichen abgeleitet
  return (
    <svg viewBox="0 0 40 28" className="h-[0.55em] w-auto shrink-0" aria-hidden>
      <path d="M0 28 L14 6 L20 15 L26 4 L40 28 Z" fill="currentColor" />
    </svg>
  );
}

// Aqua-Band, leicht schräg, läuft endlos und zieht beim Scrollen an.
export default function Marquee({ reverse = false, tilt = -2.5 }: { reverse?: boolean; tilt?: number }) {
  const row = (
    <>
      {items.map((t) => (
        <span key={t} className="flex items-center gap-10">
          <span>{t}</span>
          <Peak />
        </span>
      ))}
    </>
  );
  return (
    <div className="relative z-10 -mx-4 overflow-hidden py-10" aria-hidden>
      <div
        data-marquee={reverse ? "reverse" : ""}
        className="marquee bg-aqua py-4 text-accent-ink md:py-5"
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        <div className="marquee-track text-[clamp(2rem,1rem+4vw,4.5rem)] font-black uppercase leading-none [font-stretch:125%]">
          {row}
        </div>
        <div className="marquee-track text-[clamp(2rem,1rem+4vw,4.5rem)] font-black uppercase leading-none [font-stretch:125%]">
          {row}
        </div>
      </div>
    </div>
  );
}
