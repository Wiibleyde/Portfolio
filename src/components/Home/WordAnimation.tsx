"use client"
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export function WordAnimation({ title }: { title: string }) {
    const { scrollY } = useScroll();
    const [pageHeight, setPageHeight] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setPageHeight(window.innerHeight);
        const handleResize = () => setPageHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const wordMap = title.split(' ').map((word, index) => {
        const start = index * (pageHeight / 30); // Adjusted start value based on page height
        const end = start + (pageHeight / 10); // Adjusted end value to ensure visibility
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollY, [start, end], [0.2, 1]);
        return { word, opacity };
    });

    return (
        <motion.div ref={containerRef} className='flex flex-wrap space-x-9 justify-center'>
            {wordMap.map(({ word, opacity }, index) => (
                <motion.span key={index} style={{ opacity }} className='text-gray-100 text-8xl font-black'>
                    {word}
                </motion.span>
            ))}
        </motion.div>
    )
}