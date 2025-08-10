import { Montserrat } from 'next/font/google';
import { Metadata } from 'next';
import '@/app/globals.css';

const montserrat = Montserrat({
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'SAMC - Waiting Screen',
    description: 'Waiting screen for SAMC',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className={'antialiased bg-black min-h-screen ' + montserrat.className}>{children}</div>;
}
