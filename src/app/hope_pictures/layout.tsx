import { Montserrat } from 'next/font/google'
import "@/app/globals.css"
import { Metadata } from 'next';

const montserrat = Montserrat({
    subsets: ['latin'],
    display: 'swap',
})

export const metadata: Metadata = {
    title: "Photos de Hope - GTARP",
    description: "Photos de Hope, serveur GTARP",
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='fr'>
            <body className={montserrat.className}>
                {children}
            </body>
        </html>
    );
}
