'use client';
import Background from '@public/img/background.jpg';
import Me from '@public/img/pp.webp';
import gsap from 'gsap';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useScroll } from '@/hooks/useScroll';

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
            '-=0.8',
        );

        // Animate the title with a slight delay
        tl.to(
            titleRef.current,
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
            },
            '-=0.9',
        );

        // Animate the button with a slight delay
        tl.to(
            buttonRef.current,
            {
                opacity: 1,
                y: 0,
                duration: 1,
            },
            '-=0.7',
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
            '-=0.7',
        );

        // Animate the scroll indicator
        tl.to(
            scrollIndicatorRef.current,
            {
                opacity: 1,
                y: 0,
                duration: 1,
            },
            '-=0.5',
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
            className="relative h-screen w-full snap-start"
            style={{
                backgroundImage: `url(${Background.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="flex min-h-screen w-full flex-col items-center justify-between bg-linear-to-r from-black/80 via-black/70 to-black/20 px-12 md:flex-row md:px-20 lg:px-24">
                <div ref={containerRef} className="w-full max-w-2xl text-left text-white md:w-1/2">
                    <h1 ref={nameRef} className="mb-4 font-black text-7xl text-white md:text-8xl">
                        Nathan Bonnell
                    </h1>
                    <h2 ref={titleRef} className="mb-8 font-bold text-2xl text-gray-300 md:text-3xl">
                        Développeur Fullstack
                    </h2>

                    <div className="mt-10">
                        <button
                            type="button"
                            ref={buttonRef}
                            onClick={scrollToTarget}
                            aria-label="Contactez-moi"
                            className="group relative overflow-hidden rounded-full border-2 border-white px-8 py-4 font-medium text-white tracking-wide transition-colors duration-400 ease-in-out hover:text-black"
                        >
                            <span className="relative z-10">Contactez-moi</span>
                            <span className="-z-1 absolute bottom-0 left-0 h-full w-0 bg-white opacity-80 transition-all duration-400 ease-in-out group-hover:w-full" />
                        </button>
                    </div>
                </div>

                {/* Photo container - avec animation d'apparition */}
                <div ref={photoRef} className="mt-10 hidden w-2/7 opacity-0 md:mt-0 md:block">
                    <div
                        className="relative mx-auto aspect-square w-full max-w-md"
                        style={{
                            boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.6)',
                            borderRadius: '20px',
                            overflow: 'hidden',
                        }}
                    >
                        <Image
                            src={Me}
                            alt="Nathan Bonnell"
                            className="rounded-lg object-cover"
                            style={{ width: '100%', height: 'auto' }}
                            priority
                        />
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div
                ref={scrollIndicatorRef}
                className="-translate-x-1/2 absolute bottom-8 left-1/2 transform text-white opacity-0"
            >
                <div className="flex animate-bounce flex-col items-center">
                    <span className="mb-2 font-medium text-sm tracking-wide">Lire la suite...</span>
                    <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white">
                        <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}
