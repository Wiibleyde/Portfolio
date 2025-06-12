"use client"
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export function Presentation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const quoteRef = useRef<HTMLQuoteElement>(null);
    const descriptionRef = useRef<HTMLElement>(null);
    const birthRef = useRef<HTMLElement>(null);
    const cvRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [age, setAge] = useState(0);
    const [daysUntilBirthday, setDaysUntilBirthday] = useState(0);

    // Calculate age and days until birthday
    const calculateAgeAndCountdown = () => {
        const birthDate = new Date(2004, 10, 1); // November 1, 2004 (month is 0-indexed)
        const today = new Date();

        // Calculate age
        let currentAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            currentAge--;
        }

        // Calculate days until next birthday
        const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

        if (today > nextBirthday) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }

        const timeDiff = nextBirthday.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        setAge(currentAge);
        setDaysUntilBirthday(daysDiff);
    };

    // Update age and countdown on component mount and daily
    useEffect(() => {
        calculateAgeAndCountdown();

        // Update daily
        const interval = setInterval(calculateAgeAndCountdown, 24 * 60 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true);

                        // Main timeline
                        const tl = gsap.timeline({ delay: 0.2 });

                        tl.to(descriptionRef.current, {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power2.out"
                        })
                            .to(quoteRef.current, {
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
                    }
                });
            },
            { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [isVisible]);

    // Set initial state
    useEffect(() => {
        gsap.set([quoteRef.current, descriptionRef.current, birthRef.current, cvRef.current], {
            opacity: 0,
            y: 50
        });
    }, []);

    const handleDownloadCV = () => {
        const link = document.createElement('a');
        link.href = '/files/CV Nathan Bonnell.pdf';
        link.download = 'CV Nathan Bonnell.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="snap-start min-h-screen relative bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/30 py-16">
            {/* Distinctive background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), 
                                     radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`
                }}></div>
            </div>

            <div ref={containerRef} className="relative z-10 px-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Présentation
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
                </div>

                <div className="w-full max-w-7xl mx-auto grid gap-8 content-center">
                    {/* Description Section */}
                    <section ref={descriptionRef} className="grid lg:grid-cols-3 gap-6 w-full">
                        <div className="lg:col-span-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/15 shadow-lg">
                            <p className="text-base text-gray-200 leading-relaxed mb-3">
                                Étudiant en informatique au sein de <span className="text-blue-400 font-semibold">Bordeaux Ynov Campus</span>. Je suis passionné par le développement web fullstack et l&apos;exploration de diverses technologies.
                            </p>
                            <p className="text-base text-gray-200 leading-relaxed">
                                Je crée des solutions innovantes et performantes qui allient <span className="text-purple-400">créativité</span>, <span className="text-blue-400">efficacité</span> et <span className="text-green-400">maîtrise technique</span>.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-5 border border-blue-500/20 shadow-lg flex items-center">
                            <p className="text-base text-gray-300 leading-relaxed">
                                J&apos;ai eu l&apos;occasion de porter plusieurs projets en tout genre, allant de la simple page web, à des applications plus complexes, en passant par le serveur de jeu.
                            </p>
                        </div>
                    </section>

                    {/* Quote Section */}
                    <blockquote ref={quoteRef} className="relative w-full max-w-4xl mx-auto">
                        <div className="relative bg-gradient-to-br from-white/10 via-white/8 to-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl overflow-hidden">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/15 to-blue-500/15 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>

                            {/* Opening quote */}
                            <div className="absolute top-4 left-6 text-6xl text-blue-400/30 font-serif leading-none select-none">
                                &quot;
                            </div>

                            {/* Quote content */}
                            <div className="relative z-10 pt-4">
                                <p className="text-xl text-gray-100 font-light leading-relaxed text-center mb-2 italic">
                                    La seule façon de faire du bon travail est d&apos;aimer ce que l&apos;on fait.
                                </p>

                                {/* Author section */}
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-10 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                                    <cite className="text-blue-400 text-lg font-semibold not-italic tracking-wide">
                                        Steve Jobs
                                    </cite>
                                    <div className="w-10 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                                </div>
                            </div>

                            {/* Closing quote */}
                            <div className="absolute bottom-4 right-6 text-6xl text-purple-400/30 font-serif leading-none select-none rotate-180">
                                &quot;
                            </div>
                        </div>
                    </blockquote>

                    {/* Birth Info and CV Section */}
                    <div className="grid lg:grid-cols-2 gap-6 w-full items-center">
                        {/* Birth Info Section */}
                        <section ref={birthRef} className="relative">
                            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30 shadow-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Naissance</h3>
                                </div>
                                <p className="text-base text-gray-200 leading-relaxed mb-3">
                                    Je suis né le <span className="text-blue-400 font-semibold">01/11/2004</span> à Paris.
                                    J&apos;ai vécu 3 années à Paris avant de déménager à <span className="text-purple-400 font-semibold">Bordeaux</span> où je vis actuellement.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 mt-3">
                                    <div className="bg-white/10 rounded-lg p-2.5 flex-1">
                                        <div className="text-sm text-gray-400 mb-1">Âge actuel</div>
                                        <div className="text-lg font-bold text-white">{age} ans</div>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-2.5 flex-1">
                                        <div className="text-sm text-gray-400 mb-1">Prochain anniversaire</div>
                                        <div className="text-lg font-bold text-purple-400">
                                            {daysUntilBirthday === 0 ? "Aujourd'hui! 🎉" : `${daysUntilBirthday} jour${daysUntilBirthday > 1 ? 's' : ''}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* CV Section */}
                        <section ref={cvRef} className="flex justify-center lg:justify-start">
                            <button className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-blue-500/25 transform hover:scale-105" onClick={handleDownloadCV}>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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