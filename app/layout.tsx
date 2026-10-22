import type { Metadata, Viewport } from "next";
import "./globals.css";
import Motion from "@/components/Motion";

export const metadata: Metadata = {
  title: "Aracle · Creative Studio aus Glarus",
  description:
    "Aracle ist ein Creative Studio aus Glarus: Video, Design, Web und Hosting, dazu eigene Marken wie Highside, Aracle Living und Aracle Cloud.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
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
        {children}
        <Motion />
      </body>
    </html>
  );
}
