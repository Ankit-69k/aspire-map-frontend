import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "CareerPath - Your Personal Career Guidance Platform",
  description: "Discover your career potential with personalized roadmaps, AI-powered guidance, and adaptive learning.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans `}>
        <Suspense fallback={<>loading...</>}>{children}</Suspense>
      </body>
    </html>
  );
}
