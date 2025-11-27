"use client";

import { useCallback, useEffect, useState } from "react";

interface WindowProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    onMinimize?: () => void;
    initialPosition?: { x: number; y: number };
    initialSize?: { width: number; height: number };
    zIndex?: number;
    onFocus?: () => void;
}

export function Window({
    title,
    children,
    isOpen,
    onClose,
    onMinimize,
    initialPosition = { x: 100, y: 100 },
    initialSize = { width: 320, height: 240 },
    zIndex = 10,
    onFocus,
}: WindowProps) {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (onFocus) onFocus();
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            });
        },
        [onFocus, position.x, position.y],
    );

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragStart.x,
                    y: Math.max(0, e.clientY - dragStart.y), // Prevent dragging above screen
                });
            }
        },
        [isDragging, dragStart.x, dragStart.y],
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    if (!isOpen) return null;

    return (
        <div
            className="absolute bg-slate-900/95 backdrop-blur-xl border border-green-500/50 rounded-xl shadow-2xl overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-green-500/20"
            style={{
                left: position.x,
                top: position.y,
                width: initialSize.width,
                height: initialSize.height,
                zIndex,
                boxShadow: isDragging
                    ? "0 0 40px rgba(0, 255, 65, 0.3), 0 0 80px rgba(0, 255, 65, 0.1)"
                    : "0 0 20px rgba(0, 255, 65, 0.2), 0 0 40px rgba(0, 255, 65, 0.1)",
            }}
        >
            {/* Title Bar */}
            {/** biome-ignore lint/a11y/useSemanticElements: Unreplacable here */}
            <div
                className="w-full bg-linear-to-r from-green-600 via-green-500 to-green-600 px-4 py-3 flex items-center justify-between cursor-move select-none hover:from-green-500 hover:via-green-400 hover:to-green-500 transition-all duration-300 relative overflow-hidden"
                onMouseDown={handleMouseDown}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                    }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Window title bar for ${title}`}
            >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-green-400/20 to-transparent animate-pulse" />

                <span className="text-white font-mono text-sm font-semibold relative z-10 drop-shadow-lg">
                    {title}
                </span>
                <div className="flex gap-2 relative z-10">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMinimize?.();
                        }}
                        className="w-3 h-3 bg-yellow-400 hover:bg-yellow-300 rounded-full transition-all duration-200 hover:scale-125 shadow-lg hover:shadow-yellow-400/50"
                        aria-label="Minimize"
                    />
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="w-3 h-3 bg-red-400 hover:bg-red-300 rounded-full transition-all duration-200 hover:scale-125 shadow-lg hover:shadow-red-400/50"
                        aria-label="Close"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="p-6 h-full overflow-auto text-green-400 font-mono bg-slate-900/50 relative">
                {/* Subtle animated background */}
                <div className="absolute inset-0 bg-linear-to-br from-green-500/5 via-transparent to-blue-500/5 animate-pulse" />
                <div className="relative z-10">{children}</div>
            </div>
        </div>
    );
}
