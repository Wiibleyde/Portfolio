import type { Metadata } from 'next';
import './globals.css';
import { Montserrat, Outfit } from 'next/font/google';
import { ClientLayout } from '@/app/clientLayout';

export const metadata: Metadata = {
    title: 'Portfolio - Nathan Bonnell',
    description: 'Site portfolio de Nathan Bonnell, développeur web fullstack.',
    authors: [
        {
            name: 'Nathan Bonnell',
            url: 'https://nathan.bonnell.fr',
        },
    ],
    keywords: ['portfolio', 'Nathan Bonnell', 'développeur web', 'fullstack'],
    twitter: {
        card: 'summary',
        title: 'Portfolio - Nathan Bonnell',
        description:
            'Portfolio de Nathan Bonnell, développeur web fullstack en alternance. Réalisé avec React, Next.js, TailwindCSS et TypeScript, disponible en français et en anglais ce site présente mes projets, mes compétences et mon parcours.',
        creator: '@wiibleyde',
        site: 'https://nathan.bonnell.fr',
    },
    openGraph: {
        type: 'website',
        url: 'https://nathan.bonnell.fr',
        title: 'Portfolio - Nathan Bonnell',
        description:
            'Portfolio de Nathan Bonnell, développeur web fullstack en alternance. Réalisé avec React, Next.js, TailwindCSS et TypeScript, disponible en français et en anglais ce site présente mes projets, mes compétences et mon parcours.',
        images: [
            {
                url: 'https://nathan.bonnell.fr/img/pp.webp',
                width: 1200,
                height: 1200,
                alt: 'Portfolio - Nathan Bonnell',
            },
        ],
    },
};

const montserrat = Outfit({
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`antialiased ${montserrat.className} bg-black`}>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
