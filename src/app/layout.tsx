import type { Metadata } from 'next';
import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';

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
            'Portfolio de Nathan Bonnell, développeur web fullstack en alternance. Ce site présente mes projets, mes compétences et mon parcours.',
        creator: '@wiibleyde',
        site: 'https://nathan.bonnell.fr',
    },
    openGraph: {
        type: 'website',
        url: 'https://nathan.bonnell.fr',
        title: 'Portfolio - Nathan Bonnell',
        description:
            'Portfolio de Nathan Bonnell, développeur web fullstack en alternance. Ce site présente mes projets, mes compétences et mon parcours.',
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

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className={`${geist.variable} ${geistMono.variable}`}>
            <body className="bg-zinc-950 font-sans text-zinc-100 antialiased">
                {children}
                <Script
                    src="https://umami.wiibleyde.dev/script.js"
                    data-website-id="713f0ec9-cc70-4d2d-b26c-3633755ebac7"
                />
            </body>
        </html>
    );
}
