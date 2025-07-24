import { Montserrat } from 'next/font/google';
import { Metadata } from 'next';
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
    return <div className={montserrat.className + ' bg-black min-h-screen'}>{children}</div>;
}
