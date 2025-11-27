"use client";

import { useEffect, useState } from "react";
import { FaCode, FaEnvelope, FaTerminal, FaUser } from "react-icons/fa";
import { DesktopIcon } from "@/components/DesktopIcon";
import { Dock, DockIcon } from "@/components/Dock";
import { StatusBar } from "@/components/StatusBar";
import { Window } from "@/components/Window";

type WindowType = "about" | "projects" | "contact" | "terminal";

interface WindowState {
    isOpen: boolean;
    isMinimized: boolean;
    zIndex: number;
}

interface MatrixChar {
    id: string;
    left: string;
    delay: string;
    duration: string;
    char: string;
}

export default function Home() {
    const [windows, setWindows] = useState<Record<WindowType, WindowState>>({
        about: { isOpen: true, isMinimized: false, zIndex: 20 },
        projects: { isOpen: false, isMinimized: false, zIndex: 10 },
        contact: { isOpen: false, isMinimized: false, zIndex: 10 },
        terminal: { isOpen: false, isMinimized: false, zIndex: 10 },
    });

    const [nextZIndex, setNextZIndex] = useState(30);
    const [matrixChars, setMatrixChars] = useState<MatrixChar[]>([]);

    // Generate matrix characters only on client side to avoid hydration mismatch
    useEffect(() => {
        const chars = [...Array(15)].map((_, i) => ({
            id: `matrix-${i}`,
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 5}s`,
            duration: `${3 + Math.random() * 2}s`,
            char: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
        }));
        setMatrixChars(chars);
    }, []);

    const openWindow = (type: WindowType) => {
        setWindows((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                isOpen: true,
                isMinimized: false,
                zIndex: nextZIndex,
            },
        }));
        setNextZIndex((prev) => prev + 1);
    };

    const closeWindow = (type: WindowType) => {
        setWindows((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                isOpen: false,
                isMinimized: false,
            },
        }));
    };

    const minimizeWindow = (type: WindowType) => {
        setWindows((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                isMinimized: true,
            },
        }));
    };

    const focusWindow = (type: WindowType) => {
        setWindows((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                zIndex: nextZIndex,
                isMinimized: false,
            },
        }));
        setNextZIndex((prev) => prev + 1);
    };

    return (
        <div className="min-h-dvh bg-black relative overflow-hidden">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,65,0.1),transparent_50%)] animate-pulse" />
                <div
                    className="absolute top-10 left-10 w-32 h-32 border border-green-500/30 rounded-full animate-spin"
                    style={{ animationDuration: "20s" }}
                />
                <div
                    className="absolute top-20 right-20 w-24 h-24 border border-green-500/30 rounded-full animate-spin"
                    style={{
                        animationDuration: "15s",
                        animationDirection: "reverse",
                    }}
                />
                <div
                    className="absolute bottom-20 left-1/3 w-16 h-16 border border-green-500/30 rounded-full animate-spin"
                    style={{ animationDuration: "25s" }}
                />

                {/* Animated Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-size-[50px_50px] animate-pulse" />

                {/* Floating Particles */}
                <div
                    className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0s", animationDuration: "3s" }}
                />
                <div
                    className="absolute top-1/3 right-1/3 w-1 h-1 bg-green-300 rounded-full animate-bounce"
                    style={{ animationDelay: "1s", animationDuration: "4s" }}
                />
                <div
                    className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: "2s", animationDuration: "5s" }}
                />
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
            <div
                className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "2s" }}
            />

            {/* Matrix-style falling characters */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
                {matrixChars.map((char) => (
                    <div
                        key={char.id}
                        className="absolute text-green-400 font-mono text-xs animate-bounce"
                        style={{
                            left: char.left,
                            animationDelay: char.delay,
                            animationDuration: char.duration,
                        }}
                    >
                        {char.char}
                    </div>
                ))}
            </div>

            {/* Status Bar */}
            <StatusBar />

            {/* Desktop Icons */}
            <div className="relative z-10 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl">
                <DesktopIcon
                    icon={<FaUser />}
                    label="A propos de moi"
                    color="green"
                    onClick={() => openWindow("about")}
                />

                <DesktopIcon
                    icon={<FaCode />}
                    label="Projets (Bientôt)"
                    color="blue"
                    disabled
                />

                <DesktopIcon
                    icon={<FaEnvelope />}
                    label="Contact (Bientôt)"
                    color="purple"
                    disabled
                />

                <DesktopIcon
                    icon={<FaTerminal />}
                    label="Terminal"
                    color="gray"
                    onClick={() => openWindow("terminal")}
                />
            </div>

            {/* Windows */}
            <Window
                title="A propos de moi - Wiibleyde"
                isOpen={windows.about.isOpen && !windows.about.isMinimized}
                onClose={() => closeWindow("about")}
                onMinimize={() => minimizeWindow("about")}
                onFocus={() => focusWindow("about")}
                zIndex={windows.about.zIndex}
                initialPosition={{ x: 200, y: 150 }}
                initialSize={{ width: 400, height: 300 }}
            >
                <div className="space-y-3">
                    <p className="text-lg font-semibold">
                        Nathan Bonnell (Wiibleyde)
                    </p>
                    <p className="text-green-300 text-sm">
                        Développeur fullstack.
                    </p>
                </div>
            </Window>

            <Window
                title="Terminal - WiibleydeOS"
                isOpen={
                    windows.terminal.isOpen && !windows.terminal.isMinimized
                }
                onClose={() => closeWindow("terminal")}
                onMinimize={() => minimizeWindow("terminal")}
                onFocus={() => focusWindow("terminal")}
                zIndex={windows.terminal.zIndex}
                initialPosition={{ x: 150, y: 200 }}
                initialSize={{ width: 500, height: 350 }}
            >
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-green-500">$</span>
                        <span className="text-green-400">whoami</span>
                    </div>
                    <p className="text-zinc-400 ml-4">nathan (Wiibleyde)</p>

                    <div className="flex items-center gap-2 mt-4">
                        <span className="text-green-500">$</span>
                        <span className="text-green-400">
                            ls -la ~/projects
                        </span>
                    </div>
                    <p className="text-zinc-400 ml-4">Coming soon...</p>

                    <div className="flex items-center gap-2 mt-4">
                        <span className="text-green-500">$</span>
                        <span className="text-green-400 animate-pulse">_</span>
                    </div>
                </div>
            </Window>

            {/* Dock */}
            <Dock>
                <DockIcon
                    icon={<FaUser />}
                    color="green"
                    onClick={() => openWindow("about")}
                    isActive={
                        windows.about.isOpen && !windows.about.isMinimized
                    }
                />
                <DockIcon icon={<FaCode />} color="blue" disabled />
                <DockIcon icon={<FaEnvelope />} color="purple" disabled />
                <DockIcon
                    icon={<FaTerminal />}
                    color="gray"
                    onClick={() => openWindow("terminal")}
                    isActive={
                        windows.terminal.isOpen && !windows.terminal.isMinimized
                    }
                />
            </Dock>
        </div>
    );
}
