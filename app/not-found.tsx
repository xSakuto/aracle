import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="wrap grid min-h-svh grid-cols-12 items-center gap-x-8 pb-16 pt-32">
        <div className="col-span-12 md:col-span-7">
          <h1 className="display">Seite nicht gefunden</h1>
          <p className="lead mt-8 max-w-[34rem]">
            Diese Adresse gibt es nicht oder nicht mehr. Vielleicht findest du
            es bei den Projekten.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/projekte" className="btn">Projekte ansehen</Link>
            <Link href="/" className="btn-quiet">Zur Startseite</Link>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Brand_assets/arcl-header.jpg"
          alt="Klöntalersee im Kanton Glarus"
          width={2200}
          height={1238}
          className="col-span-12 mt-12 aspect-[4/5] w-full object-cover md:col-span-4 md:col-start-9 md:mt-0"
        />
      </main>
      <Footer />
    </>
  );
}
