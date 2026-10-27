'use client';
import Me from '@public/img/pp.webp';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { ArrowRight } from 'react-bootstrap-icons';
import DotGrid from '@/components/reactbits/DotGrid';
import ProfileCard from '@/components/reactbits/ProfileCard';
import Shuffle from '@/components/reactbits/Shuffle';
import { useScroll } from '@/hooks/useScroll';

export function Hero() {
    const contentRef = useRef<HTMLDivElement>(null);
    const photoRef = useRef<HTMLDivElement>(null);

    const { scrollToTarget: scrollToContact } = useScroll({ targetId: 'contact' });
    const { scrollToTarget: scrollToProjects } = useScroll({ targetId: 'projects' });

    useEffect(() => {
        const items = contentRef.current?.children;
        if (!items) return;
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo(items, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }).fromTo(
            photoRef.current,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1, duration: 0.8 },
            '-=0.6',
        );
        return () => {
            tl.kill();
        };
    }, []);

    return (
        <section className="relative flex min-h-dvh w-full items-center overflow-hidden py-24">
            <div aria-hidden="true" className="absolute inset-0">
                <DotGrid dotSize={3} gap={22} baseColor="#27272a" activeColor="#8fb3ff" proximity={130} fade={0.6} />
            </div>

            <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-6 md:grid-cols-[1fr_auto] md:px-10">
                <div ref={contentRef}>
                    <p className="text-zinc-400">Développeur fullstack à Bordeaux · alternant chez Orange Business</p>
                    <Shuffle
                        tag="h1"
                        text="Nathan Bonnell"
                        textAlign="left"
                        shuffleDirection="up"
                        shuffleTimes={2}
                        scrambleCharset="ABCDEFGHIJKLMNOPQRSTUVWXYZ01"
                        className="mt-3 font-sans font-semibold text-5xl text-zinc-50 tracking-tighter sm:text-7xl lg:text-8xl"
                    />
                    <p className="mt-6 max-w-xl text-lg text-zinc-400 leading-relaxed">
                        Étudiant en informatique à Bordeaux Ynov Campus, passionné par le développement web fullstack et
                        l&apos;exploration de nouvelles technologies.
                    </p>
                    <div className="mt-10 flex flex-wrap gap-3">
                        <button type="button" onClick={scrollToContact} className="btn btn-primary">
                            Me contacter
                            <ArrowRight className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={scrollToProjects} className="btn btn-secondary">
                            Voir mes projets
                        </button>
                    </div>
                </div>

                <div ref={photoRef} className="mx-auto w-[280px] md:w-[320px]">
                    <ProfileCard
                        avatarUrl={Me.src}
                        name="Nathan Bonnell"
                        title="Développeur fullstack"
                        handle="wiibleyde"
                        status="Bordeaux"
                        contactText="Contact"
                        onContactClick={scrollToContact}
                        backdropColor="#18181b"
                    />
                </div>
            </div>
        </section>
    );
}
