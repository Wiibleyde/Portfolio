import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import '@/app/globals.css';

const montserrat = Montserrat({
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Eve - Wiibleyde',
    description: 'Eve utililities',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className={`${montserrat.className} min-h-screen bg-black`}>{children}</div>;
}
