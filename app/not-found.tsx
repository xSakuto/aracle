import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url(/Brand_assets/arcl-header.jpg)" }}
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.7) 60%, var(--color-bg) 100%)",
        }}
      />
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">
        Fehler 404
      </p>
      <h1 className="mt-4 text-[clamp(2.8rem,9vw,7rem)] font-bold leading-none tracking-[-0.04em] [text-shadow:0_4px_24px_rgba(0,0,0,0.5)]">
        Seite nicht gefunden<span className="text-gradient">.</span>
      </h1>
      <p className="mt-6 max-w-md text-lg text-white/75 [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">
        Diese Seite gibt es nicht (mehr). Zurück ins Studio?
      </p>
      <Link
        href="/"
        className="mt-9 rounded-lg bg-aqua px-7 py-3.5 font-bold text-black transition hover:-translate-y-px hover:opacity-90"
      >
        Zur Startseite →
      </Link>
    </section>
  );
}
