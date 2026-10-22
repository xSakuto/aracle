import Link from "next/link";
import Topo from "@/components/alpine/Topo";

// Schluss: Einladung zur Zusammenarbeit, auf topografischen Höhenlinien.
export default function Outro() {
  return (
    <section aria-labelledby="outro-title" className="relative overflow-hidden border-t border-line">
      <Topo className="absolute inset-0 h-full w-full" />
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
          <a href="mailto:info@arcl.ch" className="btn-quiet">info@arcl.ch</a>
        </div>
      </div>
    </section>
  );
}
