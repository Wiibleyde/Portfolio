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
            <video autoPlay loop muted className="h-full w-full object-cover scale-105">
                <source src={"/video/gta-cine.mp4"} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/50"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6">
                <div ref={logoRef} className="mb-6">
                    <div className="p-6 rounded-[2rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                        <Image
                            src={Logo}
                            alt="SABS Logo"
                            width={100}
                            height={100}
                            className="drop-shadow-2xl"
                        />
                    </div>
                </div>
                <h1 ref={titleRef} className="text-5xl md:text-7xl font-thin mb-3 text-center tracking-[-0.02em] leading-[0.9]">
                    <span className="inline-block text-sabs-gradient-1">S</span>
                    <span className="inline-block text-sabs-gradient-2">A</span>
                    <span className="inline-block text-sabs-gradient-3">B</span>
                    <span className="inline-block text-sabs-primary">S</span>
                </h1>
                <p ref={subtitleRef} className="text-xl md:text-2xl mb-10 text-center font-light text-white/80 max-w-2xl leading-relaxed">
                    <span className="text-sabs-primary font-medium">S</span>an <span className="text-sabs-primary font-medium">A</span>ndreas <span className="text-sabs-primary font-medium">B</span>roadcast <span className="text-sabs-primary font-medium">S</span>ervice
                </p>
                <button
                    ref={buttonRef}
                    className="group relative px-8 py-4 bg-white/8 backdrop-blur-2xl border border-white/20 rounded-full text-white font-medium text-lg transition-all duration-500 hover:bg-white/15 hover:scale-[1.02] hover:shadow-[0_20px_40px_0_rgba(31,38,135,0.4)] active:scale-[0.98] will-change-transform"
                    onClick={scrollToTarget}
                >
                    <span className="relative z-10 tracking-wide">Découvrir</span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sabs-gradient-1/20 via-sabs-gradient-2/20 to-sabs-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] group-hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] transition-all duration-500"></div>
                </button>
            </div>
        </div>
    )
}