import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface ScrollingTextProps {
    text: string;
    className: string;
}

export function ScrollingText({ text, className }: ScrollingTextProps) {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkOverflow = () => {
            if (containerRef.current && textRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const textWidth = textRef.current.scrollWidth;
                setIsOverflowing(textWidth > containerWidth);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [text]);

    if (!isOverflowing) {
        return (
            <div ref={containerRef} className={className} style={{ overflow: 'hidden' }}>
                <div ref={textRef}>{text}</div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={className} style={{ overflow: 'hidden' }}>
            <motion.div
                ref={textRef}
                animate={{
                    x: [0, 0, -(textRef.current ? textRef.current.scrollWidth - containerRef.current!.offsetWidth : 0), -(textRef.current ? textRef.current.scrollWidth - containerRef.current!.offsetWidth : 0)]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                    times: [0, 0.2, 0.8, 1],
                    repeatType: "loop"
                }}
                style={{ whiteSpace: 'nowrap' }}
            >
                {text}
            </motion.div>
        </div>
    );
};