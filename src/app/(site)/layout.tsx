import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import SiteEffects from "@/components/SiteEffects";
import PageTransition from "@/components/PageTransition";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Cursor />
      <PageTransition />
      <Nav />
      {children}
      <Footer />
      <SiteEffects />
    </>
  );
}
