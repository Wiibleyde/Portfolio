'use client';

import { useEffect, useState } from 'react';
import './lyp.css';
import CatGif from '@public/img/lyp/cat.gif';
import Image from 'next/image';

enum OsType {
    Windows = 0,
    Mac = 1,
    Linux = 2,
    Android = 3,
    IOS = 4,
    Unknown = 5,
}

export default function Home() {
    const [os, setOs] = useState<OsType>(OsType.Unknown);

    useEffect(() => {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Windows')) {
            setOs(OsType.Windows);
        } else if (userAgent.includes('Mac')) {
            setOs(OsType.Mac);
        } else if (userAgent.includes('Linux')) {
            setOs(OsType.Linux);
        } else {
            setOs(OsType.Unknown);
        }
    }, []);

    return (
        <div className="rainbow-background h-screen w-screen overflow-hidden">
            <div className="mlg-effects flex h-full flex-col items-center justify-center">
                <h1 className="glitch font-bold text-4xl text-white" data-text="Lock Your Computer">
                    Lock Your Computer
                </h1>
                <div className="mt-4 text-8xl text-white">
                    {os === OsType.Windows && (
                        <p className="mb-2">
                            Press <span className="rainbow-text font-bold">Win + L</span>
                        </p>
                    )}
                    {os === OsType.Mac && (
                        <p>
                            Press <span className="rainbow-text font-bold">Cmd + Ctrl + Q</span>
                        </p>
                    )}
                    {os === OsType.Linux && (
                        <p>
                            Press <span className="rainbow-text font-bold">Meta + L / Ctrl + Alt + L</span>
                        </p>
                    )}
                    {os === OsType.Unknown && (
                        <p className="text-2xl">
                            Unknown OS{' '}
                            <span className="rainbow-text font-bold">but you can still lock your computer</span>
                        </p>
                    )}
                </div>
                <Image src={CatGif} alt="Cat" width={600} height={600} />
            </div>
        </div>
    );
}
