import { initials } from "@/lib/initials";

// Porträt eines Teammitglieds. Ohne Foto: eine Fläche in der eigenen
// Profilfarbe mit den Initialen, bis ein Bild hochgeladen ist.
export default function Portrait({
  name,
  photo,
  accent,
  className = "",
  sizes = "(min-width: 768px) 30vw, 72vw",
  eager = false,
}: {
  name: string;
  photo?: string;
  accent: string;
  className?: string;
  sizes?: string;
  eager?: boolean;
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
  return (
    <div
      role="img"
      aria-label={`${name}, noch ohne Foto`}
      className={`portrait-empty relative flex aspect-[4/5] w-full items-end overflow-hidden ${className}`}
      style={{ background: `color-mix(in oklab, ${accent} 9%, #121a1f)` }}
    >
      {/* Leise Fläche in der Profilfarbe, damit ein fehlendes Foto nicht lauter ist als ein echtes */}
      <span
        aria-hidden
        data-initials={initials(name)}
        className="portrait-initials display relative -mb-[0.1em] pl-[6%] leading-none"
        style={{ color: `color-mix(in oklab, ${accent} 30%, #6f7f86)` }}
      />
    </div>
  );
}
