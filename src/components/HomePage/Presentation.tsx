"use client"
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function Presentation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const quoteRef = useRef<HTMLQuoteElement>(null);
    const descriptionRef = useRef<HTMLElement>(null);
    const birthRef = useRef<HTMLElement>(null);
    const cvRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial state
            gsap.set([quoteRef.current, descriptionRef.current, birthRef.current, cvRef.current], {
                opacity: 0,
                y: 50
            });

            // Main timeline
            const tl = gsap.timeline({ delay: 0.2 });

            tl.to(quoteRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            })
            .to(descriptionRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.4")
            .to(birthRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "back.out(1.7)"
            }, "-=0.3")
            .to(cvRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.5)"
            }, "-=0.2");

            // Floating animation for CV button
            gsap.to(cvRef.current, {
                y: -10,
                duration: 2,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1,
                delay: 2
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="min-h-screen snap-start">
            <div ref={containerRef} className="relative z-10 p-16 min-h-screen">
                <h2 className="text-3xl font-bold text-white text-center pb-8">
                    Présentation
                </h2>
                <div className="w-full max-w-7xl mx-auto grid gap-10 content-center">
                    {/* Description Section */}
                    <section ref={descriptionRef} className="grid lg:grid-cols-3 gap-6 w-full">
                        <div className="lg:col-span-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/15 shadow-lg">
                            <p className="text-base md:text-lg text-gray-200 leading-relaxed mb-4">
                                Étudiant en informatique au sein de <span className="text-blue-400 font-semibold">Bordeaux Ynov Campus</span>. Je suis passionné par le développement web fullstack et l&apos;exploration de diverses technologies.
                            </p>
                            <p className="text-base md:text-lg text-gray-200 leading-relaxed">
                                Je crée des solutions innovantes et performantes qui allient <span className="text-purple-400">créativité</span>, <span className="text-blue-400">efficacité</span> et <span className="text-green-400">maîtrise technique</span>.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 shadow-lg flex items-center">
                            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                                J&apos;ai eu l&apos;occasion de porter plusieurs projets en tout genre, allant de la simple page web, à des applications plus complexes, en passant par le serveur de jeu.
                            </p>
                        </div>
                    </section>

                    {/* Quote Section */}
                    <blockquote ref={quoteRef} className="relative w-full max-w-full mx-auto">
                        {/* <div className="absolute -left-1 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div> */}
                        <div className="pl-8 py-6 bg-white/8 backdrop-blur-sm rounded-2xl border border-white/15 shadow-xl">
                            <p className="text-lg md:text-xl text-gray-100 italic font-light leading-relaxed mb-3">
                                « La seule façon de faire du bon travail est d&apos;aimer ce que l&apos;on fait. »
                            </p>
                            <cite className="text-blue-400 text-base font-medium">— Steve Jobs</cite>
                        </div>
                    </blockquote>

                    {/* Birth Info and CV Section */}
                    <div className="grid lg:grid-cols-2 gap-6 w-full items-center">
                        {/* Birth Info Section */}
                        <section ref={birthRef} className="relative">
                            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl p-8 border border-blue-500/30 shadow-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Naissance</h3>
                                </div>
                                <p className="text-base text-gray-200 leading-relaxed">
                                    Je suis né le <span className="text-blue-400 font-semibold">01/11/2004</span> à Paris.
                                    J&apos;ai vécu 3 années à Paris avant de déménager à <span className="text-purple-400 font-semibold">Bordeaux</span> où je vis actuellement.
                                </p>
                            </div>
                        </section>

                        {/* CV Section */}
                        <section ref={cvRef} className="flex justify-center lg:justify-start">
                            <button className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-blue-500/25 transform hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="relative z-10 text-base">Télécharger mon CV</span>
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}