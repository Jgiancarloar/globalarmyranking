
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Global Army Ranking",
    template: "%s | Global Army Ranking",
  },
  description:
    "Discover the global ARMY community ranking. Support your country and connect with BTS fans around the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}
