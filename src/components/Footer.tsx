'use client';
import { gsap } from 'gsap';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Envelope, Github, Heart, Linkedin } from 'react-bootstrap-icons';

export function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true);

                        const elements = contentRef.current?.children;
                        if (elements) {
                            gsap.fromTo(
                                elements,
                                { opacity: 0, y: 30 },
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.8,
                                    stagger: 0.2,
                                    ease: 'power2.out',
                                },
                            );
                        }
                    }
                });
            },
            { threshold: 0.3 },
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        if (contentRef.current) {
            gsap.set(contentRef.current.children, { opacity: 0, y: 30 });
        }
    }, []);

    return (
        <footer
            id="contact"
            ref={footerRef}
            className="relative flex min-h-screen snap-start items-center justify-center bg-linear-to-br from-gray-900 via-slate-900 to-gray-800"
        >
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

            <div ref={contentRef} className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                {/* Main heading */}
                <div className="mb-12">
                    <h2 className="mb-4 font-bold text-4xl text-white md:text-5xl">Restons en contact</h2>
                    <div className="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-blue-500 to-purple-600" />
                </div>

                {/* Contact info */}
                <div className="mb-8">
                    <p className="mb-2 text-gray-300 text-xl">nathan@bonnell.fr</p>
                    <p className="text-gray-400">Bordeaux, France</p>
                </div>

                {/* Social links */}
                <div className="mb-12 flex justify-center gap-6">
                    <Link
                        href="https://github.com/Wiibleyde"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub Profile"
                        className="group rounded-full bg-white/10 p-4 transition-all duration-300 hover:scale-110 hover:bg-white/20"
                    >
                        <Github className="h-6 w-6 text-gray-300 group-hover:text-white" />
                    </Link>
                    <Link
                        href="https://www.linkedin.com/in/nathan-bonnell-57736926a"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn Profile"
                        className="group rounded-full bg-white/10 p-4 transition-all duration-300 hover:scale-110 hover:bg-blue-500/50"
                    >
                        <Linkedin className="h-6 w-6 text-gray-300 group-hover:text-white" />
                    </Link>
                    <Link
                        href="mailto:nathan@bonnell.fr"
                        aria-label="Envoyer un email à Nathan Bonnell"
                        className="group rounded-full bg-white/10 p-4 transition-all duration-300 hover:scale-110 hover:bg-purple-500/50"
                    >
                        <Envelope className="h-6 w-6 text-gray-300 group-hover:text-white" />
                    </Link>
                </div>

                {/* Quote */}
                <div className="mb-12">
                    <p className="mb-4 text-gray-300 text-lg italic">
                        « La meilleure façon de prédire l&apos;avenir est de l&apos;inventer. » — Alan Kay
                    </p>
                </div>

                {/* Copyright */}
                <div className="border-white/20 border-t pt-8">
                    <p className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                        © 2025 Nathan Bonnell. Fait avec
                        <Heart className="h-4 w-4 fill-current text-red-400" />à Bordeaux
                    </p>

                    <p className="mt-4 text-gray-500 text-sm">
                        Retrouvez aussi un{' '}
                        <Link
                            href="/tools/pdfAssembler"
                            className="underline decoration-dotted hover:text-gray-400"
                            aria-label="Outil de fusion de PDF"
                        >
                            outil de fusion de PDF
                        </Link>
                        , un{' '}
                        <Link
                            href="/tools/qrcode"
                            className="underline decoration-dotted hover:text-gray-400"
                            aria-label="Générateur de QR Code"
                        >
                            générateur de QR Code
                        </Link>{' '}
                        et un{' '}
                        <Link
                            href="/tools/vcard"
                            className="underline decoration-dotted hover:text-gray-400"
                            aria-label="Générateur de carte de visite"
                        >
                            générateur de carte de visite
                        </Link>{' '}
                        que j&apos;ai réalisé.
                    </p>

                    <p className="mt-4 text-gray-500 text-sm">
                        Pour accèder aux{' '}
                        <Link
                            href="/legal-mentions"
                            className="underline decoration-dotted hover:text-gray-400"
                            aria-label="Mentions légales"
                        >
                            mentions légales
                        </Link>
                        , cliquez sur les liens.
                    </p>

                    <p className="mt-4 text-gray-500 text-xs">
                        This site is protected by reCAPTCHA and the Google{' '}
                        <Link
                            href="https://policies.google.com/privacy"
                            className="underline hover:text-gray-400"
                            aria-label="Politique de confidentialité"
                        >
                            Privacy Policy
                        </Link>{' '}
                        and{' '}
                        <Link
                            href="https://policies.google.com/terms"
                            className="underline hover:text-gray-400"
                            aria-label="Conditions d'utilisation"
                        >
                            Terms of Service
                        </Link>{' '}
                        apply.
                    </p>
                </div>
            </div>
        </footer>
    );
}
