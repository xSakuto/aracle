import type { Metadata, Viewport } from "next";
import "./globals.css";
import Motion from "@/components/Motion";

import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aracle · Creative & Technology Studio aus Glarus",
    template: "%s · Aracle",
  },
  description:
    "Aracle ist ein Creative & Technology Studio aus Glarus. Wir entwickeln eigene Marken und Produkte, produzieren Content und betreiben Hosting auf eigener Hardware.",
  applicationName: "Aracle",
  authors: [{ name: "Joel-Sananda Nef", url: SITE_URL }],
  creator: "Aracle",
  publisher: "J. Nef Aracle, Media & Design",
  keywords: ["Aracle", "Glarus", "Creative Studio", "Webdesign Glarus", "Hosting Schweiz", "Content Creation", "Highside", "Swizzly"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_CH",
    url: SITE_URL,
    siteName: "Aracle",
    images: [{ url: "/og/aracle.jpg", width: 1200, height: 630, alt: "Aracle, Creative & Technology Studio aus Glarus" }],
  },
  twitter: { card: "summary_large_image", site: "@AracleCH" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false },
};

// Strukturierte Daten für Suchmaschinen: wer Aracle ist und wo.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "Aracle",
      legalName: "J. Nef Aracle, Media & Design",
      url: SITE_URL,
      logo: `${SITE_URL}/Brand_assets/logo/aracle-mark-white.png`,
      email: "info@aracle.ch",
      foundingDate: "2017",
      founder: { "@type": "Person", name: "Joel-Sananda Nef" },
      address: { "@type": "PostalAddress", addressLocality: "Glarus", postalCode: "8750", addressRegion: "GL", addressCountry: "CH" },
      sameAs: ["https://www.instagram.com/aracle.ch/", "https://x.com/AracleCH", "https://discord.gg/BgpKdzBYtD"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Aracle",
      inLanguage: "de-CH",
      publisher: { "@id": `${SITE_URL}/#org` },
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#0b1115",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de-CH" className="[color-scheme:dark]" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" />
        <link rel="preload" href="/fonts/helvetica-neue-400.woff2" as="font" type="font/woff2" crossOrigin="" />
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body id="top">
        <a
          href="#inhalt"
          className="sr-only z-[60] bg-aqua px-4 py-3 text-accent-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Zum Inhalt springen
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        {children}
        <Motion />
      </body>
    </html>
  );
}
