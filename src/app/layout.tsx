import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import SiteEffects from "@/components/SiteEffects";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "PROTOFORM — 3D Modeling & Prototype Development",
  description:
    "3D modeling, CAD engineering, simulation and 3D-printed prototypes. From idea to physical part.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Cursor />
        <PageTransition />
        <Nav />
        {children}
        <Footer />
        <SiteEffects />
      </body>
    </html>
  );
}
