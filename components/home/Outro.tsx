import Link from "next/link";

// Schluss: Schriibed üs.
export default function Outro() {
  return (
    <section aria-labelledby="outro-title" className="relative overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Brand_assets/arcl-header.jpg"
        alt=""
        width={2200}
        height={1238}
        loading="lazy"
        data-parallax="0.12"
        className="absolute inset-0 h-[124%] w-full object-cover object-[50%_70%] opacity-35"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-bg via-bg/40 to-bg" />
      <div className="wrap relative flex min-h-[90svh] flex-col items-center justify-center py-[var(--section)] text-center">
        <p className="kicker text-aqua">Kontakt</p>
        <h2 id="outro-title" className="mega mt-5 origin-bottom" data-grow>
          Schriibed üs.
        </h2>
        <p className="lead mt-6 max-w-[32rem] text-ink/85">
          Erzähl uns, worum es geht und bis wann. Wir melden uns innert
          kurzer Zeit mit einem Vorschlag.
        </p>
        <a
          href="mailto:info@arcl.ch?subject=Projekt-Anfrage"
          data-cursor="Schriibe"
          className="mt-8 text-[clamp(1.5rem,1rem+2vw,2.5rem)] font-semibold tracking-[-0.03em] text-aqua underline decoration-1 underline-offset-[0.22em] transition-opacity hover:opacity-80"
        >
          info@arcl.ch
        </a>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/kontakt" className="btn">Projekt anfragen</Link>
          <a href="https://discord.gg/BgpKdzBYtD" target="_blank" rel="noopener noreferrer" className="btn-quiet">Discord</a>
        </div>
      </div>
    </section>
  );
}
