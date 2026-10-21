import Link from "next/link";

export default function ContactTile() {
  return (
    <section aria-labelledby="contact-title" className="wrap py-[var(--section)]">
      <div className="inner mx-auto max-w-[44rem] text-center">
        <h2 id="contact-title" className="display" data-reveal>
          Projekt im Kopf?
        </h2>
        <p className="lead mt-5 text-muted" data-reveal style={{ ["--i" as string]: 1 }}>
          Schreib uns, worum es geht und bis wann. Wir melden uns mit einem
          Vorschlag.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3" data-reveal style={{ ["--i" as string]: 2 }}>
          <Link href="/kontakt" className="btn">Projekt anfragen</Link>
          <a href="https://discord.gg/BgpKdzBYtD" target="_blank" rel="noopener noreferrer" className="btn-quiet">
            Discord
          </a>
        </div>
      </div>
    </section>
  );
}
