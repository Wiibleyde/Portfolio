import { useEffect, useState } from "react";

export function useScroll() {
    const [scroll, setScroll] = useState(0);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [lastScroll, setLastScroll] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (scrollTop / docHeight) * 100;
            if(isNaN(scrolled)) {
                setScrollPercentage(0);
                setScroll(0);
                setScrollDirection('down');
                return
            }
            setScrollPercentage(Math.round(Number(scrolled.toFixed(2))));
            setScroll(scrollTop);
            setScrollDirection(lastScroll > scrollTop ? 'up' : 'down');
            setLastScroll(scrollTop);
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScroll]);

    return { scroll, scrollDirection, scrollPercentage: scrollPercentage };
}