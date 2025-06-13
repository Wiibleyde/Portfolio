"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Github, BoxArrowUpRight } from "react-bootstrap-icons";
import Image from "next/image";
import { Project, ProjectType } from "./types";

interface ProjectCardProps {
    project: Project;
}

// Tooltip states for better state management
enum TooltipState {
    HIDDEN = 'hidden',
    SHOWING = 'showing',
    VISIBLE = 'visible',
    HIDING = 'hiding'
}

export function ProjectCard({ project }: ProjectCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const tagsContainerRef = useRef<HTMLDivElement>(null);
    const [tooltipState, setTooltipState] = useState<TooltipState>(TooltipState.HIDDEN);
    const [shouldAnimateTags, setShouldAnimateTags] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);

    const handleCardMouseEnter = () => {
        gsap.to(cardRef.current, {
            y: -5,
            scale: 1.01,
            duration: 0.3,
            ease: "power2.out",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
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
        setShouldAnimateTags(false); // Reset animation state

        // Highlight tags container
        gsap.to(tagsContainerRef.current, {
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderColor: "rgba(59, 130, 246, 0.3)",
            duration: 0.2,
            ease: "power2.out"
        });

        // Setup and animate tooltip
        gsap.set(tooltipRef.current, { pointerEvents: "auto" });

        const tl = gsap.timeline({
            onComplete: () => {
                setTooltipState(TooltipState.VISIBLE);
                setShouldAnimateTags(true); // Trigger tag animations after tooltip is visible
                animationRef.current = null;
            }
        });

        tl.to(tooltipRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "back.out(1.7)"
        });

        animationRef.current = tl;
    }, [tooltipState, clearAllTimeouts, killCurrentAnimation]);

    const hideTooltip = useCallback((immediate = false) => {
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
                backgroundColor: "transparent",
                borderColor: "transparent",
                duration: 0.2,
                ease: "power2.out"
            });

            // Animate tooltip out
            const tl = gsap.timeline({
                onComplete: () => {
                    gsap.set(tooltipRef.current, { pointerEvents: "none" });
                    setTooltipState(TooltipState.HIDDEN);
                    animationRef.current = null;
                }
            });

            tl.to(tooltipRef.current, {
                opacity: 0,
                y: 10,
                duration: 0.2,
                ease: "power2.inOut"
            });

            animationRef.current = tl;
        };

        if (immediate) {
            performHide();
        } else {
            timeoutRef.current = setTimeout(performHide, 100);
        }
    }, [tooltipState, clearAllTimeouts, killCurrentAnimation]);

    const handleCardMouseLeave = useCallback(() => {
        gsap.to(cardRef.current, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
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
            case ProjectType.Personal: return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case ProjectType.School: return 'bg-green-500/20 text-green-300 border-green-500/30';
            case ProjectType.Professional: return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    return (
        <div
            ref={cardRef}
            className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-visible shadow-lg transition-all duration-300 flex-shrink-0 w-80 h-96 transform-gpu relative"
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
            style={{ transformOrigin: 'center center' }}
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden rounded-t-2xl">
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Type badge */}
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-medium border ${getTypeColor(project.type)}`}>
                    {project.type}
                </div>

                {/* Links */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.repoUrl && (
                        <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                        >
                            <Github className="w-4 h-4" />
                        </a>
                    )}
                    {project.url && (
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                        >
                            <BoxArrowUpRight className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col h-48">
                <h3 className="text-xl font-semibold text-white mb-3 line-clamp-1">
                    {project.title}
                </h3>
                <p className="text-sm text-gray-300 mb-4 line-clamp-2 flex-grow">
                    {project.description}
                </p>

                {/* Tags */}
                <div
                    ref={tagsContainerRef}
                    className="relative cursor-help border border-transparent rounded-lg p-2 -m-2 transition-all duration-200"
                    onMouseEnter={handleTagsMouseEnter}
                    onMouseLeave={handleTagsMouseLeave}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400 font-medium">Tags</span>
                        <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Survolez pour voir tout
                        </span>
                    </div>

                    <div className="flex gap-1 overflow-hidden">
                        {project.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 bg-white/10 text-xs text-gray-300 rounded-md whitespace-nowrap flex-shrink-0 hover:bg-white/20 transition-colors duration-200"
                            >
                                {tag}
                            </span>
                        ))}
                        {project.tags.length > 3 && (
                            <span className="px-2 py-1 bg-blue-500/20 text-xs text-blue-300 rounded-md whitespace-nowrap hover:bg-blue-500/30 transition-colors duration-200 border border-blue-500/30">
                                +{project.tags.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Tooltip overlay */}
            <div
                ref={tooltipRef}
                className="absolute -bottom-2 left-2 right-2 z-30 opacity-0 pointer-events-none"
                style={{ transform: 'translateY(10px)' }}
                onMouseEnter={handleTooltipMouseEnter}
                onMouseLeave={handleTooltipMouseLeave}
            >
                <div className="bg-gray-900/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/20">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="text-xs text-blue-300 font-semibold">Tags</div>
                        <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                        <div className="text-xs text-gray-400">{project.tags.length} tags</div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag, index) => (
                            <span
                                key={tag}
                                className="px-2.5 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-xs text-white rounded-md border border-blue-400/30 font-medium transform hover:scale-105 transition-transform duration-200"
                                style={{
                                    animationDelay: shouldAnimateTags ? `${index * 0.001}s` : '0s',
                                    animation: shouldAnimateTags ? 'fadeInScale 0.3s ease-out forwards' : 'none',
                                    opacity: shouldAnimateTags ? undefined : 0
                                }}
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
