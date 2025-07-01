import { Metadata } from 'next';
import "@/app/globals.css";
import Logo from '@public/img/sabs/sabs-logo-small.png';

export const metadata: Metadata = {
    title: "SABS - Page d'accueil",
    description: "Page d'accueil du site SABS, le site de l'association SABS.",
    icons: {
        icon: Logo.src,
    },
    openGraph: {
        type: "website",
        url: "https://nathan.bonnell.fr/sabs",
        title: "SABS - Page d'accueil",
        description: "Page d'accueil du site SABS, le site de l'association SABS.",
        images: [
            {
                url: "https://nathan.bonnell.fr/img/sabs/sabs-logo.png",
                width: 1200,
                height: 1200,
                alt: "SABS - Page d'accueil",
            },
        ],
    },
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={'bg-black'}>
            {children}
        </div>
    );
}