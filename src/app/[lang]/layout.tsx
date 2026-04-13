import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Locale } from "@/i18n-config";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import HashScroller from "@/components/HashScroller";
import ThemeProvider from "@/components/ThemeProvider";

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
    <html lang={lang} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          inter.variable,
          "min-h-screen bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-neutral-100 dark:selection:text-neutral-900"
        )}
      >
        <ThemeProvider>
          <Header lang={lang} />
          <main className="min-h-[calc(100vh-160px)]">{children}</main>
          <Footer lang={lang} />
          <Analytics />
          <SpeedInsights />
          <HashScroller />
        </ThemeProvider>
      </body>
    </html>
  );
}
