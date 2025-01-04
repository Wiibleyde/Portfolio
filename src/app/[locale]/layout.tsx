import { Navbar } from "@/components/Navbar/Navbar";
import { Languges } from "@/i18n/request";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Montserrat } from 'next/font/google'
import "@/app/globals.css"
import { ScrollToTop } from "@/components/UI/ScrollToTop";
import { Footer } from "@/components/Footer/Footer";
import { ScrollCircle } from "@/components/UI/ScrollCircle";

export const metadata: Metadata = {
    title: "Portfolio - Nathan Bonnell",
    description: "Portfolio de Nathan Bonnell, développeur web fullstack.",
    twitter: {
        card: "summary",
        title: "Portfolio - Nathan Bonnell",
        description: "Portfolio de Nathan Bonnell, développeur web fullstack.",
        creator: "@wiibleyde",
        site: "https://portfolio.bonnell.fr",
    },
    authors: [{
        name: "Nathan Bonnell",
        url: "https://portfolio.bonnell.fr",
    }],
    keywords: ["portfolio", "nathan bonnell", "développeur web", "fullstack", "react", "nextjs", "tailwindcss", "typescript"],
    robots: "index, follow",
    openGraph: {
        type: "website",
        url: "https://portfolio.bonnell.fr",
        title: "Portfolio - Nathan Bonnell",
        description: "Portfolio de Nathan Bonnell, développeur web fullstack.",
        images: [
            {
                url: "https://portfolio.bonnell.fr/img/picture/pp.png",
                width: 1200,
                height: 630,
                alt: "Portfolio - Nathan Bonnell",
            },
        ],
    },
};

const montserrat = Montserrat({
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
        notFound();
    }

    const messages = await getMessages({ locale });

    return (
        <html lang={locale}>
            <body className={montserrat.className}>
                <NextIntlClientProvider messages={messages}>
                    <Navbar />
                    {children}
                    <ScrollToTop />
                    <ScrollCircle />
                    <Footer />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
