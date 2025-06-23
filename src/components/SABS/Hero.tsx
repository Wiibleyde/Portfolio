"use client";

import { Be_Vietnam_Pro } from "next/font/google";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Logo from "@public/img/sabs/sabs-logo.png";
import { useScroll } from "@/hooks/useScroll";

const BeVietnam = Be_Vietnam_Pro({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export function Hero() {
    const logoRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const { scrollToTarget } = useScroll({ targetId: 'presentation' });

    useEffect(() => {
        const tl = gsap.timeline({ delay: 0.5 });

        // Set initial states
        gsap.set([logoRef.current, titleRef.current, subtitleRef.current, buttonRef.current], {
            opacity: 0,
            y: 30
        });

        gsap.set(logoRef.current, { scale: 0.8 });

        // Simple entrance animations
        tl.to(logoRef.current, {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.2)"
        })
            .to(titleRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.4")
            .to(subtitleRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.2")
            .to(buttonRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.1");

        // Subtle floating animation for logo only
        gsap.to(logoRef.current, {
            y: -5,
            duration: 2,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1
        });

    }, []);

    return (
        <div className="h-screen w-full snap-start relative overflow-hidden" style={{ fontFamily: BeVietnam.style.fontFamily }}>
            {/* Video Background avec parallax effect */}
            <video autoPlay loop muted className="h-full w-full object-cover scale-110 will-change-transform brightness-75 contrast-125">
                <source src={"/video/gta-cine.mp4"} type="video/mp4" />
            </video>
            
            {/* Overlay gradient cinématique */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/15 to-black/40"></div>
            
            {/* Effet de vignette */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30"></div>
            
            {/* Grille décorative futuriste */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse"></div>
            </div>
            
            {/* Particules améliorées */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-gradient-to-r from-sabs-primary to-sabs-gradient-1 rounded-full animate-bounce [animation-delay:0s] [animation-duration:3s] shadow-lg shadow-sabs-primary/50"></div>
                <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-gradient-to-r from-sabs-gradient-2 to-sabs-gradient-3 rounded-full animate-bounce [animation-delay:1s] [animation-duration:4s] shadow-lg shadow-sabs-gradient-2/50"></div>
                <div className="absolute top-1/2 left-1/3 w-2.5 h-2.5 bg-gradient-to-r from-sabs-gradient-1 to-sabs-primary rounded-full animate-bounce [animation-delay:2s] [animation-duration:5s] shadow-lg shadow-sabs-gradient-1/50"></div>
                <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-gradient-to-r from-sabs-gradient-3 to-sabs-gradient-2 rounded-full animate-bounce [animation-delay:0.5s] [animation-duration:3.5s] shadow-lg shadow-sabs-gradient-3/50"></div>
                <div className="absolute top-2/3 left-2/3 w-2 h-2 bg-gradient-to-r from-sabs-primary to-sabs-gradient-3 rounded-full animate-bounce [animation-delay:1.5s] [animation-duration:4.5s] shadow-lg shadow-sabs-primary/50"></div>
            </div>

            {/* Rayons lumineux */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-sabs-primary/20 to-transparent animate-pulse [animation-delay:0s] [animation-duration:4s]"></div>
                <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-sabs-gradient-1/20 to-transparent animate-pulse [animation-delay:2s] [animation-duration:6s]"></div>
                <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-sabs-gradient-2/15 to-transparent animate-pulse [animation-delay:1s] [animation-duration:5s]"></div>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 z-10">
                {/* Logo avec design premium */}
                <div ref={logoRef} className="mb-10 group">
                    <div className="relative p-10 rounded-[4rem] bg-gradient-to-br from-white/15 via-white/8 to-white/5 backdrop-blur-3xl border-2 border-white/30 shadow-[0_35px_80px_-15px_rgba(0,0,0,0.4)] hover:shadow-[0_45px_100px_-15px_rgba(139,92,246,0.3)] transition-all duration-1000 hover:scale-110 hover:rotate-3">
                        {/* Éclats décoratifs */}
                        <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-r from-sabs-primary to-sabs-gradient-1 rounded-full animate-ping shadow-lg shadow-sabs-primary/50"></div>
                        <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-gradient-to-r from-sabs-gradient-2 to-sabs-gradient-3 rounded-full animate-pulse shadow-lg shadow-sabs-gradient-2/50"></div>
                        <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-sabs-gradient-1 to-sabs-primary rounded-full animate-bounce shadow-lg shadow-sabs-gradient-1/50"></div>
                        
                        <Image
                            src={Logo}
                            alt="SABS Logo"
                            width={140}
                            height={140}
                            className="drop-shadow-2xl filter brightness-125 contrast-125 saturate-110"
                        />
                        
                        {/* Aura magique */}
                        <div className="absolute inset-0 rounded-[4rem] bg-gradient-conic from-sabs-primary via-sabs-gradient-1 to-sabs-gradient-2 blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-1000 -z-10"></div>
                        <div className="absolute inset-0 rounded-[4rem] bg-gradient-to-r from-sabs-gradient-1/30 via-sabs-primary/30 to-sabs-gradient-3/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    </div>
                </div>

                {/* Titre épique */}
                <h1 ref={titleRef} className="text-7xl md:text-9xl font-extralight mb-6 text-center tracking-[-0.04em] leading-[0.8] relative">
                    <span className="inline-block text-transparent bg-gradient-to-br from-sabs-gradient-1 to-sabs-primary bg-clip-text hover:scale-125 transition-all duration-500 cursor-default filter drop-shadow-2xl">S</span>
                    <span className="inline-block text-transparent bg-gradient-to-br from-sabs-gradient-2 to-sabs-gradient-1 bg-clip-text hover:scale-125 transition-all duration-500 cursor-default filter drop-shadow-2xl">A</span>
                    <span className="inline-block text-transparent bg-gradient-to-br from-sabs-gradient-3 to-sabs-gradient-2 bg-clip-text hover:scale-125 transition-all duration-500 cursor-default filter drop-shadow-2xl">B</span>
                    <span className="inline-block text-transparent bg-gradient-to-br from-sabs-primary to-sabs-gradient-3 bg-clip-text hover:scale-125 transition-all duration-500 cursor-default filter drop-shadow-2xl">S</span>
                    
                    {/* Éclat épique derrière le texte */}
                    <div className="absolute inset-0 blur-3xl opacity-40 bg-gradient-conic from-sabs-gradient-1 via-sabs-primary to-sabs-gradient-3 text-7xl md:text-9xl font-extralight tracking-[-0.04em] leading-[0.8] -z-10 animate-pulse">
                        SABS
                    </div>
                </h1>

                {/* Sous-titre élégant */}
                <div className="relative mb-16">
                    <p ref={subtitleRef} className="text-2xl md:text-3xl text-center font-light text-white/95 max-w-4xl leading-relaxed">
                        <span className="relative inline-block">
                            <span className="text-transparent bg-gradient-to-r from-sabs-primary to-sabs-gradient-1 bg-clip-text font-bold text-3xl md:text-4xl">S</span>an 
                            <span className="text-transparent bg-gradient-to-r from-sabs-gradient-2 to-sabs-gradient-1 bg-clip-text font-bold text-3xl md:text-4xl mx-3">A</span>ndreas 
                            <span className="text-transparent bg-gradient-to-r from-sabs-gradient-3 to-sabs-gradient-2 bg-clip-text font-bold text-3xl md:text-4xl mx-3">B</span>roadcast 
                            <span className="text-transparent bg-gradient-to-r from-sabs-primary to-sabs-gradient-3 bg-clip-text font-bold text-3xl md:text-4xl ml-3">S</span>ervice
                        </span>
                    </p>
                    
                    {/* Lignes décoratives multiples */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col gap-1">
                        <div className="w-40 h-px bg-gradient-to-r from-transparent via-sabs-primary to-transparent"></div>
                        <div className="w-24 h-px bg-gradient-to-r from-transparent via-sabs-gradient-2 to-transparent mx-auto"></div>
                    </div>
                </div>

                {/* Bouton CTA spectaculaire */}
                <button
                    ref={buttonRef}
                    className="group relative px-12 py-6 bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-3xl border-2 border-white/40 rounded-full text-white font-bold text-xl transition-all duration-700 hover:from-sabs-primary/30 hover:to-sabs-gradient-2/30 hover:scale-110 hover:shadow-[0_30px_60px_-12px_rgba(139,92,246,0.6)] active:scale-95 will-change-transform overflow-hidden"
                    onClick={scrollToTarget}
                >
                    {/* Effet de vague SABS */}
                    <div className="absolute inset-0 bg-gradient-to-r from-sabs-gradient-1/0 via-sabs-primary/30 to-sabs-gradient-3/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1500 ease-out"></div>
                    
                    <span className="relative z-10 tracking-wider flex items-center gap-4">
                        <span className="text-transparent bg-gradient-to-r from-sabs-primary to-sabs-gradient-1 bg-clip-text font-extrabold">Découvrir</span>
                        <svg className="w-6 h-6 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500 text-sabs-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </span>
                    
                    {/* Bordure magique SABS */}
                    <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-conic from-sabs-gradient-1 via-sabs-primary to-sabs-gradient-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:xor] p-[2px]"></div>
                </button>
            </div>
        </div>
    )
}