// Kopf einer Unterseite: Titel zentriert, darunter ein grosses Bild.
export default function PageIntro({
  title,
  lead,
  image,
  children,
  shape = "sphere",
}: {
  title: string;
  lead: string;
  image?: { src: string; alt: string; width: number; height: number };
  children?: React.ReactNode;
  shape?: string;
}) {
  return (
    <header data-shape={shape} className="wrap pt-28 md:pt-36">
      <div className="inner text-center">
        <h1 className="display mx-auto max-w-[16ch]" data-split="load">
          {title}
        </h1>
        <p className="lead mx-auto mt-5 max-w-[38rem] text-muted" data-rise style={{ ["--i" as string]: 1 }}>
          {lead}
        </p>
        {children && (
          <div className="mt-8 flex flex-wrap justify-center gap-3" data-rise style={{ ["--i" as string]: 2 }}>
            {children}
          </div>
        )}
      </div>
      {image && (
        <div className="inner mt-12 overflow-hidden rounded-[var(--radius)] md:mt-16" data-rise style={{ ["--i" as string]: 2 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            fetchPriority="high"
            data-clip
            className="aspect-[4/5] w-full object-cover sm:aspect-[16/9]"
          />
        </div>
      )}
    </header>
  );
}
