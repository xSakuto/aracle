import JoinForm from "@/components/JoinForm";
import { APPLY_ROLES } from "@/data/apply";

export const metadata = {
  alternates: { canonical: "/apply" },
  title: "Mitmachen",
  description: "Aracle sucht Leute für Programmierung, Grafik, Webdesign, Moderation und Community-Management. Bewirb dich direkt.",
};

// Bewerbungsseite: links wer gesucht wird, rechts das Formular.
export default async function ApplyPage({ searchParams }: { searchParams: Promise<{ bereich?: string }> }) {
  const { bereich } = await searchParams;
  return (
    <div className="wrap pb-[var(--section)] pt-28 md:pt-36">
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="kicker text-aqua" data-rise>Mitmachen</p>
          <h1 className="mega mt-5" data-split="load">Join Aracle.</h1>
        </div>
        <p className="text-ink/85 md:col-span-4" data-rise style={{ ["--i" as string]: 2 }}>
          Aracle steht für Zusammenarbeit, Leidenschaft und Kreativität. Egal ob du designst,
          programmierst, baust oder einfach mithelfen willst, hier kannst du deine Ideen sichtbar machen.
        </p>
      </div>

      <div className="mt-16 grid gap-12 border-t border-line pt-10 md:mt-20 md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 className="head">Wie kannst du mitmachen?</h2>
          <p className="mt-4 text-ink/80">
            Wir suchen motivierte Leute mit Skills in Programmierung, Grafik, Webdesign, Moderation
            oder Community-Management. Such dir einen Bereich aus und bewirb dich direkt.
          </p>
          <ul className="mt-8 border-b border-line">
            {APPLY_ROLES.map((r) => (
              <li key={r.key} className="border-t border-line py-4">
                <p className="font-medium">{r.label}</p>
                <p className="small mt-1 text-ink/70">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <JoinForm defaultRole={bereich} />
        </div>
      </div>
    </div>
  );
}
