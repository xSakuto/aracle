import Intro from "@/components/home/Intro";
import HomeBody from "@/components/home/HomeBody";

// Team kommt aus der Datenbank; alle 60 Sekunden frisch.
export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Intro />
      <HomeBody />
    </>
  );
}
