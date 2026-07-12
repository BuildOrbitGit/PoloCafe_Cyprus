import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const heading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Caffè Polo Venezia Limassol | Your Next Coffee Stop",
  description:
    "Caffè Polo Venezia brings a new premium coffee experience to Limassol, Cyprus with rich aromas, handcrafted coffee, and an elegant Italian-inspired cafe atmosphere.",
  keywords: [
    "Caffè Polo Venezia",
    "Polo Cafe Limassol",
    "coffee Limassol",
    "Italian coffee Cyprus",
    "cafe Limassol",
    "espresso Limassol",
    "coffee shop Cyprus",
    "premium coffee cafe",
  ],
  openGraph: {
    title: "Caffè Polo Venezia Limassol | Your Next Coffee Stop",
    description:
      "A premium Italian-inspired coffee experience brewing in Limassol, Cyprus.",
    type: "website",
    locale: "en_CY",
    siteName: "Caffè Polo Venezia Limassol",
    images: ["/media/hero/hero-poster.webp"],
  },
  icons: {
    icon: "/media/logo/polo-logo.jpg",
    apple: "/media/logo/polo-logo.jpg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
