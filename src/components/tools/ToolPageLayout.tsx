'use client';

import type { ReactNode } from 'react';

interface ToolPageLayoutProps {
    children: ReactNode;
    className?: string;
}

/** Shared page wrapper with the gradient background pattern used by all tool pages. */
export function ToolPageLayout({ children, className = '' }: ToolPageLayoutProps) {
    return (
        <div
            className={`relative min-h-screen bg-linear-to-br from-slate-900 via-blue-900/20 to-purple-900/30 py-12 ${className}`}
        >
            {/* Background gradient blobs */}
            <div className="absolute inset-0 opacity-10" aria-hidden="true">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%),
                                         radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`,
                    }}
                />
            </div>
            <div className="relative z-10">{children}</div>
        </div>
    );
}
