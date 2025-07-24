'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export function Presentation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const quoteRef = useRef<HTMLQuoteElement>(null);
    const descriptionRef = useRef<HTMLElement>(null);
    const birthRef = useRef<HTMLElement>(null);
    const cvRef = useRef<HTMLElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const modalContentRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [age, setAge] = useState(0);
    const [daysUntilBirthday, setDaysUntilBirthday] = useState(0);
    const [showPreview, setShowPreview] = useState(false);

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
                            ease: 'power2.out',
                        })
                            .to(
                                quoteRef.current,
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.8,
                                    ease: 'power2.out',
                                },
                                '-=0.4'
                            )
                            .to(
                                birthRef.current,
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.6,
                                    ease: 'back.out(1.7)',
                                },
                                '-=0.3'
                            )
                            .to(
                                cvRef.current,
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.6,
                                    ease: 'elastic.out(1, 0.5)',
                                },
                                '-=0.2'
                            );
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
            y: 50,
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

    const handlePreviewCV = () => {
        setShowPreview(true);
    };

    const closePreview = () => {
        if (modalRef.current && modalContentRef.current) {
            const tl = gsap.timeline({
                onComplete: () => setShowPreview(false),
            });

            tl.to(modalContentRef.current, {
                scale: 0.8,
                opacity: 0,
                y: 50,
                duration: 0.3,
                ease: 'back.in(1.7)',
            }).to(
                modalRef.current,
                {
                    opacity: 0,
                    duration: 0.2,
                    ease: 'power2.in',
                },
                '-=0.1'
            );
        } else {
            setShowPreview(false);
        }
    };

    // Animation pour l'ouverture de la modal
    useEffect(() => {
        if (showPreview && modalRef.current && modalContentRef.current) {
            // Set initial state
            gsap.set(modalRef.current, { opacity: 0 });
            gsap.set(modalContentRef.current, {
                scale: 0.8,
                opacity: 0,
                y: 30,
            });

            // Animation timeline optimisée
            const tl = gsap.timeline();

            tl.to(modalRef.current, {
                opacity: 1,
                duration: 0.2,
                ease: 'power2.out',
            }).to(
                modalContentRef.current,
                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'back.out(1.2)',
                },
                '-=0.1'
            );
        }
    }, [showPreview]);

    return (
        <div
            id="presentation"
            className="snap-start min-h-screen relative bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/30 py-16"
        >
            {/* Distinctive background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), 
                                     radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`,
                    }}
                ></div>
            </div>

            <div ref={containerRef} className="relative z-10 px-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Présentation</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
                </div>

                <div className="w-full max-w-7xl mx-auto grid gap-8 content-center">
                    {/* Description Section */}
                    <section ref={descriptionRef} className="grid lg:grid-cols-3 gap-6 w-full">
                        <div className="lg:col-span-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/15 shadow-lg">
                            <p className="text-base text-gray-200 leading-relaxed mb-3">
                                Étudiant en informatique au sein de{' '}
                                <span className="text-blue-400 font-semibold">Bordeaux Ynov Campus</span>. Je suis
                                passionné par le développement web fullstack et l&apos;exploration de diverses
                                technologies.
                            </p>
                            <p className="text-base text-gray-200 leading-relaxed">
                                Je crée des solutions innovantes et performantes qui allient{' '}
                                <span className="text-purple-400">créativité</span>,{' '}
                                <span className="text-blue-400">efficacité</span> et{' '}
                                <span className="text-green-400">maîtrise technique</span>.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-5 border border-blue-500/20 shadow-lg flex items-center">
                            <p className="text-base text-gray-300 leading-relaxed">
                                J&apos;ai eu l&apos;occasion de porter plusieurs projets en tout genre, allant de la
                                simple page web, à des applications plus complexes, en passant par le serveur de jeu.
                            </p>
                        </div>
                    </section>

                    {/* Quote Section */}
                    <blockquote ref={quoteRef} className="relative w-full mx-auto">
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
                    <div className="grid lg:grid-cols-2 gap-6 w-full items-stretch">
                        {/* Birth Info Section */}
                        <section ref={birthRef} className="relative">
                            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30 shadow-xl h-full">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Naissance</h3>
                                </div>
                                <p className="text-base text-gray-200 leading-relaxed mb-3">
                                    Je suis né le <span className="text-blue-400 font-semibold">01/11/2004</span> à
                                    Paris. J&apos;ai vécu 3 années à Paris avant de déménager à{' '}
                                    <span className="text-purple-400 font-semibold">Bordeaux</span> où je vis
                                    actuellement.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 mt-3">
                                    <div className="bg-white/10 rounded-lg p-2.5 flex-1">
                                        <div className="text-sm text-gray-400 mb-1">Âge actuel</div>
                                        <div className="text-lg font-bold text-white">{age} ans</div>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-2.5 flex-1">
                                        <div className="text-sm text-gray-400 mb-1">Prochain anniversaire</div>
                                        <div className="text-lg font-bold text-purple-400">
                                            {daysUntilBirthday === 0
                                                ? "Aujourd'hui! 🎉"
                                                : `${daysUntilBirthday} jour${daysUntilBirthday > 1 ? 's' : ''}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* CV Section */}
                        <section ref={cvRef} className="relative">
                            <div className="bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 backdrop-blur-md rounded-2xl p-6 border border-emerald-500/30 shadow-xl h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Mon CV</h3>
                                </div>

                                <p className="text-gray-200 mb-6 leading-relaxed">
                                    Découvrez mon parcours, mes compétences et mes expériences professionnelles.
                                </p>

                                <div className="space-y-3 flex-1 flex flex-col justify-center">
                                    <button
                                        className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-500 flex items-center justify-center gap-3 shadow-2xl hover:shadow-blue-500/30 transform hover:scale-[1.02] active:scale-[0.98]"
                                        aria-label="Prévisualiser le CV"
                                        onClick={handlePreviewCV}
                                    >
                                        {/* Animated background overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>

                                        {/* Glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/50 to-purple-400/50 rounded-xl blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300 -z-10"></div>

                                        <svg
                                            className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2.5}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2.5}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                        <span className="relative z-10 text-lg font-semibold tracking-wide">
                                            Prévisualiser le CV
                                        </span>

                                        {/* Corner accents */}
                                        <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-white/30 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-white/30 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>

                                    <button
                                        aria-label="Télécharger le CV"
                                        className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-500 flex items-center justify-center gap-3 shadow-2xl hover:shadow-emerald-500/30 transform hover:scale-[1.02] active:scale-[0.98]"
                                        onClick={handleDownloadCV}
                                    >
                                        {/* Animated background overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>

                                        {/* Glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/50 to-teal-400/50 rounded-xl blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300 -z-10"></div>

                                        <svg
                                            className="w-5 h-5 relative z-10 group-hover:animate-bounce transition-transform duration-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2.5}
                                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        <span className="relative z-10 text-lg font-semibold tracking-wide">
                                            Télécharger le CV
                                        </span>

                                        {/* Download indicator */}
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                                    </button>
                                </div>

                                {/* Decorative elements */}
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-70 blur-sm"></div>
                                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-tr from-green-400 to-emerald-500 rounded-full opacity-50 blur-sm"></div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* CV Preview Modal */}
            {showPreview && (
                <div
                    ref={modalRef}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    style={{ willChange: 'opacity' }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closePreview();
                    }}
                >
                    <div
                        ref={modalContentRef}
                        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                        style={{ willChange: 'transform, opacity' }}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                Prévisualisation du CV
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDownloadCV}
                                    aria-label="Télécharger le CV"
                                    className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
                                >
                                    <svg
                                        className="w-4 h-4 group-hover:animate-bounce"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    Télécharger
                                </button>
                                <button
                                    onClick={closePreview}
                                    aria-label="Fermer la prévisualisation"
                                    className="group bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                                >
                                    <svg
                                        className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-4 h-[calc(90vh-80px)] bg-gradient-to-br from-gray-50 to-gray-100">
                            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-inner">
                                <iframe
                                    src="/files/CV Nathan Bonnell.pdf"
                                    className="w-full h-full border-0"
                                    title="Prévisualisation du CV"
                                />
                                <div className="absolute inset-0 pointer-events-none border-2 border-blue-200/50 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
