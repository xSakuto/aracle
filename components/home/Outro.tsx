import Link from "next/link";
import Contours from "@/components/alpine/Contours";

// Schluss: Einladung zur Zusammenarbeit, auf den echten Höhenlinien des Gross Chärpf.
export default function Outro() {
  return (
    <section aria-labelledby="outro-title" className="relative overflow-hidden border-t border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 w-[max(115%,72rem)] -translate-y-1/2 text-ink opacity-70"
        style={{ left: "calc(84% - 0.502 * max(115%, 72rem))" }}
      >
        <Contours label={false} />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_55%_at_50%_50%,rgb(11_17_21/0.94),rgb(11_17_21/0.4)_70%,transparent)]" />
      <div className="wrap relative flex min-h-[86svh] flex-col items-center justify-center py-[var(--section)] text-center">
        <p className="kicker text-aqua">Kontakt</p>
        <h2 id="outro-title" className="mega mt-5 origin-bottom" data-grow>
          Let&rsquo;s build something.
        </h2>
        <p className="lead mt-6 max-w-[34rem] text-ink/85">
          Erzähl uns, worum es geht. Wir melden uns mit einer ehrlichen
          Einschätzung und den nächsten Schritten.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/kontakt" className="btn">Projekt anfragen</Link>
          <a href="mailto:info@aracle.ch" className="btn-quiet">info@aracle.ch</a>
        </div>
      </div>
    </section>
  );
}
