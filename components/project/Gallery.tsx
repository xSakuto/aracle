"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProductMockup from "@/components/visuals/ProductMockup";
import Placeholder from "@/components/visuals/Placeholder";
import type { GalleryItem } from "@/data/projects";

type Photo = Extract<GalleryItem, { kind: "photo" }>;

// Galerie einer Projektseite. Fotos öffnen sich gross, mit Pfeiltasten blätterbar.
// Platzhalter stehen im selben Raster, sind aber nicht klickbar.
export default function Gallery({ items }: { items: GalleryItem[] }) {
  const photos = items.filter((g): g is Photo => g.kind === "photo");
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const onlyPlaceholders = photos.length === 0;

  const show = useCallback((i: number) => {
    setOpen(i);
    if (!dialog.current?.open) dialog.current?.showModal();
  }, []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const onClose = () => setOpen(null);
    el.addEventListener("keydown", onKey);
    el.addEventListener("close", onClose);
    return () => {
      el.removeEventListener("keydown", onKey);
      el.removeEventListener("close", onClose);
    };
  }, [step]);

  const current = open === null ? null : photos[open];

  return (
    <>
      {onlyPlaceholders && <p className="small mb-4 text-muted">Platzhalter, Bilder folgen</p>}
      <ul className={`grid gap-4 md:gap-6 ${items.length > 2 ? "grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2"}`}>
        {items.map((g, i) => {
          const ratio = items.length > 2 ? "aspect-[4/5]" : "aspect-[16/10]";
          return (
            <li key={i} data-reveal style={{ ["--i" as string]: i % 4 }}>
              {g.kind === "photo" ? (
                <figure>
                  <button
                    type="button"
                    onClick={() => show(photos.indexOf(g))}
                    aria-label={`${g.alt} gross anzeigen`}
                    className={`group relative block w-full overflow-hidden rounded-[var(--radius)] ${ratio} active:scale-[0.99] transition-transform duration-200`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={g.src}
                      alt={g.alt}
                      width={g.width}
                      height={g.height}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
                    />
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0b1418]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
                  </button>
                  {g.caption && <figcaption className="small mt-2 text-muted">{g.caption}</figcaption>}
                </figure>
              ) : g.kind === "slot" ? (
                <Placeholder motif={g.motif} caption={g.caption} className={`w-full rounded-[var(--radius)] ${ratio}`} />
              ) : (
                <ProductMockup motif={g.motif} caption={g.caption} className={`w-full rounded-[var(--radius)] ${ratio}`} />
              )}
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialog}
        aria-label={current?.alt ?? "Bild"}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="m-auto max-h-[92svh] w-[min(92vw,80rem)] bg-transparent p-0 text-ink backdrop:bg-[#060a0d]/85 backdrop:backdrop-blur-sm"
      >
        {current && (
          <figure className="flex flex-col gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              className="max-h-[80svh] w-full rounded-[var(--radius)] object-contain"
            />
            <figcaption className="flex items-center justify-between gap-4">
              <span className="small text-muted">
                {current.caption ?? current.alt}
                {photos.length > 1 && <span className="nums ml-3">{(open ?? 0) + 1} / {photos.length}</span>}
              </span>
              <span className="flex gap-2">
                {photos.length > 1 && (
                  <>
                    <button type="button" onClick={() => step(-1)} className="btn-quiet" aria-label="Vorheriges Bild">←</button>
                    <button type="button" onClick={() => step(1)} className="btn-quiet" aria-label="Nächstes Bild">→</button>
                  </>
                )}
                <button type="button" onClick={() => dialog.current?.close()} className="btn-quiet">Schliessen</button>
              </span>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
