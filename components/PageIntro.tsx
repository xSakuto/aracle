// Kopf einer Unterseite: Kicker und Titel links, Erklärung rechts, darunter ein grosses Bild.
export default function PageIntro({
  kicker,
  title,
  lead,
  image,
  children,
}: {
  kicker?: string;
  title: string;
  lead: string;
  image?: { src: string; alt: string; width: number; height: number };
  children?: React.ReactNode;
}) {
  return (
    <header className="wrap pt-28 md:pt-36">
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          {kicker && <p className="kicker text-aqua" data-rise>{kicker}</p>}
          <h1 className="mega mt-5" data-split="load">{title}</h1>
        </div>
        <div className="md:col-span-4" data-rise style={{ ["--i" as string]: 2 }}>
          <p className="text-ink/85">{lead}</p>
          {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
      {image && (
        <div className="mt-12 overflow-hidden rounded-[var(--radius)] md:mt-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            fetchPriority="high"
            data-clip
            className="aspect-[4/5] w-full object-cover sm:aspect-[21/9]"
          />
        </div>
      )}
    </header>
  );
}
