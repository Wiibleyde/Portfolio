"use client";

import { useEffect, useState } from "react";
import "./lyp.css";
import CatGif from "@public/img/lyp/cat.gif";
import Image from "next/image";

enum OsType {
    Windows,
    Mac,
    Linux,
    Android,
    IOS,
    Unknown
}

export default function Home() {
    const [os, setOs] = useState<OsType>(OsType.Unknown);

    useEffect(() => {
        const userAgent = navigator.userAgent;
        if (userAgent.includes("Windows")) {
            setOs(OsType.Windows);
        } else if (userAgent.includes("Mac")) {
            setOs(OsType.Mac);
        } else if (userAgent.includes("Linux")) {
            setOs(OsType.Linux);
        } else {
            setOs(OsType.Unknown);
        }
    }, []);

    return (
        <div className="overflow-hidden w-screen h-screen rainbow-background">
            <div className="flex flex-col items-center justify-center h-full mlg-effects">
                <h1 className="text-4xl font-bold text-white glitch" data-text="Lock Your Computer">Lock Your Computer</h1>
                <div className="mt-4 text-white text-8xl">
                    {os === OsType.Windows && (
                        <p className="mb-2">Press <span className="font-bold rainbow-text">Win + L</span></p>
                    )}
                    {os === OsType.Mac && (
                        <p>Press <span className="font-bold rainbow-text">Cmd + Ctrl + Q</span></p>
                    )}
                    {os === OsType.Linux && (
                        <p>Press <span className="font-bold rainbow-text">Meta + L / Ctrl + Alt + L</span></p>
                    )}
                    {os === OsType.Unknown && (
                        <p className="text-2xl">Unknown OS <span className="font-bold rainbow-text">but you can still lock your computer</span></p>
                    )}
                </div>
                <Image src={CatGif} alt="Cat" width={600} height={600} />
            </div>
        </div>
    );
}
