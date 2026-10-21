import PageIntro from "@/components/PageIntro";
import FeatureList from "@/components/FeatureList";
import CtaBand from "@/components/CtaBand";

export const metadata = {
  title: "Aracle Living · Immobilienfotografie",
  description:
    "Immobilien professionell in Szene gesetzt: Fotografie, 360°-Touren, Drohnenbilder und Vermarktung aus einer Hand.",
};

const features = [
  { name: "Immobilienfotografie", desc: "Hochwertige Aufnahmen, die Räume im besten Licht zeigen, innen wie aussen." },
  { name: "360°-Rundgänge", desc: "Virtuelle Touren, durch die Interessenten jedes Objekt selbst begehen." },
  { name: "Drohnenaufnahmen", desc: "Luftbilder für Lage, Umgebung und das grosse Ganze." },
  { name: "Exposé & Web", desc: "Exposés, Objektseiten und Social-Posts, die das Objekt sichtbar machen." },
];

export default function LivingPage() {
  return (
    <>
      <PageIntro
        shape="room"
        title="Aracle Living"
        lead="Immobilien, professionell in Szene gesetzt: Fotografie, 360°-Touren und digitale Vermarktung aus einer Hand. Geleitet von Jan Waser, aktuell im Aufbau."
        image={{
          src: "/Brand_assets/images/heros/immo.jpg",
          alt: "Wohnzimmer mit Holzdecke, Stufen und Essbereich",
          width: 1600,
          height: 1067,
        }}
      />
      <FeatureList
        title="Was dazugehört"
        intro="Der gestalterische Anspruch des Studios, angewendet auf Wohnungen und Häuser. Von der ersten Aufnahme bis zur fertigen Vermarktung."
        items={features}
      />
      <CtaBand
        title="Objekt zeigen?"
        text="Erzähl uns von der Immobilie: Lage, Grösse und bis wann die Bilder bereit sein müssen. Wir melden uns mit einem Vorschlag."
        action="Anfrage schicken"
      />
    </>
  );
}
