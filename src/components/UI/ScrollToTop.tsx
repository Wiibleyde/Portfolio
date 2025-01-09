"use client"
import { useScroll } from '@/hooks/useScroll';
import { useEffect, useState } from 'react';
import { ArrowUp } from 'react-bootstrap-icons';

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const { scroll } = useScroll();

    useEffect(() => {
        if (scroll > 150) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [scroll]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button onClick={scrollToTop} className={`fixed bottom-4 right-4 mb-16 rounded-full transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} bg-green-500 bg-opacity-90 text-white p-2 shadow-md`} name="Scroll to top">
            <ArrowUp className='text-black' size={24} />
        </button>
    );
}