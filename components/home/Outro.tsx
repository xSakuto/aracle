import Link from "next/link";

// Schluss: die Einladung wächst ins Bild.
export default function Outro() {
  return (
    <section aria-labelledby="outro-title" data-shape="sphere" className="wrap flex min-h-svh flex-col justify-center py-[var(--section)] text-center">
      <h2 id="outro-title" className="mega origin-bottom" data-grow>
        Lass uns reden
      </h2>
      <a
        href="mailto:info@arcl.ch?subject=Projekt-Anfrage"
        data-cursor="Schreiben"
        className="mx-auto mt-10 text-[clamp(1.5rem,1rem+2vw,2.75rem)] font-bold text-aqua underline decoration-2 underline-offset-[0.2em] [font-stretch:115%] transition-opacity hover:opacity-80"
      >
        info@arcl.ch
      </a>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/kontakt" className="btn">Projekt anfragen</Link>
        <a href="https://discord.gg/BgpKdzBYtD" target="_blank" rel="noopener noreferrer" className="btn-quiet">
          Discord
        </a>
      </div>
    </section>
  );
}
