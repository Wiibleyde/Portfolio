'use client';
import { gsap } from 'gsap';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function Presentation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const quoteRef = useRef<HTMLQuoteElement>(null);
    const descriptionRef = useRef<HTMLElement>(null);
    const birthRef = useRef<HTMLElement>(null);
    const cvRef = useRef<HTMLElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const modalContentRef = useRef<HTMLDivElement>(null);
    const [age, setAge] = useState(0);
    const [daysUntilBirthday, setDaysUntilBirthday] = useState(0);
    const [showPreview, setShowPreview] = useState(false);

    // Calculate age and days until birthday
    const calculateAgeAndCountdown = useCallback(() => {
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
    }, []);

    // Update age and countdown on component mount and daily
    useEffect(() => {
        calculateAgeAndCountdown();

        // Update daily
        const interval = setInterval(calculateAgeAndCountdown, 24 * 60 * 60 * 1000);

        return () => clearInterval(interval);
    }, [calculateAgeAndCountdown]);

    useScrollAnimation(containerRef, () => {
        const tl = gsap.timeline({ delay: 0.2 });
        tl.to(descriptionRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
            .to(quoteRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4')
            .to(birthRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.3')
            .to(cvRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' }, '-=0.2');
    });

    // Set initial state
    useEffect(() => {
        gsap.set([quoteRef.current, descriptionRef.current, birthRef.current, cvRef.current], { opacity: 0, y: 50 });
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
                '-=0.1',
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
                '-=0.1',
            );
        }
    }, [showPreview]);

    return (
        <div
            id="presentation"
            className="relative min-h-screen snap-start bg-linear-to-br from-slate-900 via-blue-900/20 to-purple-900/30 py-16"
        >
            {/* Distinctive background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%),
                                     radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`,
                    }}
                />
            </div>

            <div ref={containerRef} className="relative z-10 px-10">
                <div className="mb-8 text-center">
                    <h2 className="mb-3 font-bold text-3xl text-white md:text-4xl">Présentation</h2>
                    <div className="mx-auto h-1 w-20 rounded-full bg-linear-to-r from-blue-500 to-purple-600" />
                </div>

                <div className="mx-auto grid w-full max-w-7xl content-center gap-8">
                    {/* Description Section */}
                    <section ref={descriptionRef} className="grid w-full gap-6 lg:grid-cols-3">
                        <div className="rounded-2xl border border-white/15 bg-linear-to-r from-white/10 to-white/5 p-6 shadow-lg backdrop-blur-sm lg:col-span-2">
                            <p className="mb-3 text-base text-gray-200 leading-relaxed">
                                Étudiant en informatique au sein de{' '}
                                <span className="font-semibold text-blue-400">Bordeaux Ynov Campus</span>. Je suis
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
                        <div className="flex items-center rounded-2xl border border-blue-500/20 bg-linear-to-br from-blue-500/10 to-purple-500/10 p-5 shadow-lg backdrop-blur-sm">
                            <p className="text-base text-gray-300 leading-relaxed">
                                J&apos;ai eu l&apos;occasion de porter plusieurs projets en tout genre, allant de la
                                simple page web, à des applications plus complexes, en passant par le serveur de jeu.
                            </p>
                        </div>
                    </section>

                    {/* Quote Section */}
                    <blockquote ref={quoteRef} className="relative mx-auto w-full">
                        <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-linear-to-br from-white/10 via-white/8 to-white/5 p-6 shadow-2xl backdrop-blur-md md:p-8">
                            {/* Decorative background elements */}
                            <div className="-translate-y-16 absolute top-0 right-0 h-32 w-32 translate-x-16 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
                            <div className="-translate-x-12 absolute bottom-0 left-0 h-24 w-24 translate-y-12 rounded-full bg-linear-to-tr from-purple-500/15 to-blue-500/15 blur-2xl" />

                            {/* Opening quote */}
                            <div className="absolute top-4 left-6 select-none font-serif text-6xl text-blue-400/30 leading-none">
                                &quot;
                            </div>

                            {/* Quote content */}
                            <div className="relative z-10 pt-4">
                                <p className="mb-2 text-center font-light text-gray-100 text-xl italic leading-relaxed">
                                    La seule façon de faire du bon travail est d&apos;aimer ce que l&apos;on fait.
                                </p>

                                {/* Author section */}
                                <div className="flex items-center justify-center gap-3">
                                    <div className="h-0.5 w-10 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
                                    <cite className="font-semibold text-blue-400 text-lg not-italic tracking-wide">
                                        Steve Jobs
                                    </cite>
                                    <div className="h-0.5 w-10 bg-linear-to-r from-transparent via-blue-400 to-transparent" />
                                </div>
                            </div>

                            {/* Closing quote */}
                            <div className="absolute right-6 bottom-4 rotate-180 select-none font-serif text-6xl text-purple-400/30 leading-none">
                                &quot;
                            </div>
                        </div>
                    </blockquote>

                    {/* Birth Info and CV Section */}
                    <div className="grid w-full items-stretch gap-6 lg:grid-cols-2">
                        {/* Birth Info Section */}
                        <section ref={birthRef} className="relative">
                            <div className="h-full rounded-2xl border border-blue-500/30 bg-linear-to-r from-blue-500/20 to-purple-500/20 p-6 shadow-xl backdrop-blur-md">
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-r from-blue-500 to-purple-600">
                                        <svg
                                            aria-hidden="true"
                                            className="h-3.5 w-3.5 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-lg text-white">Naissance</h3>
                                </div>
                                <p className="mb-3 text-base text-gray-200 leading-relaxed">
                                    Je suis né le <span className="font-semibold text-blue-400">01/11/2004</span> à
                                    Paris. J&apos;ai vécu 3 années à Paris avant de déménager à{' '}
                                    <span className="font-semibold text-purple-400">Bordeaux</span> où je vis
                                    actuellement.
                                </p>
                                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                                    <div className="flex-1 rounded-lg bg-white/10 p-2.5">
                                        <div className="mb-1 text-gray-400 text-sm">Âge actuel</div>
                                        <div className="font-bold text-lg text-white">{age} ans</div>
                                    </div>
                                    <div className="flex-1 rounded-lg bg-white/10 p-2.5">
                                        <div className="mb-1 text-gray-400 text-sm">Prochain anniversaire</div>
                                        <div className="font-bold text-lg text-purple-400">
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
                            <div className="flex h-full flex-col rounded-2xl border border-emerald-500/30 bg-linear-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 p-6 shadow-xl backdrop-blur-md">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-r from-emerald-500 to-teal-600 shadow-lg">
                                        <svg
                                            aria-hidden="true"
                                            className="h-4 w-4 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-white text-xl">Mon CV</h3>
                                </div>

                                <p className="mb-6 text-gray-200 leading-relaxed">
                                    Découvrez mon parcours, mes compétences et mes expériences professionnelles.
                                </p>

                                <div className="flex flex-1 flex-col justify-center space-y-3">
                                    <button
                                        type="button"
                                        className="group relative flex w-full transform items-center justify-center gap-3 overflow-hidden rounded-xl bg-linear-to-r from-blue-600 via-blue-700 to-purple-700 px-6 py-4 font-semibold text-white shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:from-blue-700 hover:via-purple-700 hover:to-purple-800 hover:shadow-blue-500/30 active:scale-[0.98]"
                                        aria-label="Prévisualiser le CV"
                                        onClick={handlePreviewCV}
                                    >
                                        {/* Animated background overlay */}
                                        <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-white/0 via-white/10 to-white/0 transition-transform duration-700 ease-in-out group-hover:translate-x-full" />

                                        {/* Glow effect */}
                                        <div className="-z-10 absolute inset-0 rounded-xl bg-linear-to-r from-blue-400/50 to-purple-400/50 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-70" />

                                        <svg
                                            aria-hidden="true"
                                            className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:scale-110"
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
                                        <span className="relative z-10 font-semibold text-lg tracking-wide">
                                            Prévisualiser le CV
                                        </span>

                                        {/* Corner accents */}
                                        <div className="absolute top-1 right-1 h-3 w-3 rounded-tr-lg border-white/30 border-t-2 border-r-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        <div className="absolute bottom-1 left-1 h-3 w-3 rounded-bl-lg border-white/30 border-b-2 border-l-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    </button>

                                    <button
                                        type="button"
                                        aria-label="Télécharger le CV"
                                        className="group relative flex w-full transform items-center justify-center gap-3 overflow-hidden rounded-xl bg-linear-to-r from-emerald-600 via-green-600 to-teal-600 px-6 py-4 font-semibold text-white shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 hover:shadow-emerald-500/30 active:scale-[0.98]"
                                        onClick={handleDownloadCV}
                                    >
                                        {/* Animated background overlay */}
                                        <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-white/0 via-white/10 to-white/0 transition-transform duration-700 ease-in-out group-hover:translate-x-full" />

                                        {/* Glow effect */}
                                        <div className="-z-10 absolute inset-0 rounded-xl bg-linear-to-r from-emerald-400/50 to-teal-400/50 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-70" />

                                        <svg
                                            aria-hidden="true"
                                            className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:animate-bounce"
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
                                        <span className="relative z-10 font-semibold text-lg tracking-wide">
                                            Télécharger le CV
                                        </span>

                                        {/* Download indicator */}
                                        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-white/50 opacity-0 transition-opacity duration-300 group-hover:animate-ping group-hover:opacity-100" />
                                    </button>
                                </div>

                                {/* Decorative elements */}
                                <div className="-top-2 -right-2 absolute h-6 w-6 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 opacity-70 blur-sm" />
                                <div className="-bottom-1 -left-1 absolute h-4 w-4 rounded-full bg-linear-to-tr from-green-400 to-emerald-500 opacity-50 blur-sm" />
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* CV Preview Modal */}
            {showPreview && (
                <div
                    ref={modalRef}
                    role="presentation"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    style={{ willChange: 'opacity' }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closePreview();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') closePreview();
                    }}
                >
                    <div
                        ref={modalContentRef}
                        className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                        style={{ willChange: 'transform, opacity' }}
                    >
                        <div className="flex items-center justify-between border-gray-200 border-b bg-linear-to-r from-blue-50 to-purple-50 p-4">
                            <h3 className="flex items-center gap-2 font-semibold text-gray-900 text-lg">
                                <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                                Prévisualisation du CV
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleDownloadCV}
                                    aria-label="Télécharger le CV"
                                    className="group flex transform items-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 px-4 py-2 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/25"
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="h-4 w-4 group-hover:animate-bounce"
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
                                    type="button"
                                    onClick={closePreview}
                                    aria-label="Fermer la prévisualisation"
                                    className="group transform rounded-lg bg-linear-to-r from-gray-500 to-gray-600 px-4 py-2 text-white transition-all duration-200 hover:scale-105 hover:from-gray-600 hover:to-gray-700"
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90"
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
                        <div className="h-[calc(90vh-80px)] bg-linear-to-br from-gray-50 to-gray-100 p-4">
                            <div className="relative h-full w-full overflow-hidden rounded-lg shadow-inner">
                                <iframe
                                    src="/files/CV Nathan Bonnell.pdf"
                                    className="h-full w-full border-0"
                                    title="Prévisualisation du CV"
                                />
                                <div className="pointer-events-none absolute inset-0 rounded-lg border-2 border-blue-200/50" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
