import type { ReactNode } from "react";

interface TerminalBackgroundProps {
    children: ReactNode;
    showMatrix?: boolean;
    showGrid?: boolean;
    className?: string;
}

export function TerminalBackground({
    children,
    showMatrix = true,
    showGrid = true,
    className = "",
}: TerminalBackgroundProps) {
    return (
        <div
            className={`min-h-screen flex items-center justify-center bg-black relative overflow-hidden ${className}`}
        >
            {/* Matrix-style background effect */}
            {showMatrix && (
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#00ff41_2px,#00ff41_4px)]" />
                </div>
            )}

            {/* Animated grid background */}
            {showGrid && (
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-size-[50px_50px] mask-[radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
            )}

            <div className="relative z-10 w-full">{children}</div>
        </div>
    );
}
