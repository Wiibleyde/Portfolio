'use client';
import { gsap } from 'gsap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Heart, House, Search } from 'react-bootstrap-icons';

export default function NotFound() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLHeadingElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const quoteRef = useRef<HTMLQuoteElement>(null);
    const [mounted, setMounted] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setMounted(true);

        if (mounted) {
            // Set initial states
            gsap.set(
                [titleRef.current, subtitleRef.current, descriptionRef.current, buttonsRef.current, quoteRef.current],
                {
                    opacity: 0,
                    y: 30,
                },
            );

            // Main animation timeline
            const tl = gsap.timeline({ delay: 0.2 });

            tl.to(titleRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
            })
                .to(
                    subtitleRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                    },
                    '-=0.6',
                )
                .to(
                    descriptionRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                    },
                    '-=0.4',
                )
                .to(
                    buttonsRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'back.out(1.7)',
                    },
                    '-=0.3',
                )
                .to(
                    quoteRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                    },
                    '-=0.2',
                );

            // Floating animation for buttons
            gsap.to(buttonsRef.current, {
                y: -5,
                duration: 2,
                ease: 'power1.inOut',
                yoyo: true,
                repeat: -1,
                delay: 2,
            });
        }
    }, [mounted]);

    const handleScrollToSection = (sectionId: string) => {
        // Navigate to home page first
        router.push('/');

        // Wait for navigation and find the scroll container
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                // Find the scroll container (the div with overflow-y-scroll)
                const scrollContainer = document.querySelector('.overflow-y-scroll');
                if (scrollContainer) {
                    // Get the position of the target element relative to the scroll container
                    const containerRect = scrollContainer.getBoundingClientRect();
                    const elementRect = element.getBoundingClientRect();
                    const scrollTop = scrollContainer.scrollTop;

                    // Calculate the position to scroll to
                    const targetPosition = scrollTop + elementRect.top - containerRect.top;

                    // Smooth scroll to the target position
                    scrollContainer.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth',
                    });
                } else {
                    // Fallback to regular scroll if container not found
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            }
        }, 500); // Increased delay to ensure navigation is complete
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-blue-900/20 to-purple-900/30">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="h-full w-full"
                    style={{
                        backgroundImage: `radial-gradient(circle at 20% 80%, #3b82f6 0%, transparent 50%),
                                     radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)`,
                    }}
                />
            </div>

            <div ref={containerRef} className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                {/* 404 Title */}
                <h1
                    ref={titleRef}
                    className="mb-4 bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text font-black text-8xl text-transparent md:text-9xl"
                >
                    404
                </h1>

                {/* Subtitle */}
                <h2 ref={subtitleRef} className="mb-6 font-bold text-3xl text-white md:text-4xl">
                    Page non trouvée
                </h2>

                {/* Description */}
                <p ref={descriptionRef} className="mx-auto mb-8 max-w-2xl text-gray-300 text-xl leading-relaxed">
                    Oops ! Il semble que cette page n&apos;existe pas ou ait été déplacée. Mais ne vous inquiétez pas,
                    explorons d&apos;autres possibilités !
                </p>

                {/* Navigation buttons */}
                <div ref={buttonsRef} className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="/"
                        className="group relative flex transform items-center gap-3 rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-500/25"
                    >
                        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-400 to-purple-400 opacity-0 blur transition-opacity duration-300 group-hover:opacity-30" />
                        <House className="relative z-10 h-5 w-5" />
                        <span className="relative z-10">Retour à l&apos;accueil</span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="group relative flex transform items-center gap-3 rounded-2xl bg-linear-to-r from-gray-600 to-gray-700 px-8 py-3 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-gray-700 hover:to-gray-800 hover:shadow-gray-500/25"
                    >
                        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-gray-400 to-gray-500 opacity-0 blur transition-opacity duration-300 group-hover:opacity-30" />
                        <ArrowLeft className="relative z-10 h-5 w-5" />
                        <span className="relative z-10">Page précédente</span>
                    </button>
                </div>

                {/* Quote section */}
                <blockquote ref={quoteRef} className="relative mx-auto w-full max-w-2xl">
                    <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-linear-to-br from-white/10 via-white/8 to-white/5 p-6 shadow-2xl backdrop-blur-md md:p-8">
                        {/* Decorative background elements */}
                        <div className="-translate-y-16 absolute top-0 right-0 h-32 w-32 translate-x-16 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
                        <div className="-translate-x-12 absolute bottom-0 left-0 h-24 w-24 translate-y-12 rounded-full bg-linear-to-tr from-purple-500/15 to-blue-500/15 blur-2xl" />

                        {/* Quote content */}
                        <div className="relative z-10">
                            <p className="mb-2 text-center font-light text-gray-100 text-lg italic leading-relaxed">
                                « Chaque erreur est une opportunité d&apos;apprendre quelque chose de nouveau. »
                            </p>

                            {/* Author section */}
                            <div className="flex items-center justify-center gap-3">
                                <div className="h-0.5 w-10 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
                                <cite className="font-semibold text-base text-blue-400 not-italic tracking-wide">
                                    Philosophie du développement
                                </cite>
                                <div className="h-0.5 w-10 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
                            </div>
                        </div>
                    </div>
                </blockquote>

                {/* Suggestions */}
                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <button
                        type="button"
                        onClick={() => handleScrollToSection('timeline')}
                        className="group rounded-xl border border-white/15 bg-linear-to-r from-white/10 to-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/30 hover:bg-white/15"
                    >
                        <div className="mb-2 text-blue-400">
                            <Search className="mx-auto h-6 w-6" />
                        </div>
                        <h3 className="mb-1 font-semibold text-white">Mon parcours</h3>
                        <p className="text-gray-400 text-sm">Découvrez mon parcours professionnel</p>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleScrollToSection('projects')}
                        className="group rounded-xl border border-white/15 bg-linear-to-r from-white/10 to-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:border-purple-400/30 hover:bg-white/15"
                    >
                        <div className="mb-2 text-purple-400">
                            <Heart className="mx-auto h-6 w-6" />
                        </div>
                        <h3 className="mb-1 font-semibold text-white">Mes projets</h3>
                        <p className="text-gray-400 text-sm">Explorez mes réalisations</p>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleScrollToSection('contact')}
                        className="group rounded-xl border border-white/15 bg-linear-to-r from-white/10 to-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:border-green-400/30 hover:bg-white/15"
                    >
                        <div className="mb-2 text-green-400">
                            <House className="mx-auto h-6 w-6" />
                        </div>
                        <h3 className="mb-1 font-semibold text-white">Contact</h3>
                        <p className="text-gray-400 text-sm">Restons en contact</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
