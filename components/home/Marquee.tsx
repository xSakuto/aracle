import SwissCross from "@/components/swiss/SwissCross";

const items = ["Video", "Design", "Web", "Hosting", "Immobilien", "Drohne", "Branding", "Social Content"];

// Ruhiges Laufband zwischen feinen Linien, Schweizerkreuz als Trenner.
export default function Marquee({ reverse = false }: { reverse?: boolean }) {
  const row = (
    <>
      {items.map((t) => (
        <span key={t} className="flex items-center gap-10">
          <span>{t}</span>
          <SwissCross className="h-[0.5em] w-[0.5em] opacity-90" />
        </span>
      ))}
    </>
  );
  return (
    <div className="relative z-10 border-y border-line py-5" aria-hidden>
      <div data-marquee={reverse ? "reverse" : ""} className="marquee">
        <div className="marquee-track text-[clamp(1.5rem,1rem+2vw,2.75rem)] font-medium leading-none tracking-[-0.03em] text-ink/80">
          {row}
        </div>
        <div className="marquee-track text-[clamp(1.5rem,1rem+2vw,2.75rem)] font-medium leading-none tracking-[-0.03em] text-ink/80">
          {row}
        </div>
      </div>
    </div>
  );
}
