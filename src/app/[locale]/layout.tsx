import type { Metadata } from "next";
import "../globals.css";
import { ClientBody } from "@/components/shared/ClientBody";
import { Navigation } from "@/components/shared/Navigation";
import { Footer } from "@/components/shared/Footer";
import { NextIntlClientProvider } from 'next-intl';
import { Providers } from "@/components/shared/Providers";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { CartProvider } from "@/hooks/use-cart";
import { CurrencyProvider } from "@/hooks/use-currency";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Draxen Digital Resultados ",
  description: "A Draxen Digital agency focused on helping businesses grow with disruptive communication, strategic events, and targeted strategies.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <html lang={locale} className={`${playfair.variable} ${dmSans.variable} scroll-smooth`}>
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col font-sans">
        <NextIntlClientProvider locale={locale} messages={{}}>
          {/* 1. PROVIDERS AHORA ENVUELVE TODO, INCLUYENDO CLIENTBODY */}
          <Providers>
            <ClientBody>
              <Navigation />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </ClientBody>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}