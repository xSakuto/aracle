import HeroPhoto from "@/components/home/HeroPhoto";
import HomeBody from "@/components/home/HomeBody";

// Vorschau Hero-Variante A (Photography First). Wird nach der Entscheidung entfernt.
export const revalidate = 60;
export const metadata = { title: "Vorschau Hero A · Aracle", robots: { index: false, follow: false } };

export default function HeroPreview() {
  return (
    <>
      <HeroPhoto />
      <HomeBody />
    </>
  );
}
