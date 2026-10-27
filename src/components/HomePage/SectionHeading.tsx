import type { ReactNode } from 'react';

interface SectionHeadingProps {
    title: string;
    children?: ReactNode;
}

export function SectionHeading({ title, children }: SectionHeadingProps) {
    return (
        <header className="mb-10 md:mb-14">
            <h2 className="font-semibold text-3xl text-zinc-50 tracking-tight md:text-5xl">{title}</h2>
            {children && <p className="mt-4 max-w-2xl text-zinc-400">{children}</p>}
        </header>
    );
}
