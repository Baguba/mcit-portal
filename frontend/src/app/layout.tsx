import type { Metadata } from "next";
import {
  Public_Sans,
  Geist_Mono,
  Noto_Sans_Ethiopic,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

// Public Sans — the open-source typeface designed for government services
// (same family used by the U.S. Web Design System). Pairs with
// Noto Sans Ethiopic for Amharic text.
const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoEthiopic = Noto_Sans_Ethiopic({
  variable: "--font-noto-ethiopic",
  subsets: ["ethiopic"],
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PCC Professional Competence Certificate Portal | Ethiopia",
  description:
    "Official portal for the Innovation and Technology Agency (PCC) Professional Competence Certificate process. Apply for ICT sector business licenses in Ethiopia (Harari Region).",
  keywords: [
    "PCC",
    "Ethiopia",
    "Harari",
    "ICT license",
    "Professional Competence Certificate",
    "business license",
    "Directive 1/2007",
  ],
  authors: [{ name: "Innovation and Technology Agency" }],
  icons: {
    icon: "/logo.png?v=2",
    shortcut: "/logo.png?v=2",
    apple: "/logo.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${publicSans.variable} ${geistMono.variable} ${notoEthiopic.variable} ${playfairDisplay.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster richColors position="top-right" />
      </body>
    </html>
  );
}
