"use client";
import { Be_Vietnam_Pro } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Logo from "@public/img/sabs/sabs-logo.png";

const BeVietnam = Be_Vietnam_Pro({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export function Footer() {
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const dividerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const copyrightRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true);

                        const tl = gsap.timeline({ delay: 0.2 });

                        tl.to(logoRef.current, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.8,
                            ease: "back.out(1.2)"
                        })
                            .to(titleRef.current, {
                                opacity: 1,
                                y: 0,
                                duration: 0.6,
                                ease: "power2.out"
                            }, "-=0.4")
                            .to(dividerRef.current, {
                                opacity: 1,
                                scaleX: 1,
                                duration: 0.6,
                                ease: "power2.out"
                            }, "-=0.2")
                            .to(contentRef.current?.children || [], {
                                opacity: 1,
                                y: 0,
                                duration: 0.6,
                                ease: "power2.out",
                                stagger: 0.1
                            }, "-=0.2")
                            .to(copyrightRef.current, {
                                opacity: 1,
                                y: 0,
                                duration: 0.6,
                                ease: "power2.out"
                            }, "-=0.2");
                    }
                });
            },
            { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        gsap.set([titleRef.current, copyrightRef.current], {
            opacity: 0,
            y: 30
        });

        gsap.set(logoRef.current, {
            opacity: 0,
            scale: 0.8
        });

        gsap.set(dividerRef.current, {
            opacity: 1,
            scaleX: 0,
            transformOrigin: "center"
        });

        gsap.set(contentRef.current?.children || [], {
            opacity: 0,
            y: 20
        });

        // Floating animation for logo
        gsap.to(logoRef.current, {
            y: -3,
            duration: 2.5,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1
        });
    }, []);

    return (
        <footer className="snap-start h-screen relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900" style={{ fontFamily: BeVietnam.style.fontFamily }}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, #7373B4 0%, transparent 70%), 
                                     radial-gradient(circle at 75% 75%, #85527E 0%, transparent 70%)`
                }}></div>
            </div>

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gradient-to-r from-sabs-primary to-sabs-gradient-1 rounded-full animate-pulse [animation-delay:0s] [animation-duration:3s] shadow-lg shadow-sabs-primary/30"></div>
                <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-gradient-to-r from-sabs-gradient-2 to-sabs-gradient-3 rounded-full animate-pulse [animation-delay:1s] [animation-duration:4s] shadow-lg shadow-sabs-gradient-2/30"></div>
                <div className="absolute top-1/2 left-1/3 w-2.5 h-2.5 bg-gradient-to-r from-sabs-gradient-1 to-sabs-primary rounded-full animate-pulse [animation-delay:2s] [animation-duration:5s] shadow-lg shadow-sabs-gradient-1/30"></div>
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-gradient-to-r from-sabs-gradient-3 to-sabs-gradient-2 rounded-full animate-pulse [animation-delay:0.5s] [animation-duration:3.5s] shadow-lg shadow-sabs-gradient-3/30"></div>
            </div>

            <div ref={containerRef} className="relative z-10 container mx-auto px-8 h-full flex flex-col justify-center">
                <div className="max-w-6xl mx-auto w-full">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <div ref={logoRef} className="mb-8 group">
                            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-white/2 backdrop-blur-2xl border border-white/20 shadow-[0_20px_40px_0_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_0_rgba(139,92,246,0.2)] transition-all duration-700 hover:scale-105 inline-block">
                                <Image
                                    src={Logo}
                                    alt="SABS Logo"
                                    width={80}
                                    height={80}
                                    className="drop-shadow-xl filter brightness-110"
                                />
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-sabs-gradient-1/20 via-sabs-primary/20 to-sabs-gradient-3/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                            </div>
                        </div>

                        <h2 ref={titleRef} className="text-4xl md:text-6xl font-thin text-white mb-4 tracking-[-0.02em]">
                            <span className="text-transparent bg-gradient-to-r from-sabs-gradient-1 to-sabs-primary bg-clip-text font-medium">SABS</span>
                        </h2>
                        <div ref={dividerRef} className="w-32 h-[2px] bg-gradient-to-r from-sabs-gradient-1 via-sabs-gradient-2 to-sabs-primary mx-auto mb-8 rounded-full"></div>
                    </div>

                    {/* Main Content */}
                    <div ref={contentRef} className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
                        {/* Contact Info */}
                        <div className="group p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-500">
                            <h3 className="text-sabs-primary font-semibold text-xl mb-4 tracking-tight flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-sabs-primary to-sabs-gradient-1 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                Contact
                            </h3>
                            <div className="space-y-3 text-gray-300">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-sabs-gradient-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586l-8 8-8-8V4z" />
                                        <path d="M2 7.414V18a2 2 0 002 2h16a2 2 0 002-2V7.414l-8 8-8-8z" />
                                    </svg>
                                    <span className="text-sm">max.janssens@sabs.com</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-sabs-gradient-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="text-sm">555-1234</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-sabs-gradient-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                    <span className="text-sm">San Andreas, LS</span>
                                </div>
                            </div>
                        </div>

                        {/* Services */}
                        <div className="group p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-500">
                            <h3 className="text-sabs-primary font-semibold text-xl mb-4 tracking-tight flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-sabs-gradient-2 to-sabs-gradient-3 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                                    </svg>
                                </div>
                                Services
                            </h3>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-sabs-gradient-1 rounded-full"></div>
                                    Retransmission multicaméra
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-sabs-gradient-2 rounded-full"></div>
                                    Production en direct
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-sabs-gradient-3 rounded-full"></div>
                                    Couverture événementielle
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-sabs-primary rounded-full"></div>
                                    Solutions audiovisuelles
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div ref={copyrightRef} className="border-t border-white/10 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-gray-400 text-sm">
                                &copy; {new Date().getFullYear()} <span className="text-sabs-primary font-medium">SABS</span> - San Andreas Broadcast Service. Tous droits réservés.
                            </p>
                            <div className="flex items-center gap-6 text-sm text-gray-400">
                                <a href="#" className="hover:text-sabs-primary transition-colors duration-300">Mentions légales</a>
                                <a href="#" className="hover:text-sabs-primary transition-colors duration-300">Confidentialité</a>
                                <a href="#" className="hover:text-sabs-primary transition-colors duration-300">CGU</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}