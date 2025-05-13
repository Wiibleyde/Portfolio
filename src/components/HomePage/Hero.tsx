"use client";
import Background from '@public/background.jpg';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export function Hero() {
    // References to elements we want to animate
    const nameRef = useRef(null);
    const titleRef = useRef(null);
    const containerRef = useRef(null);

    // Animation effect
    useEffect(() => {
        // Create a timeline
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Set initial states (invisible)
        gsap.set([nameRef.current, titleRef.current], { opacity: 0, y: 20 });

        // Fade in the container first
        tl.to(containerRef.current, {
            opacity: 1,
            duration: 1.2
        });

        // Animate the name
        tl.to(nameRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.2
        }, "-=0.8");

        // Animate the title with a slight delay
        tl.to(titleRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.2
        }, "-=0.9");

    }, []);

    return (
        <div className="min-h-screen" style={{ backgroundImage: `url(${Background.src})`, backgroundSize: 'cover' }}>
            <div className="flex flex-col items-start justify-start min-h-screen bg-gradient-to-r from-black/75 via-black/75 to-black/10 px-8 pt-8">
                <div
                    ref={containerRef}
                    className="text-left text-white max-w-1/2"
                >
                    <h1
                        ref={nameRef}
                        className="text-8xl font-black mb-2 text-white"
                    >
                        Nathan Bonnell
                    </h1>
                    <h2
                        ref={titleRef}
                        className="text-lg lg:text-2xl font-light text-gray-300"
                    >
                        Développeur Fullstack
                    </h2>
                </div>
            </div>
        </div>
    )
}