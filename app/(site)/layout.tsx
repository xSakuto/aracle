import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Choreo from "@/components/fx/Choreo";
import Cursor from "@/components/fx/Cursor";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="site-content">
        <main id="inhalt">{children}</main>
        <Footer />
      </div>
      <Choreo />
      <Cursor />
    </>
  );
}
