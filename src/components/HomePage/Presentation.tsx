'use client';
import { gsap } from 'gsap';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, Eye, X } from 'react-bootstrap-icons';
import { SectionHeading } from './SectionHeading';

export function Presentation() {
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

    const handleDownloadCV = () => {
        const link = document.createElement('a');
        link.href = '/cv.pdf';
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
        <section id="presentation" className="relative py-24 md:py-32">
            <div className="mx-auto max-w-6xl px-6 md:px-10">
                <SectionHeading title="Présentation" />

                <div className="grid gap-4 md:grid-cols-6">
                    <article className="card p-6  md:p-8 md:col-span-4">
                        <div className="space-y-4 text-lg text-zinc-300 leading-relaxed">
                            <p>
                                Étudiant en informatique au sein de{' '}
                                <span className="text-zinc-50">Bordeaux Ynov Campus</span>. Je suis passionné par le
                                développement web fullstack et l&apos;exploration de diverses technologies.
                            </p>
                            <p>
                                Je crée des solutions innovantes et performantes qui allient créativité, efficacité et
                                maîtrise technique.
                            </p>
                            <p className="text-base text-zinc-400">
                                J&apos;ai eu l&apos;occasion de porter plusieurs projets en tout genre, allant de la
                                simple page web, à des applications plus complexes, en passant par le serveur de jeu.
                            </p>
                        </div>
                    </article>

                    <article className="card flex flex-col justify-between gap-8 p-6 md:col-span-2">
                        <div>
                            <p className="eyebrow">Âge</p>
                            <p className="mt-2 font-semibold text-6xl text-zinc-50 tracking-tighter">
                                {age}
                                <span className="ml-2 text-2xl text-zinc-500 tracking-normal">ans</span>
                            </p>
                        </div>
                        <div className="space-y-3 text-sm text-zinc-400">
                            <p>
                                Né le <span className="text-zinc-200">01/11/2004</span> à Paris. J&apos;ai vécu 3 années
                                à Paris avant de déménager à <span className="text-zinc-200">Bordeaux</span>, où je vis
                                actuellement.
                            </p>
                            <p className="border-zinc-800 border-t pt-3 font-mono text-xs">
                                Prochain anniversaire :{' '}
                                <span className="text-accent">
                                    {daysUntilBirthday === 0
                                        ? "aujourd'hui !"
                                        : `${daysUntilBirthday} jour${daysUntilBirthday > 1 ? 's' : ''}`}
                                </span>
                            </p>
                        </div>
                    </article>

                    <blockquote className="card flex flex-col justify-center p-6  md:p-8 md:col-span-3">
                        <p className="font-medium text-2xl text-zinc-100 leading-snug tracking-tight">
                            « La seule façon de faire du bon travail est d&apos;aimer ce que l&apos;on fait. »
                        </p>
                        <cite className="eyebrow mt-4 not-italic">Steve Jobs</cite>
                    </blockquote>

                    <article className="card flex flex-col justify-between gap-6 p-6  md:p-8 md:col-span-3">
                        <div>
                            <h3 className="font-medium text-lg text-zinc-50">CV</h3>
                            <p className="mt-3 text-zinc-300">
                                Découvrez mon parcours, mes compétences et mes expériences professionnelles.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button type="button" onClick={handlePreviewCV} className="btn btn-primary">
                                <Eye className="h-4 w-4" />
                                Voir le CV
                            </button>
                            <button type="button" onClick={handleDownloadCV} className="btn btn-secondary">
                                <Download className="h-4 w-4" />
                                Télécharger
                            </button>
                        </div>
                    </article>
                </div>
            </div>

            {showPreview && (
                <div
                    ref={modalRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Prévisualisation du CV"
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
                        className="relative flex h-[90dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950"
                        style={{ willChange: 'transform, opacity' }}
                    >
                        <div className="flex items-center justify-between border-zinc-800 border-b px-4 py-3">
                            <h3 className="font-medium text-sm text-zinc-200">CV Nathan Bonnell.pdf</h3>
                            <div className="flex gap-2">
                                <button type="button" onClick={handleDownloadCV} className="btn btn-primary py-1.5">
                                    <Download className="h-4 w-4" />
                                    Télécharger
                                </button>
                                <button
                                    type="button"
                                    onClick={closePreview}
                                    aria-label="Fermer la prévisualisation"
                                    className="btn btn-secondary px-2.5 py-1.5"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <iframe
                            src="/cv.pdf"
                            className="w-full flex-1 border-0 bg-white"
                            title="Prévisualisation du CV"
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
