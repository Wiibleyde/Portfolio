'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { House, ArrowLeft, Search, Heart } from 'react-bootstrap-icons';
import { useRouter } from 'next/navigation';

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
                }
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
                    '-=0.6'
                )
                .to(
                    descriptionRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                    },
                    '-=0.4'
                )
                .to(
                    buttonsRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'back.out(1.7)',
                    },
                    '-=0.3'
                )
                .to(
                    quoteRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                    },
                    '-=0.2'
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
        <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/30 flex items-center justify-center">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `radial-gradient(circle at 20% 80%, #3b82f6 0%, transparent 50%), 
                                     radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)`,
                    }}
                ></div>
            </div>

            <div ref={containerRef} className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                {/* 404 Title */}
                <h1
                    ref={titleRef}
                    className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4"
                >
                    404
                </h1>

                {/* Subtitle */}
                <h2 ref={subtitleRef} className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Page non trouvée
                </h2>

                {/* Description */}
                <p ref={descriptionRef} className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Oops ! Il semble que cette page n&apos;existe pas ou ait été déplacée. Mais ne vous inquiétez pas,
                    explorons d&apos;autres possibilités !
                </p>

                {/* Navigation buttons */}
                <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <Link
                        href="/"
                        className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-blue-500/25 transform hover:scale-105"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                        <House className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Retour à l&apos;accueil</span>
                    </Link>

                    <button
                        onClick={() => router.back()}
                        className="group relative bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-gray-500/25 transform hover:scale-105"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                        <ArrowLeft className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Page précédente</span>
                    </button>
                </div>

                {/* Quote section */}
                <blockquote ref={quoteRef} className="relative w-full max-w-2xl mx-auto">
                    <div className="relative bg-gradient-to-br from-white/10 via-white/8 to-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl overflow-hidden">
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/15 to-blue-500/15 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>

                        {/* Quote content */}
                        <div className="relative z-10">
                            <p className="text-lg text-gray-100 font-light leading-relaxed text-center mb-2 italic">
                                « Chaque erreur est une opportunité d&apos;apprendre quelque chose de nouveau. »
                            </p>

                            {/* Author section */}
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-10 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                                <cite className="text-blue-400 text-base font-semibold not-italic tracking-wide">
                                    Philosophie du développement
                                </cite>
                                <div className="w-10 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </blockquote>

                {/* Suggestions */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                        onClick={() => handleScrollToSection('timeline')}
                        className="group bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/15 hover:border-blue-400/30 transition-all duration-300 hover:bg-white/15"
                    >
                        <div className="text-blue-400 mb-2">
                            <Search className="w-6 h-6 mx-auto" />
                        </div>
                        <h3 className="text-white font-semibold mb-1">Mon parcours</h3>
                        <p className="text-gray-400 text-sm">Découvrez mon parcours professionnel</p>
                    </button>

                    <button
                        onClick={() => handleScrollToSection('projects')}
                        className="group bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/15 hover:border-purple-400/30 transition-all duration-300 hover:bg-white/15"
                    >
                        <div className="text-purple-400 mb-2">
                            <Heart className="w-6 h-6 mx-auto" />
                        </div>
                        <h3 className="text-white font-semibold mb-1">Mes projets</h3>
                        <p className="text-gray-400 text-sm">Explorez mes réalisations</p>
                    </button>

                    <button
                        onClick={() => handleScrollToSection('contact')}
                        className="group bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/15 hover:border-green-400/30 transition-all duration-300 hover:bg-white/15"
                    >
                        <div className="text-green-400 mb-2">
                            <House className="w-6 h-6 mx-auto" />
                        </div>
                        <h3 className="text-white font-semibold mb-1">Contact</h3>
                        <p className="text-gray-400 text-sm">Restons en contact</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
