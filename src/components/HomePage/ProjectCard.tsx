'use client';
import { type Project, ProjectType } from '@/types';
import { gsap } from 'gsap';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BoxArrowUpRight, Github } from 'react-bootstrap-icons';
import { RichDescription } from './RichDescription';

interface ProjectCardProps {
    project: Project;
}

// Tooltip states for better state management
enum TooltipState {
    HIDDEN = 'hidden',
    SHOWING = 'showing',
    VISIBLE = 'visible',
    HIDING = 'hiding',
}

export function ProjectCard({ project }: ProjectCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const tagsContainerRef = useRef<HTMLDivElement>(null);
    const [tooltipState, setTooltipState] = useState<TooltipState>(TooltipState.HIDDEN);
    const [, setShouldAnimateTags] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);

    const handleCardMouseEnter = () => {
        gsap.to(cardRef.current, {
            y: -5,
            scale: 1.01,
            duration: 0.3,
            ease: 'power2.out',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        });
    };

    const clearAllTimeouts = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const killCurrentAnimation = useCallback(() => {
        if (animationRef.current) {
            animationRef.current.kill();
            animationRef.current = null;
        }
        gsap.killTweensOf([tooltipRef.current, tagsContainerRef.current]);
    }, []);

    const showTooltip = useCallback(() => {
        clearAllTimeouts();

        // Only proceed if not already visible or showing
        if (tooltipState === TooltipState.VISIBLE || tooltipState === TooltipState.SHOWING) {
            return;
        }

        killCurrentAnimation();
        setTooltipState(TooltipState.SHOWING);

        // Highlight tags container
        gsap.to(tagsContainerRef.current, {
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 0.3)',
            duration: 0.2,
            ease: 'power2.out',
        });

        // Setup and animate tooltip
        gsap.set(tooltipRef.current, { pointerEvents: 'auto' });

        const tl = gsap.timeline({
            onComplete: () => {
                setTooltipState(TooltipState.VISIBLE);
                animationRef.current = null;
            },
        });

        tl.to(tooltipRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
        });

        animationRef.current = tl;
    }, [tooltipState, clearAllTimeouts, killCurrentAnimation]);

    const hideTooltip = useCallback(
        (immediate = false) => {
            clearAllTimeouts();

            // Only proceed if visible or showing
            if (tooltipState === TooltipState.HIDDEN || tooltipState === TooltipState.HIDING) {
                return;
            }

            const performHide = () => {
                killCurrentAnimation();
                setTooltipState(TooltipState.HIDING);
                setShouldAnimateTags(false); // Reset animation state immediately

                // Remove highlight from tags container
                gsap.to(tagsContainerRef.current, {
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    duration: 0.2,
                    ease: 'power2.out',
                });

                // Animate tooltip out
                const tl = gsap.timeline({
                    onComplete: () => {
                        gsap.set(tooltipRef.current, { pointerEvents: 'none' });
                        setTooltipState(TooltipState.HIDDEN);
                        animationRef.current = null;
                    },
                });

                tl.to(tooltipRef.current, {
                    opacity: 0,
                    y: 10,
                    duration: 0.2,
                    ease: 'power2.inOut',
                });

                animationRef.current = tl;
            };

            if (immediate) {
                performHide();
            } else {
                timeoutRef.current = setTimeout(performHide, 100);
            }
        },
        [tooltipState, clearAllTimeouts, killCurrentAnimation],
    );

    const handleCardMouseLeave = useCallback(() => {
        gsap.to(cardRef.current, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        });

        // Force hide tooltip when leaving card entirely
        if (tooltipState !== TooltipState.HIDDEN) {
            hideTooltip(true);
        }
    }, [tooltipState, hideTooltip]);

    const handleTagsMouseEnter = useCallback(() => {
        showTooltip();
    }, [showTooltip]);

    const handleTagsMouseLeave = useCallback(() => {
        hideTooltip();
    }, [hideTooltip]);

    const handleTooltipMouseEnter = useCallback(() => {
        clearAllTimeouts();
    }, [clearAllTimeouts]);

    const handleTooltipMouseLeave = useCallback(() => {
        hideTooltip(true);
    }, [hideTooltip]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearAllTimeouts();
            killCurrentAnimation();
        };
    }, [clearAllTimeouts, killCurrentAnimation]);

    const getTypeColor = (type: ProjectType) => {
        switch (type) {
            case ProjectType.Personal:
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case ProjectType.School:
                return 'bg-green-500/20 text-green-300 border-green-500/30';
            case ProjectType.Professional:
                return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    return (
        <div
            ref={cardRef}
            className="group relative h-96 w-80 shrink-0 transform-gpu overflow-visible rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-sm transition-all duration-300"
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
            style={{ transformOrigin: 'center center' }}
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden rounded-t-2xl">
                <Image src={project.image} alt={project.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                {/* Type badge */}
                <div
                    className={`absolute top-3 left-3 rounded-lg border px-3 py-1 font-medium text-xs ${getTypeColor(project.type)}`}
                >
                    {project.type}
                </div>

                {/* Links */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {project.repoUrl && (
                        <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                        >
                            <Github className="h-4 w-4" />
                        </a>
                    )}
                    {project.url && (
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                        >
                            <BoxArrowUpRight className="h-4 w-4" />
                        </a>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex h-48 flex-col p-6">
                <h3 className="mb-3 line-clamp-1 font-semibold text-white text-xl">{project.title}</h3>
                <p className="mb-4 line-clamp-2 grow text-gray-300 text-sm">
                    <RichDescription text={project.description} />
                </p>

                {/* Tags */}
                <div
                    ref={tagsContainerRef}
                    className="-m-2 relative cursor-help rounded-lg border border-transparent p-2 transition-all duration-200"
                    onMouseEnter={handleTagsMouseEnter}
                    onMouseLeave={handleTagsMouseLeave}
                >
                    <div className="mb-1 flex items-center justify-between">
                        <span className="font-medium text-gray-400 text-xs">Tags</span>
                        <span className="text-blue-400 text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            Survolez pour voir tout
                        </span>
                    </div>

                    <div className="flex gap-1 overflow-hidden">
                        {project.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="shrink-0 whitespace-nowrap rounded-md bg-white/10 px-2 py-1 text-gray-300 text-xs transition-colors duration-200 hover:bg-white/20"
                            >
                                {tag}
                            </span>
                        ))}
                        {project.tags.length > 3 && (
                            <span className="whitespace-nowrap rounded-md border border-blue-500/30 bg-blue-500/20 px-2 py-1 text-blue-300 text-xs transition-colors duration-200 hover:bg-blue-500/30">
                                +{project.tags.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Tooltip overlay */}
            <div
                ref={tooltipRef}
                className="-bottom-2 pointer-events-none absolute right-2 left-2 z-30 opacity-0"
                style={{ transform: 'translateY(10px)' }}
                onMouseEnter={handleTooltipMouseEnter}
                onMouseLeave={handleTooltipMouseLeave}
            >
                <div className="rounded-xl border border-white/20 bg-gray-900/95 p-4 shadow-2xl backdrop-blur-md">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="font-semibold text-blue-300 text-xs">Tags</div>
                        <div className="h-px flex-1 bg-linear-to-r from-blue-500/50 to-transparent" />
                        <div className="text-gray-400 text-xs">{project.tags.length} tags</div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-md border border-blue-400/30 bg-linear-to-r from-blue-500/20 to-purple-500/20 px-2.5 py-1 font-medium text-white text-xs transition-transform duration-200 hover:scale-105"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
