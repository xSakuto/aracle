import HeroTechnical from "@/components/home/HeroTechnical";
import HomeBody from "@/components/home/HomeBody";

// Vorschau Hero-Variante B (Alpine Technical). Wird nach der Entscheidung entfernt.
export const revalidate = 60;
export const metadata = { title: "Vorschau Hero B · Aracle", robots: { index: false, follow: false } };

export default function HeroPreview() {
  return (
    <>
      <HeroTechnical />
      <HomeBody />
    </>
  );
}
