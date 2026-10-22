import Contours from "@/components/alpine/Contours";
import Ridge from "@/components/alpine/Ridge";
import { KAERPF } from "@/data/panorama/kaerpf";
import { meters } from "@/lib/panorama";
import { MOUNTAINS, type Mountain } from "@/lib/mountains";

/**
 * Gipfelmarke eines Bereichs: Ausschnitt um den Gipfel, gleiches Seitenverhältnis
 * für alle vier Berge, damit sie nebeneinander als System lesbar sind.
 */
export default function PillarMark({
  mountain,
  ratio = 8 / 3,
  caption = true,
  className = "",
}: {
  mountain: Mountain | Mountain["key"];
  ratio?: number;
  caption?: boolean;
  className?: string;
}) {
  const mt = typeof mountain === "string" ? MOUNTAINS[mountain] : mountain;
  let art;
  if (mt.view) {
    const pk = mt.view.peaks.find((p) => p.name === mt.peak)!;
    const yMax = 250;
    const w = yMax * ratio;
    const x0 = Math.max(0, Math.min(mt.view.w - w, pk.x - w / 2));
    art = <Ridge data={mt.view} peak={mt.peak} depths={[2, 1]} yMax={yMax} x0={x0} x1={x0 + w} className="w-full" />;
  } else {
    // Höhenkarte 2.6-fach vergrössert, Gipfel in der Mitte
    const k = 2.6;
    const mh = KAERPF.h / KAERPF.w;
    const sx = KAERPF.summit.x / KAERPF.w;
    const sy = KAERPF.summit.y / KAERPF.h;
    art = (
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: ratio }}>
        <div
          className="absolute"
          style={{
            width: `${k * 100}%`,
            left: `${50 - k * 100 * sx}%`,
            top: `${(0.5 - k * mh * sy * ratio) * 100}%`,
          }}
        >
          <Contours label={false} />
        </div>
      </div>
    );
  }
  return (
    <figure className={className}>
      <div>{art}</div>
      {caption && (
        <figcaption className="mt-3 flex items-baseline justify-between text-[0.6875rem] text-muted">
          <span className="font-medium text-ink/80">{mt.name}</span>
          <span className="nums">
            {mt.peak !== mt.name ? `${mt.peak} ` : ""}
            {meters(mt.m)} m · {mt.from}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
