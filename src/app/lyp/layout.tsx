import { Montserrat } from 'next/font/google'
import { Metadata } from 'next';

const montserrat = Montserrat({
    subsets: ['latin'],
    display: 'swap',
})

export const metadata: Metadata = {
    title: "LOCK YOUR COMPUTER",
    description: "LOCK YOUR COMPUTER",
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
