import InquiryForm from "@/components/InquiryForm";
import Contours from "@/components/alpine/Contours";

export const metadata = {
  alternates: { canonical: "/kontakt" },
  title: "Kontakt",
  description: "Projekt anfragen: Website, Branding, Video oder Hosting. Aracle, Creative & Technology Studio aus Glarus.",
};

const direct: { label: string; value: string; href: string }[] = [
  { label: "E-Mail", value: "info@aracle.ch", href: "mailto:info@aracle.ch" },
  { label: "Discord", value: "Aracle Community", href: "https://discord.gg/BgpKdzBYtD" },
  { label: "Instagram", value: "@aracle.ch", href: "https://www.instagram.com/aracle.ch/" },
];

export default async function KontaktPage({ searchParams }: { searchParams: Promise<{ typ?: string }> }) {
  const { typ } = await searchParams;
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -left-[22%] top-[38%] w-[70%] text-ink opacity-30 max-md:hidden">
        <Contours />
      </div>
      <div className="wrap relative grid gap-14 pb-[var(--section)] pt-28 md:grid-cols-12 md:gap-8 md:pt-36">
        <div className="md:col-span-5">
          <p className="kicker text-aqua" data-rise>Kontakt</p>
          <h1 className="mega mt-5" data-split="load">Let&rsquo;s talk.</h1>
          <p className="lead mt-6 max-w-[28rem] text-ink/85" data-rise style={{ ["--i" as string]: 2 }}>
            Erzähl uns kurz, was du vorhast. Je konkreter, desto besser
            können wir einschätzen, wie wir helfen können.
          </p>

          <dl className="mt-12 border-t border-line" data-rise style={{ ["--i" as string]: 3 }}>
            {direct.map((d) => (
              <div key={d.label} className="flex items-baseline justify-between gap-6 border-b border-line py-4">
                <dt className="text-muted">{d.label}</dt>
                <dd>
                  <a
                    href={d.href}
                    {...(d.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="font-medium transition-colors hover:text-aqua"
                  >
                    {d.value}
                  </a>
                </dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-6 border-b border-line py-4">
              <dt className="text-muted">Studio</dt>
              <dd className="text-right">Glarus, Schweiz</dd>
            </div>
          </dl>
        </div>

        <section aria-labelledby="form-title" className="md:col-span-6 md:col-start-7">
          <h2 id="form-title" className="sr-only">Projektanfrage</h2>
          <InquiryForm defaultType={typ} />
        </section>
      </div>
    </div>
  );
}
