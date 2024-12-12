"use client"
import { useEffect, useState } from 'react';
import { Mouse } from 'react-bootstrap-icons';

export function FloatingClock() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [scrollPercentage, setScrollPercentage] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            setScrollPercentage(parseFloat(scrollPercent.toFixed(2)));
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearInterval(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="fixed bottom-4 right-4 border-2 border-gray-300 shadow-lg rounded-md w-28 h-16">
            <div className="bg-black bg-opacity-90 text-white p-4 rounded-lg flex flex-col items-center justify-center h-full">
                <p className="font-bold text-lg">{currentTime.toLocaleTimeString()}</p>
                <p className="text-xs mt-1 flex flex-row items-center justify-center"><Mouse className='mr-1' /> {scrollPercentage}%</p>
            </div>
        </div>
    );
}