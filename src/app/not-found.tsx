'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'react-bootstrap-icons';
import DotGrid from '@/components/reactbits/DotGrid';

const SECTIONS = [
    { href: '/#timeline', label: 'Parcours' },
    { href: '/#projects', label: 'Projets' },
    { href: '/#contact', label: 'Contact' },
];

export default function NotFound() {
    const router = useRouter();

    return (
        <main className="relative flex min-h-dvh items-center overflow-hidden py-24">
            <div aria-hidden="true" className="absolute inset-0">
                <DotGrid dotSize={3} gap={22} baseColor="#27272a" activeColor="#8fb3ff" proximity={130} fade={0.6} />
            </div>

            <div className="relative mx-auto w-full max-w-6xl px-6 md:px-10">
                <p className="font-mono text-accent text-sm">Erreur 404</p>
                <h1 className="mt-3 font-semibold text-5xl text-zinc-50 tracking-tighter md:text-7xl">
                    Page introuvable
                </h1>
                <p className="mt-6 max-w-xl text-lg text-zinc-400">Cette page n&apos;existe pas ou a été déplacée.</p>

                <div className="mt-10 flex flex-wrap gap-3">
                    <Link href="/" className="btn btn-primary">
                        Retour à l&apos;accueil
                    </Link>
                    <button type="button" onClick={() => router.back()} className="btn btn-secondary">
                        <ArrowLeft className="h-4 w-4" />
                        Page précédente
                    </button>
                </div>

                <nav aria-label="Sections du site" className="mt-16 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    {SECTIONS.map(({ href, label }) => (
                        <Link key={href} href={href} className="text-zinc-500 transition-colors hover:text-zinc-100">
                            {label} →
                        </Link>
                    ))}
                </nav>
            </div>
        </main>
    );
}
