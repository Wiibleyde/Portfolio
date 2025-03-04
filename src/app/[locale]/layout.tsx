import { Navbar } from "@/components/Navbar/Navbar";
import { Languges } from "@/i18n/request";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Montserrat } from 'next/font/google'
import "@/app/globals.css"
import { ScrollToTop } from "@/components/UI/ScrollToTop";
import { Footer } from "@/components/Footer/Footer";
import { ScrollCircle } from "@/components/UI/ScrollCircle";
import Error from "./[...not_found]/page";
import { ClientProviders } from "./clientProviders";

export const metadata: Metadata = {
    title: "Portfolio - Nathan Bonnell",
    description: "Portfolio de Nathan Bonnell, développeur web fullstack en alternance. Réalisé avec React, Next.js, TailwindCSS et TypeScript, disponible en français et en anglais ce site présente mes projets, mes compétences et mon parcours.",
    twitter: {
        card: "summary",
        title: "Portfolio - Nathan Bonnell",
        description: "Portfolio de Nathan Bonnell, développeur web fullstack en alternance. Réalisé avec React, Next.js, TailwindCSS et TypeScript, disponible en français et en anglais ce site présente mes projets, mes compétences et mon parcours.",
        creator: "@wiibleyde",
        site: "https://nathan.bonnell.fr",
    },
    authors: [{
        name: "Nathan Bonnell",
        url: "https://nathan.bonnell.fr",
    }],
    keywords: ["portfolio", "nathan bonnell", "développeur web", "fullstack", "react", "nextjs", "tailwindcss", "typescript", "nathan", "bonnell", "bordeaux", "ynov"],
    openGraph: {
        type: "website",
        url: "https://nathan.bonnell.fr",
        title: "Portfolio - Nathan Bonnell",
        description: "Portfolio de Nathan Bonnell, développeur web fullstack en alternance. Réalisé avec React, Next.js, TailwindCSS et TypeScript, disponible en français et en anglais ce site présente mes projets, mes compétences et mon parcours.",
        images: [
            {
                url: "https://nathan.bonnell.fr/img/picture/pp.png",
                width: 1200,
                height: 630,
                alt: "Portfolio - Nathan Bonnell",
            },
        ],
    },
};

export const montserrat = Montserrat({
    subsets: ['latin'],
    display: 'swap',
})

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
}>) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as Languges)) {
        return (
            <html lang={routing.defaultLocale}>
                <body className={montserrat.className}>
                    <NextIntlClientProvider messages={await getMessages({ locale: routing.defaultLocale })}>
                        <ClientProviders>
                            <Navbar />
                            <Error />
                            <ScrollToTop />
                            <ScrollCircle />
                            <Footer />
                        </ClientProviders>
                    </NextIntlClientProvider>
                </body>
            </html>
        );
    }

    const messages = await getMessages({ locale });

    return (
        <html lang={locale}>
            <meta name="google-site-verification" content="a4uoCtPLK4IRbmmpoko6el3U8PAeRUvlnEWAcBFi0NA" />
            <body className={montserrat.className}>
                <NextIntlClientProvider messages={messages}>
                    <ClientProviders>
                        <Navbar />
                        {children}
                        <ScrollToTop />
                        <ScrollCircle />
                        <Footer />
                    </ClientProviders>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
