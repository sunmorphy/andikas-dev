import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Locale } from "@/i18n-config";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Andika Sultanrafli - Portfolio",
  description: "Independent product designer and full-stack engineer building digital experiences.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  return (
    <html lang={lang}>
      <body
        className={cn(
          inter.variable,
          "min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white"
        )}
      >
        <Header lang={lang} />
        <main className="min-h-[calc(100vh-160px)]">{children}</main>
        <Footer lang={lang} />
        <Analytics />
      </body>
    </html>
  );
}
