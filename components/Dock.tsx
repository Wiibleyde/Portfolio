interface DockProps {
    children: React.ReactNode;
}

export function Dock({ children }: DockProps) {
    return (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-green-500/30 rounded-2xl px-6 py-3 flex items-center gap-6 shadow-2xl relative overflow-hidden">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-linear-to-r from-green-500/10 via-transparent to-blue-500/10 animate-pulse" />
                {/* Subtle border glow */}
                <div className="absolute inset-0 rounded-2xl border border-green-400/20 animate-pulse" />

                <div className="relative z-10 flex items-center gap-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

interface DockIconProps {
    icon: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    color?: "green" | "blue" | "purple" | "gray";
    isActive?: boolean;
}

export function DockIcon({
    icon,
    onClick,
    disabled = false,
    color = "green",
    isActive = false,
}: DockIconProps) {
    const colorClasses = {
        green: "bg-linear-to-br from-green-600 to-green-700",
        blue: "bg-linear-to-br from-blue-600 to-blue-700",
        purple: "bg-linear-to-br from-purple-600 to-purple-700",
        gray: "bg-linear-to-br from-gray-700 to-gray-800 border border-green-500/30",
    };

    return (
        <button
            type="button"
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg ${
                disabled ? "opacity-60 cursor-not-allowed" : ""
            } ${isActive ? "ring-2 ring-green-400/50" : ""}`}
            aria-label="Dock icon"
        >
            {icon}
        </button>
    );
}
