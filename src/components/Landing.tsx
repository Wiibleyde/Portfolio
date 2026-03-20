'use client';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

export function Landing() {
    // Utiliser un état initial null pour différencier le premier chargement
    const [hasSeen, setHasSeen] = useState<boolean | null>(null);
    const [loadingPercentage, setLoadingPercentage] = useState(0);
    const welcomeTextRef = useRef(null);
    const containerRef = useRef(null);
    const progressBarRef = useRef(null);
    const logoRef = useRef(null);
    const taglineRef = useRef(null);
    const percentageRef = useRef(null);

    useEffect(() => {
        const hasSeenAnimation = localStorage.getItem('hasSeenWelcome') === 'true';
        // const hasSeenAnimation = false; // For testing purposes, set to false to always show the animation
        setHasSeen(hasSeenAnimation);
    }, []);

    useEffect(() => {
        if (hasSeen !== false) return;

        const timeline = gsap.timeline();

        timeline.fromTo(
            logoRef.current,
            { scale: 0.5, filter: 'brightness(0.5)', opacity: 0 },
            {
                scale: 1,
                filter: 'brightness(1.2)',
                opacity: 1,
                duration: 0.5,
                ease: 'back.out(1.7)',
            }, // Réduit de 0.9 à 0.5s
        );

        timeline.to(
            logoRef.current,
            {
                scale: 1.05,
                duration: 0.5,
                repeat: 1,
                yoyo: true,
                ease: 'power1.inOut',
            },
            '-=0.1',
        );

        timeline.fromTo(
            welcomeTextRef.current,
            { opacity: 0, y: 20, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out' },
            '-=0.4',
        );

        timeline.fromTo(
            taglineRef.current,
            { opacity: 0, y: 10, letterSpacing: '0.2em' },
            {
                opacity: 0.9,
                y: 0,
                letterSpacing: '0.3em',
                duration: 0.6,
                ease: 'power2.out',
            },
            '-=0.4',
        );

        timeline.fromTo(
            progressBarRef.current,
            { width: '0%', opacity: 0.5 },
            {
                width: '100%',
                opacity: 1,
                duration: 2.2,
                ease: 'power2.inOut',
                onUpdate: function () {
                    const progress = Math.round(this.progress() * 100);
                    setLoadingPercentage(progress);

                    if (this.progress() > 0.05 && this.progress() < 0.95) {
                        const pulseIntensity = Math.sin(this.progress() * Math.PI * 5) * 0.03;
                        gsap.to(logoRef.current, {
                            scale: 1 + pulseIntensity,
                            filter: `brightness(${1 + pulseIntensity * 2})`,
                            duration: 0.1,
                        });
                    }
                },
            },
            '-=0.6',
        );

        timeline.to(percentageRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in' }, '-=0.2');

        // Séquence de sortie
        timeline.to(
            [welcomeTextRef.current, taglineRef.current],
            {
                opacity: 0,
                y: -25,
                filter: 'blur(5px)',
                duration: 0.6,
                ease: 'power3.in',
                stagger: 0.1,
            },
            '-=0.1',
        );
        timeline.to(
            logoRef.current,
            { opacity: 0, scale: 1.2, rotation: 5, duration: 0.6, ease: 'power3.in' },
            '-=0.4',
        );

        timeline.to(
            containerRef.current,
            {
                opacity: 0,
                duration: 0.6,
                ease: 'power2.inOut',
                onComplete: () => {
                    localStorage.setItem('hasSeenWelcome', 'true');
                    setHasSeen(true);
                },
            },
            '-=0.3',
        );
    }, [hasSeen]);

    if (hasSeen === true || hasSeen === null) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            className="fixed top-0 left-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-black text-white"
        >
            <div ref={logoRef} className="relative mb-8">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-blue-500 via-purple-600 to-pink-500 shadow-lg">
                    <span className="font-bold text-4xl">N</span>
                </div>
                <div className="-translate-x-1/2 -translate-y-1/2 -z-10 absolute top-1/2 left-1/2 h-32 w-32 transform rounded-full bg-linear-to-br from-blue-400/30 to-purple-500/30 blur-md" />
            </div>

            <h1
                ref={welcomeTextRef}
                className="mb-3 bg-linear-to-r from-white to-gray-300 bg-clip-text px-4 pb-2 font-black text-7xl text-transparent tracking-wide"
            >
                Bonjour
            </h1>

            <p ref={taglineRef} className="mb-16 font-light text-gray-300 text-lg tracking-[0.3em]">
                BIENVENUE SUR MON PORTFOLIO
            </p>

            <div className="flex flex-col items-center space-y-2">
                <div className="h-1 w-72 overflow-hidden rounded-full bg-gray-800/60 backdrop-blur-sm">
                    <div
                        ref={progressBarRef}
                        className="h-full bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 shadow-[0_0_8px_rgba(167,139,250,0.6)]"
                        style={{ width: '0%' }}
                    />
                </div>

                <div ref={percentageRef} className="font-light text-gray-400 text-sm tracking-widest">
                    {loadingPercentage}%
                </div>
            </div>
        </div>
    );
}
