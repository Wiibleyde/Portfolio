import type { ReactNode } from "react";

type TerminalVariant = "base" | "error" | "warning" | "custom";

interface TerminalWindowProps {
    title?: string;
    children: ReactNode;
    className?: string;
    showDots?: boolean;
    variant?: TerminalVariant;
    customColors?: {
        border?: string;
        shadow?: string;
        headerBorder?: string;
        titleText?: string;
    };
}

const variantStyles = {
    base: {
        border: "border-green-500/30",
        shadow: "shadow-[0_0_30px_rgba(0,255,65,0.2)]",
        headerBorder: "border-green-500/30",
        titleText: "text-green-400",
    },
    error: {
        border: "border-red-500/30",
        shadow: "shadow-[0_0_30px_rgba(239,68,68,0.2)]",
        headerBorder: "border-red-500/30",
        titleText: "text-red-400",
    },
    warning: {
        border: "border-yellow-500/30",
        shadow: "shadow-[0_0_30px_rgba(234,179,8,0.2)]",
        headerBorder: "border-yellow-500/30",
        titleText: "text-yellow-400",
    },
    custom: {
        border: "",
        shadow: "",
        headerBorder: "",
        titleText: "",
    },
};

export function TerminalWindow({
    title = "~/terminal",
    children,
    className = "",
    showDots = true,
    variant = "base",
    customColors,
}: TerminalWindowProps) {
    const styles =
        variant === "custom" && customColors
            ? {
                  border: customColors.border || variantStyles.base.border,
                  shadow: customColors.shadow || variantStyles.base.shadow,
                  headerBorder:
                      customColors.headerBorder ||
                      variantStyles.base.headerBorder,
                  titleText:
                      customColors.titleText || variantStyles.base.titleText,
              }
            : variantStyles[variant];

    return (
        <div
            className={`bg-zinc-950 border-2 ${styles.border} ${styles.shadow} rounded-lg overflow-hidden ${className}`}
        >
            {/* Terminal header */}
            <div
                className={`bg-zinc-900 border-b ${styles.headerBorder} px-4 py-2 flex items-center gap-2`}
            >
                {showDots && (
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                )}
                <span className={`font-mono text-xs ${styles.titleText} ml-2`}>
                    {title}
                </span>
            </div>

            {/* Terminal content */}
            <div className="p-8 font-mono">{children}</div>
        </div>
    );
}
