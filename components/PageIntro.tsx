// Kopf einer Unterseite: Titel gross links, Bild rechts (falls vorhanden).
export default function PageIntro({
  title,
  lead,
  image,
  children,
}: {
  title: string;
  lead: string;
  image?: { src: string; alt: string; width: number; height: number };
  children?: React.ReactNode;
}) {
  return (
    <header className="wrap grid grid-cols-12 items-end gap-x-8 gap-y-10 pb-[calc(var(--section)/2)] pt-32 md:pt-40">
      <div className={image ? "col-span-12 md:col-span-7" : "col-span-12 md:col-span-9"}>
        <h1 className="display" data-rise>
          {title}
        </h1>
        <p className="lead mt-8 max-w-[36rem]" data-rise style={{ ["--i" as string]: 1 }}>
          {lead}
        </p>
        {children && (
          <div className="mt-10" data-rise style={{ ["--i" as string]: 2 }}>
            {children}
          </div>
        )}
      </div>
      {image && (
        <div className="col-span-12 overflow-hidden md:col-span-5" data-rise style={{ ["--i" as string]: 2 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="drift aspect-[4/5] w-full object-cover"
          />
        </div>
      )}
    </header>
  );
}
