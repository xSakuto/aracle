import Ridge from "@/components/alpine/Ridge";
import { initials } from "@/lib/initials";
import { meters } from "@/lib/panorama";
import { GLAERNISCH } from "@/data/panorama/glaernisch";
import { TOEDI } from "@/data/panorama/toedi";
import { WIGGIS } from "@/data/panorama/wiggis";

// Gipfel für Profile ohne Foto. Fest pro Name, damit jede Person immer denselben Berg hat.
const PEAKS = [
  { view: TOEDI, peak: "Tödi", name: "Tödi", m: 3614 },
  { view: GLAERNISCH, peak: "Vrenelisgärtli", name: "Glärnisch", m: 2904 },
  { view: WIGGIS, peak: "Wiggis", name: "Wiggis", m: 2282 },
];

function peakFor(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PEAKS[h % PEAKS.length];
}

// Porträt eines Teammitglieds. Ohne Foto: ein Glarner Gipfel als Linienzeichnung,
// leise in der eigenen Profilfarbe, mit den Initialen oben links.
export default function Portrait({
  name,
  photo,
  accent,
  className = "",
  sizes = "(min-width: 768px) 30vw, 72vw",
  eager = false,
  small = false,
}: {
  name: string;
  photo?: string;
  accent: string;
  className?: string;
  sizes?: string;
  eager?: boolean;
  /** Kleine Vorschau: ohne Beschriftung */
  small?: boolean;
}) {
  if (photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt={`Porträt von ${name}`}
        width={800}
        height={1000}
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        className={`aspect-[4/5] w-full object-cover object-top ${className}`}
      />
    );
  }

  const pk = peakFor(name);
  const pos = pk.view.peaks.find((p) => p.name === pk.peak);
  const yMax = 250;
  const w = yMax * 1.25;
  const x0 = Math.max(0, Math.min(pk.view.w - w, (pos?.x ?? pk.view.w / 2) - w / 2));

  return (
    <div
      role="img"
      aria-label={`${name}, noch ohne Foto`}
      className={`portrait-empty @container relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden ${className}`}
      style={{ background: `color-mix(in oklab, ${accent} 8%, #121a1f)` }}
    >
      {!small && (
        <span
          aria-hidden
          data-initials={initials(name)}
          className="portrait-initials relative p-[7%] font-[family-name:var(--font-display)] text-[clamp(1.25rem,12cqi,3.25rem)] font-bold leading-none tracking-[-0.03em]"
          style={{ color: `color-mix(in oklab, ${accent} 35%, #9aa8ad)` }}
        />
      )}
      <div aria-hidden className="relative my-auto pb-[18%]" style={{ color: `color-mix(in oklab, ${accent} 30%, #c9d3d5)` }}>
        <Ridge data={pk.view} peak={pk.peak} depths={[2, 1]} yMax={yMax} x0={x0} x1={x0 + w} drawn className="w-full" />
        {!small && (
          <p className="nums absolute right-[7%] top-0 text-[clamp(0.625rem,4cqi,0.8125rem)] text-ink/60">
            {pk.name} {meters(pk.m)} m
          </p>
        )}
      </div>
    </div>
  );
}
