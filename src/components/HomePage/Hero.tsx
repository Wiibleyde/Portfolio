'use client';
import { useScroll } from '@/hooks/useScroll';
import Background from '@public/img/background.jpg';
import Me from '@public/img/pp.webp';
import gsap from 'gsap';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export function Hero() {
    // References to elements we want to animate
    const nameRef = useRef(null);
    const titleRef = useRef(null);
    const containerRef = useRef(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const photoRef = useRef(null);
    const scrollIndicatorRef = useRef(null);

    const { scrollToTarget } = useScroll({ targetId: 'contact' });

    // Animation effect
    useEffect(() => {
        // Create a timeline
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Set initial states (invisible)
        gsap.set([nameRef.current, titleRef.current, buttonRef.current, photoRef.current, scrollIndicatorRef.current], {
            opacity: 0,
            y: 20,
        });

        // Fade in the container first
        tl.to(containerRef.current, {
            opacity: 1,
            duration: 1.2,
        });

        // Animate the name
        tl.to(
            nameRef.current,
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
            },
            '-=0.8'
        );

        // Animate the title with a slight delay
        tl.to(
            titleRef.current,
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
            },
            '-=0.9'
        );

        // Animate the button with a slight delay
        tl.to(
            buttonRef.current,
            {
                opacity: 1,
                y: 0,
                duration: 1,
            },
            '-=0.7'
        );

        // Animate the photo with a slight delay
        tl.to(
            photoRef.current,
            {
                opacity: 1,
                y: 0,
                duration: 1.5,
                delay: 0.2,
            },
            '-=0.7'
        );

        // Animate the scroll indicator
        tl.to(
            scrollIndicatorRef.current,
            {
                opacity: 1,
                y: 0,
                duration: 1,
            },
            '-=0.5'
        );

        // Bouton hover animation
        const button = buttonRef.current;

        // Handlers for event listeners
        const handleMouseEnter = () => {
            gsap.to(button, {
                scale: 1.03,
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
                duration: 0.4,
                ease: 'power1.out',
            });
        };

        const handleMouseLeave = () => {
            gsap.to(button, {
                scale: 1,
                boxShadow: 'none',
                duration: 0.4,
                ease: 'power1.out',
            });
        };

        if (button) {
            button.addEventListener('mouseenter', handleMouseEnter);
            button.addEventListener('mouseleave', handleMouseLeave);
        }

        // Nettoyage des event listeners
        return () => {
            if (button) {
                button.removeEventListener('mouseenter', handleMouseEnter);
                button.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    return (
        <div
            className="h-screen w-full snap-start relative"
            style={{ backgroundImage: `url(${Background.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="flex flex-col md:flex-row items-center justify-between min-h-screen w-full bg-gradient-to-r from-black/80 via-black/70 to-black/20 px-12 md:px-20 lg:px-24">
                <div ref={containerRef} className="text-left text-white max-w-2xl w-full md:w-1/2">
                    <h1 ref={nameRef} className="text-7xl md:text-8xl font-black mb-4 text-white">
                        Nathan Bonnell
                    </h1>
                    <h2 ref={titleRef} className="text-2xl md:text-3xl font-bold text-gray-300 mb-8">
                        Développeur Fullstack
                    </h2>

                    <div className="mt-10">
                        <button
                            ref={buttonRef}
                            onClick={scrollToTarget}
                            aria-label="Contactez-moi"
                            className="text-white py-4 px-8 rounded-full border-2 border-white hover:text-black transition-colors duration-400 ease-in-out font-medium tracking-wide relative overflow-hidden group"
                        >
                            <span className="relative z-10">Contactez-moi</span>
                            <span className="absolute bottom-0 left-0 w-0 h-full bg-white group-hover:w-full transition-all duration-400 ease-in-out -z-1 opacity-80"></span>
                        </button>
                    </div>
                </div>

                {/* Photo container - avec animation d'apparition */}
                <div ref={photoRef} className="hidden md:block w-2/7 mt-10 md:mt-0 opacity-0">
                    <div
                        className="relative w-full aspect-square max-w-md mx-auto"
                        style={{
                            boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.6)',
                            borderRadius: '20px',
                            overflow: 'hidden',
                        }}
                    >
                        <Image
                            src={Me}
                            alt="Nathan Bonnell"
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-lg"
                            priority
                        />
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div
                ref={scrollIndicatorRef}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white opacity-0"
            >
                <div className="flex flex-col items-center animate-bounce">
                    <span className="text-sm font-medium mb-2 tracking-wide">Lire la suite...</span>
                    <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
