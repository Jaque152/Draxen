import type { Metadata } from "next";
import "../globals.css";
import { ClientBody } from "@/components/shared/ClientBody";
import { Navigation } from "@/components/shared/Navigation";
import { Footer } from "@/components/shared/Footer";

// Mantenemos el Provider para el contexto, pero quitamos getMessages
import { NextIntlClientProvider } from 'next-intl';

export const metadata: Metadata = {
  title: "Ninja Creatives - Creative Marketing Agency",
  description: "A marketing agency focused on helping businesses grow with disruptive communication, strategic events, and targeted strategies.",
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
  // 1. En Next.js 15 siempre esperamos los params
  const { locale } = await params;

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col">
        {/* 2. Pasamos un objeto vacío a messages ya que usaremos el componente <T /> */}
        <NextIntlClientProvider locale={locale} messages={{}}>
          <ClientBody>
            <Navigation />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </ClientBody>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}