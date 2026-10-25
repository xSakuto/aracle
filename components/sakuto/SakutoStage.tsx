// Sakuto-Bühne: ein schwebender Geist und eine Figur, die seitlich ins Bild schaut.
// Die Beine sind abgeschnitten, davor liegt der Button. Nur transform und opacity werden animiert.
export default function SakutoStage() {
  return (
    <section aria-label="Sakuto" className="wrap relative mt-[var(--section)] grid items-center gap-10 md:grid-cols-12">
      <style>{`
        @keyframes sakuto-hover {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-2deg); }
          50% { transform: translate3d(0, -18px, 0) rotate(2deg); }
        }
        @keyframes sakuto-glow {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.95; }
        }
        .sakuto-ghost { animation: sakuto-hover 7s ease-in-out infinite; }
        .sakuto-ghost-glow { animation: sakuto-glow 4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .sakuto-ghost, .sakuto-ghost-glow { animation: none; }
        }
      `}</style>

      <div className="relative md:col-span-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/sakuto/sakuto-ghost.png"
          alt=""
          aria-hidden
          loading="lazy"
          width={1388}
          height={1133}
          className="sakuto-ghost mx-auto h-auto w-[min(80vw,26rem)] drop-shadow-[0_0_28px_rgb(170_140_255/0.45)]"
        />
        <div aria-hidden className="sakuto-ghost-glow pointer-events-none absolute inset-0 -z-10 m-auto h-[70%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(160_120_255/0.35),transparent)] blur-2xl" />
      </div>

      <div className="relative h-[min(80vw,30rem)] overflow-hidden rounded-[var(--radius)] md:col-span-5 md:col-start-8 md:h-[34rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/sakuto/sakuto-peek.png"
          alt=""
          aria-hidden
          loading="lazy"
          width={1024}
          height={1536}
          className="absolute bottom-0 right-[-8%] h-[125%] w-auto max-w-none -rotate-[8deg] object-cover object-top"
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg via-bg/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          <a
            href="https://www.youtube.com/@xSakuto"
            target="_blank"
            rel="noopener noreferrer"
            className="btn rounded-full px-7 shadow-[0_10px_30px_-10px_rgb(160_120_255/0.6)] transition-[transform,background-color] duration-300 active:scale-[0.97]"
          >
            Auf YouTube schauen <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
