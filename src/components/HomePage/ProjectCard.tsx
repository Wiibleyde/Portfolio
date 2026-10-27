'use client';
import { gsap } from 'gsap';
import Image from 'next/image';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Github, X } from 'react-bootstrap-icons';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import type { Project } from '@/types';
import { RichDescription } from './RichDescription';

const MAX_TAGS = 3;

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const [showAllTags, setShowAllTags] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const panelId = useId();

    // slide down before unmounting the panel
    const closeTags = useCallback(() => {
        const panel = panelRef.current;
        if (!panel || reducedMotion()) {
            setShowAllTags(false);
            return;
        }
        gsap.to(panel, { yPercent: 100, duration: 0.25, ease: 'power2.in', onComplete: () => setShowAllTags(false) });
    }, []);

    // slide up from the bottom of the card, tags arrive in a short cascade
    useLayoutEffect(() => {
        const panel = panelRef.current;
        if (!showAllTags || !panel || reducedMotion()) return;
        const tl = gsap.timeline();
        tl.fromTo(panel, { yPercent: 100 }, { yPercent: 0, duration: 0.35, ease: 'power3.out' }).fromTo(
            panel.querySelectorAll('li'),
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: 0.25, stagger: 0.03, ease: 'power2.out' },
            '-=0.15',
        );
        return () => {
            tl.kill();
        };
    }, [showAllTags]);

    // close the tag panel on Escape or on a click outside of it
    useEffect(() => {
        if (!showAllTags) return;
        const onPointerDown = (e: PointerEvent) => {
            if (!panelRef.current?.contains(e.target as Node)) closeTags();
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeTags();
        };
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [showAllTags, closeTags]);

    return (
        <SpotlightCard
            spotlightColor="#8fb3ff"
            intensity={0.12}
            borderGlow={0.5}
            className="group flex w-full min-w-0 flex-col overflow-hidden rounded-2xl! border border-zinc-800 p-0!"
            style={{ '--spotlight-card-surface': '#0e0e10' } as React.CSSProperties}
        >
            <div className="relative aspect-video overflow-hidden border-zinc-800 border-b bg-zinc-900">
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="eyebrow">{project.type}</p>
                        <h3 className="mt-1.5 line-clamp-1 font-medium text-lg text-zinc-50">{project.title}</h3>
                    </div>
                    <div className="flex shrink-0 gap-1">
                        {project.repoUrl && (
                            <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Code source de ${project.title}`}
                                className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                            >
                                <Github className="h-4 w-4" />
                            </a>
                        )}
                        {project.url && (
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Voir ${project.title} en ligne`}
                                className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                            >
                                <ArrowUpRight className="h-4 w-4" />
                            </a>
                        )}
                    </div>
                </div>

                <p className="mt-3 line-clamp-3 h-[3lh] text-sm text-zinc-400 leading-relaxed">
                    <RichDescription text={project.description} />
                </p>

                {/* single row so every card has the same height and only moves (no resize) when filtering */}
                <ul className="mt-5 flex gap-1.5 overflow-hidden">
                    {project.tags.slice(0, MAX_TAGS).map((tag) => (
                        <li key={tag} className="tag shrink-0 whitespace-nowrap">
                            {tag}
                        </li>
                    ))}
                    {project.tags.length > MAX_TAGS && (
                        <li className="flex shrink-0">
                            <button
                                type="button"
                                onClick={() => setShowAllTags(true)}
                                aria-expanded={showAllTags}
                                aria-controls={panelId}
                                aria-label={`Voir les ${project.tags.length} technologies de ${project.title}`}
                                className="tag cursor-pointer transition-colors hover:border-zinc-600 hover:text-zinc-100"
                            >
                                +{project.tags.length - MAX_TAGS}
                            </button>
                        </li>
                    )}
                </ul>
            </div>

            {/* overlays the bottom of the card so the card height (and the filter animation) never changes */}
            {showAllTags && (
                <div
                    ref={panelRef}
                    id={panelId}
                    className="absolute inset-x-0 bottom-0 z-10 border-zinc-800 border-t bg-zinc-950/95 p-5 backdrop-blur-sm"
                >
                    <div className="mb-3 flex items-center justify-between">
                        <p className="eyebrow">Technologies</p>
                        <button
                            type="button"
                            onClick={closeTags}
                            aria-label="Fermer"
                            className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <ul className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                            <li key={tag} className="tag">
                                {tag}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </SpotlightCard>
    );
}
