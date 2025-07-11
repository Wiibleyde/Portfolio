"use client"
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Envelope, Github, Linkedin, Heart } from 'react-bootstrap-icons';
import Link from 'next/link';

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
                            gsap.fromTo(elements,
                                { opacity: 0, y: 30 },
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.8,
                                    stagger: 0.2,
                                    ease: "power2.out"
                                }
                            );
                        }
                    }
                });
            },
            { threshold: 0.3 }
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
        <footer id="contact" ref={footerRef} className="min-h-screen snap-start relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 flex items-center justify-center">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full" style={{
                    backgroundImage: `radial-gradient(circle at 20% 80%, #3b82f6 0%, transparent 50%), 
                                     radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)`,
                }}></div>
            </div>

            <div ref={contentRef} className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                {/* Main heading */}
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Restons en contact
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
                </div>

                {/* Contact info */}
                <div className="mb-8">
                    <p className="text-xl text-gray-300 mb-2">nathan@bonnell.fr</p>
                    <p className="text-gray-400">Bordeaux, France</p>
                </div>

                {/* Social links */}
                <div className="flex justify-center gap-6 mb-12">
                    <a href="https://github.com/Wiibleyde" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile"
                        className="group bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all duration-300 hover:scale-110">
                        <Github className="w-6 h-6 text-gray-300 group-hover:text-white" />
                    </a>
                    <a href="https://www.linkedin.com/in/nathan-bonnell-57736926a" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile"
                        className="group bg-white/10 hover:bg-blue-500/50 p-4 rounded-full transition-all duration-300 hover:scale-110">
                        <Linkedin className="w-6 h-6 text-gray-300 group-hover:text-white" />
                    </a>
                    <a href="mailto:nathan@bonnell.fr" aria-label="Envoyer un email à Nathan Bonnell"
                        className="group bg-white/10 hover:bg-purple-500/50 p-4 rounded-full transition-all duration-300 hover:scale-110">
                        <Envelope className="w-6 h-6 text-gray-300 group-hover:text-white" />
                    </a>
                </div>

                {/* Quote */}
                <div className="mb-12">
                    <p className="text-lg text-gray-300 italic mb-4">
                        « La meilleure façon de prédire l&apos;avenir est de l&apos;inventer. » — Alan Kay
                    </p>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/20 pt-8">
                    <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                        © 2025 Nathan Bonnell. Fait avec
                        <Heart className="w-4 h-4 text-red-400 fill-current" />
                        à Bordeaux
                    </p>

                    <p className="text-sm text-gray-500 mt-4">
                        Retrouvez aussi les <a href="/hope_pictures" className="hover:text-gray-400 underline decoration-dotted" aria-label='Photos de Hope'>photos de Hope</a>, un <a href='/tools/pdfAssembler' className="hover:text-gray-400 underline decoration-dotted" aria-label='Outil de fusion de PDF'>outil de fusion de PDF</a>, un <a href='/tools/qrcode' className="hover:text-gray-400 underline decoration-dotted" aria-label='Générateur de QR Code'>générateur de QR Code</a> et un <a href='/tools/vcard' className="hover:text-gray-400 underline decoration-dotted" aria-label='Générateur de carte de visite'>générateur de carte de visite</a> que j&apos;ai réalisé.
                    </p>

                    <p className="text-sm text-gray-500 mt-4">
                        Pour accèder aux <Link href="/legal-mentions" className="hover:text-gray-400 underline decoration-dotted" aria-label='Mentions légales'>mentions légales</Link>, cliquez sur les liens.
                    </p>

                    <p className="text-xs text-gray-500 mt-4">
                        This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" className="hover:text-gray-400 underline" aria-label='Politique de confidentialité'>Privacy Policy</a> and <a href="https://policies.google.com/terms" className="hover:text-gray-400 underline" aria-label="Conditions d'utilisation">Terms of Service</a> apply.
                    </p>
                </div>
            </div>
        </footer>
    );
}