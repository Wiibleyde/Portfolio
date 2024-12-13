"use client"
import { motion, useScroll, useTransform } from "framer-motion";

export function WordAnimation({ title }: { title: string }) {
    const { scrollY } = useScroll();
    const wordMap = title.split(' ').map((word, index) => {
        const start = index * 33;
        const end = start + 100;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollY, [start, end], [0.1, 1]);
        return { word, opacity };
    });

    return (
        <motion.div className='flex flex-wrap space-x-9 justify-center'>
            {wordMap.map(({ word, opacity }, index) => (
                <motion.span key={index} style={{ opacity }} className='text-gray-100 text-8xl font-black'>
                    {word}
                </motion.span>
            ))}
        </motion.div>
    )
}