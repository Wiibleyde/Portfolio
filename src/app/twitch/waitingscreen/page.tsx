'use client';
import Iridescence from '@/components/UI/Iridescence';
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
            <Iridescence color={[0.5, 0.5, 0.8]} mouseReact={false} amplitude={0.1} speed={1.0} />
            <div className="absolute top-1/3">
                <p className="text-8xl font-bold text-white">Wiibleyde</p>
            </div>
            {/* <div className="absolute top-0 right-0 p-2 flex flex-row items-center">
                <DateComponent />
                <p className="text-2xl font-black text-white mx-4">-</p>
                <Clock />
            </div> */}
            <div className="absolute bottom-36">
                <ScrollVelocity texts={scrollVelocityTexts} velocity={130} className="text-white" />
            </div>
        </div>
    );
}

// export function Clock() {
//     const [time, setTime] = useState(new Date());

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setTime(new Date());
//         }, 1000);
//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <div className="text-2xl font-black text-white">
//             {time.toLocaleTimeString()}
//         </div>
//     );
// }

// export function DateComponent() {
//     const [date, setDate] = useState(new Date());

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setDate(new Date());
//         }, 1000);
//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <div className="text-2xl font-black text-white">
//             {date.toLocaleDateString()}
//         </div>
//     );
// }
