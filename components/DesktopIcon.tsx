import type { ReactNode } from "react";

interface DesktopIconProps {
    icon: ReactNode;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    color?: "green" | "blue" | "purple" | "gray";
}

export function DesktopIcon({
    icon,
    label,
    onClick,
    disabled = false,
    color = "green",
}: DesktopIconProps) {
    const colorClasses = {
        green: "bg-linear-to-br from-green-600 via-green-500 to-green-700 group-hover:shadow-green-500/50 group-hover:shadow-2xl",
        blue: "bg-linear-to-br from-blue-600 via-blue-500 to-blue-700 group-hover:shadow-blue-500/50 group-hover:shadow-2xl",
        purple: "bg-linear-to-br from-purple-600 via-purple-500 to-purple-700 group-hover:shadow-purple-500/50 group-hover:shadow-2xl",
        gray: "bg-linear-to-br from-gray-700 via-gray-600 to-gray-800 border border-green-500/50 group-hover:shadow-green-500/50 group-hover:shadow-2xl",
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled && onClick) {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <button
            type="button"
            className={`flex flex-col items-center group cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500/50 rounded-lg p-2 transition-all duration-300 ${
                disabled
                    ? "cursor-not-allowed opacity-60"
                    : "hover:scale-110 hover:-translate-y-2"
            }`}
            onClick={disabled ? undefined : onClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-label={label}
        >
            <div
                className={`w-16 h-16 ${colorClasses[color]} rounded-xl flex items-center justify-center mb-3 transition-all duration-300 relative overflow-hidden`}
            >
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Pulsing border effect */}
                <div className="absolute inset-0 rounded-xl border-2 border-white/30 opacity-0 group-hover:opacity-100 animate-pulse" />

                <div className="relative z-10 text-white text-2xl group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
            </div>
            <span className="text-green-400 text-sm font-mono text-center group-hover:text-green-300 transition-colors duration-300 font-semibold drop-shadow-lg">
                {label}
            </span>

            {/* Hover effect line */}
            <div className="w-0 h-0.5 bg-linear-to-r from-green-400 to-green-600 group-hover:w-full transition-all duration-300 mt-1" />
        </button>
    );
}
