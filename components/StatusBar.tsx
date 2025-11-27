"use client";

import { useEffect, useState } from "react";

interface StatusBarProps {
    osName?: string;
    subtitle?: string;
    time?: string;
}

export function StatusBar({
    osName = "WiibleydeOS v1.0",
    subtitle = "Portfolio Desktop",
    time,
}: StatusBarProps) {
    const [currentTime, setCurrentTime] = useState(time || "");

    useEffect(() => {
        // Set initial time on client side
        setCurrentTime(
            new Date().toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }),
        );

        // Update time every second
        const timer = setInterval(() => {
            setCurrentTime(
                new Date().toLocaleTimeString("en-US", {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                }),
            );
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="top-0 left-0 right-0 z-40">
            <div className="bg-slate-900/95 backdrop-blur-xl border-b border-green-500/30 px-6 py-3 flex justify-between items-center shadow-lg relative overflow-hidden">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-linear-to-r from-green-500/5 via-transparent to-blue-500/5 animate-pulse" />
                {/* Subtle border glow */}
                <div className="absolute inset-0 border-b border-green-400/20 animate-pulse" />

                <div className="relative z-10 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                        <span className="text-green-400 font-mono text-sm font-bold tracking-wider">
                            {osName}
                        </span>
                    </div>
                    <span className="text-green-300 font-mono text-xs">
                        {subtitle}
                    </span>
                </div>

                <div className="relative z-10 text-green-400 font-mono text-sm">
                    {currentTime}
                </div>
            </div>
        </div>
    );
}
