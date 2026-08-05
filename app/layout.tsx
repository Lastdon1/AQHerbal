import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/home/Header";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navigation from "@/components/home/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AQ Herbal",
  description:
    "AQ Herbal - Inspired by Tibb-e-Nabawi (ﷺ), Trusted for Wellness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
  <AnnouncementBar />

  <Header />

  <Navigation />

  <main className="flex-1">
    {children}
  </main>
</body>
    </html>
  );
}