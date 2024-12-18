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

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
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
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
