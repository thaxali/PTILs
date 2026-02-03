import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Aboreto } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["200", "400"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const aboreto = Aboreto({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-aboreto",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ptils.me"),
  title: "PTILS — Discover one interesting thing you can do with AI today",
  description:
    "Bite-sized prompt techniques to expand your AI toolkit. Learn one new thing about AI prompting every day.",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-icon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://app.seenalabs.io/widget/seena.js"
          data-site-id="26fbaf7a-0a85-4e0a-ad3e-6cd9af4c50a3"
          async
        />
      </head>
      <body
        className={`${instrumentSerif.variable} ${jetbrainsMono.variable} ${aboreto.variable} font-serif antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
