import Portrait from "@/components/Portrait";

// Porträt erst schwarzweiss, die Farbversion liegt darüber und blendet ein:
// beim Überfahren der Karte (.duo-host) oder auf Touch-Geräten, sobald sie im Bild ist (.is-lit).
// Bewegt werden nur opacity und transform.
export default function DuoPortrait({
  name,
  photo,
  accent,
  sizes,
  className = "",
}: {
  name: string;
  photo?: string;
  accent: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <div className={`duo relative overflow-hidden ${className}`}>
      <Portrait name={name} photo={photo} accent={accent} sizes={sizes} className="duo-base" />
      <div aria-hidden className="duo-color absolute inset-0">
        <Portrait name={name} photo={photo} accent={accent} sizes={sizes} />
      </div>
    </div>
  );
}
