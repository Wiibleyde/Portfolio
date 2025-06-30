import { Metadata } from 'next';
import "@/app/globals.css";
import Logo from '@public/img/sabs/sabs-logo-small.png';

export const metadata: Metadata = {
    title: "SABS - Page d'accueil",
    description: "Page d'accueil du site SABS, le site de l'association SABS.",
    icons: {
        icon: Logo.src,
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