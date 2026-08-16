import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css";

import Header from "@/components/layout/Header";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import Navigation from "@/components/home/Navigation";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ISACO | Natural Wellness",
    template: "%s | ISACO",
  },

  description:
    "ISACO — Natural wellness products inspired by traditional Eastern medicine and trusted herbal wisdom.",

  icons: {
    icon: "/favicon.ico",
  },

  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      "https://isaco.pk"
  ),

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} antialiased`}
    >
      <body className="flex min-h-screen min-w-0 flex-col overflow-x-hidden">
        <AnnouncementBar />

        <Header />

        <Navigation />

        <main className="min-w-0 flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}