import type { ReactNode } from "react";

interface TerminalPromptProps {
    command?: string;
    children?: ReactNode;
    showPrompt?: boolean;
}

export function TerminalPrompt({
    command,
    children,
    showPrompt = true,
}: TerminalPromptProps) {
    return (
        <div className="flex items-start gap-2">
            {showPrompt && <span className="text-green-400 shrink-0">$</span>}
            {command ? (
                <p className="text-green-400/90 text-sm sm:text-base">
                    {command}
                </p>
            ) : (
                <div className="flex-1">{children}</div>
            )}
        </div>
    );
}
