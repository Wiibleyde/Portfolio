import { useEffect, useState } from "react";

export function useScroll() {
    const [scroll, setScroll] = useState(0);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
    const [scrollPercent, setScrollPercent] = useState(0);

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScroll(currentScrollY);
            setScrollDirection(lastScrollY > currentScrollY ? 'up' : 'down');
            setScrollPercent((currentScrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return { scroll, scrollDirection, scrollPercent };
}