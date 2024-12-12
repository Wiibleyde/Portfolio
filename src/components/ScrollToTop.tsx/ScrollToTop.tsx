"use client"
import { useEffect, useState } from 'react';
import { ArrowUp } from 'react-bootstrap-icons';

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button onClick={scrollToTop} className={`fixed bottom-4 left-4 rounded-full transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} bg-green-500 bg-opacity-90 text-white p-2`}>
            <ArrowUp className='text-black' />
        </button>
    );
}