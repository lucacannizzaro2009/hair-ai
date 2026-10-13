import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hair Studio Milano | Hair Salon a Milano",
    template: "%s | Hair Studio Milano",
  },
  description:
    "Hair Studio Milano: tagli, pieghe, colore, balayage, trattamenti e richieste di appuntamento con concierge AI.",
  applicationName: "Hair Studio Milano",
  keywords: [
    "parrucchiere Milano",
    "hair studio Milano",
    "taglio capelli Milano",
    "balayage Milano",
    "colore capelli Milano",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hair Studio Milano",
    description:
      "Tagli, styling, colore e trattamenti. Scopri i servizi e richiedi il tuo appuntamento.",
    type: "website",
    locale: "it_IT",
    siteName: "Hair Studio Milano",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hair Studio Milano",
    description:
      "Tagli, styling, colore e trattamenti a Milano.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ede6dc",
};



export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
