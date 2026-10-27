import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeft } from 'react-bootstrap-icons';

interface ToolPageLayoutProps {
    title: string;
    description: string;
    children: ReactNode;
}

/** Shared page shell for the tool pages: back link, heading, content. */
export function ToolPageLayout({ title, description, children }: ToolPageLayoutProps) {
    return (
        <main className="min-h-dvh py-12 md:py-16">
            <div className="mx-auto max-w-6xl px-6 md:px-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-100"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Nathan Bonnell
                </Link>
                <header className="mt-10 mb-10 md:mb-14">
                    <h1 className="font-semibold text-3xl text-zinc-50 tracking-tight md:text-5xl">{title}</h1>
                    <p className="mt-4 max-w-2xl text-zinc-400">{description}</p>
                </header>
                {children}
            </div>
        </main>
    );
}
