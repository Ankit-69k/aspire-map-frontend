import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      <body className={cn(`font-sans `, inter.className)}>
        <Suspense fallback={<>loading...</>}>
          {children}
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
