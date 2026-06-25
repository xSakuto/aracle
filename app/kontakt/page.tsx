import SectionLabel from "@/components/SectionLabel";

export const metadata = {
  title: "Kontakt · Aracle",
  description: "Projekt einreichen oder Teil von Aracle werden.",
};

const mail = "info@arcl.ch";
const discord = "https://discord.gg/BgpKdzBYtD";

export default function KontaktPage() {
  return (
    <div className="px-6 pb-28 pt-36 md:px-12">
      <div className="mx-auto max-w-[860px]">
        <SectionLabel>Kontakt</SectionLabel>
        <h1 className="text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.96] tracking-[-0.04em]">
          Lass uns reden<span className="text-gradient">.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-dim">
          Du hast ein Projekt, eine Idee oder willst Teil von Aracle werden?
          Schreib uns direkt, wir antworten schnell.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <a
            href={`mailto:${mail}`}
            className="group rounded-2xl border border-line bg-surface p-7 transition hover:border-aqua/40 hover:bg-aqua/[0.03]"
          >
            <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-aqua/10 text-aqua">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </span>
            <h3 className="text-xl font-bold tracking-tight">E-Mail</h3>
            <p className="mt-1 text-aqua">{mail}</p>
          </a>

          <a
            href={discord}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-line bg-surface p-7 transition hover:border-aqua/40 hover:bg-aqua/[0.03]"
          >
            <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-aqua/10 text-aqua">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 14.09 14.09 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.2 13.2 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.094.252-.192.372-.291a.072.072 0 0 1 .077-.01c3.927 1.764 8.18 1.764 12.061 0a.072.072 0 0 1 .078.009c.12.099.246.198.373.292a.075.075 0 0 1-.006.125c-.598.35-1.22.642-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.964 19.964 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </span>
            <h3 className="text-xl font-bold tracking-tight">Discord</h3>
            <p className="mt-1 text-aqua">Aracle Community</p>
          </a>
        </div>

        <div className="mt-4 rounded-2xl border border-dashed border-aqua/30 bg-aqua/[0.04] p-8">
          <h3 className="text-xl font-bold tracking-tight">Projekt einreichen</h3>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Beschreib kurz, worum es geht (Video, Design, Web oder Hosting), und
            wir melden uns mit den nächsten Schritten.
          </p>
          <a
            href={`mailto:${mail}?subject=Projekt-Anfrage`}
            className="mt-6 inline-block rounded-lg bg-aqua px-6 py-3 font-bold text-black transition hover:-translate-y-px hover:opacity-90"
          >
            Projekt per E-Mail einreichen →
          </a>
        </div>
      </div>
    </div>
  );
}
