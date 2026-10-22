import HeroTechnical from "@/components/home/HeroTechnical";
import HomeBody from "@/components/home/HomeBody";

// Team kommt aus der Datenbank; alle 60 Sekunden frisch.
export const revalidate = 60;

export default function Home() {
  return (
    <>
      <HeroTechnical />
      <HomeBody />
    </>
  );
}
