'use client';
import { Clock } from '@/components/twitch/Clock';
import Balatro from '@/components/UI/LetterGlitch';
import ScrollVelocity from '@/components/UI/ScrollVelocity';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

export default function WaitingScreen() {
    const [scrollVelocityTexts, setScrollVelocityTexts] = useState(['Wiibleyde Stream - ', 'Écran de chargement - ']);

    return (
        <Suspense fallback={<div>Loading page...</div>}>
            <Content setScrollVelocityTexts={setScrollVelocityTexts} scrollVelocityTexts={scrollVelocityTexts} />
        </Suspense>
    );
}

function Content({
    setScrollVelocityTexts,
    scrollVelocityTexts,
}: {
    setScrollVelocityTexts: (texts: string[]) => void;
    scrollVelocityTexts: string[];
}) {
    const params = useSearchParams();
    useEffect(() => {
        const newTexts = [];
        const text1 = params.get('text1');
        const text2 = params.get('text2');
        if (text1) {
            newTexts[0] = text1;
        } else {
            newTexts[0] = scrollVelocityTexts[0];
        }
        if (text2) {
            newTexts[1] = text2;
        } else {
            newTexts[1] = scrollVelocityTexts[1];
        }
        setScrollVelocityTexts(newTexts);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <Balatro
                isRotate={false}
                mouseInteraction={false}
                pixelFilter={900}
            />
            <div className="absolute top-1/3">
                <p className="text-8xl font-bold text-white text-shadow-black text-shadow-lg">Wiibleyde</p>
            </div>
            <div className="absolute top-1/2 flex items-center justify-center w-full">
                <Clock/>
            </div>
            <div className="absolute bottom-36">
                <ScrollVelocity texts={scrollVelocityTexts} velocity={130} className="font-bold text-white text-shadow-black text-shadow-lg" />
            </div>
        </div>
    );
}
