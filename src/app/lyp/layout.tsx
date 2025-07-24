import { Montserrat } from 'next/font/google';
import { Metadata } from 'next';

const montserrat = Montserrat({
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'LOCK YOUR COMPUTER',
    description: 'LOCK YOUR COMPUTER',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className={'antialiased bg-black min-h-screen ' + montserrat.className}>{children}</div>;
}
