"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Github, BoxArrowUpRight } from "react-bootstrap-icons";
import Image from "next/image";
import { Project, ProjectType } from "./types";

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const tagsContainerRef = useRef<HTMLDivElement>(null);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleCardMouseEnter = () => {
        gsap.to(cardRef.current, {
            y: -5,
            scale: 1.01,
            duration: 0.3,
            ease: "power2.out",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
        });
    };

    const handleCardMouseLeave = () => {
        gsap.to(cardRef.current, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        });
    };

    const showTooltip = () => {
        // Clear any pending hide timeout
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }

        if (!isTooltipVisible && !isAnimating) {
            setIsAnimating(true);
            setIsTooltipVisible(true);
            
            // Highlight the tags container
            gsap.to(tagsContainerRef.current, {
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderColor: "rgba(59, 130, 246, 0.3)",
                duration: 0.2,
                ease: "power2.out"
            });

            // Enable pointer events and animate tooltip appearance
            gsap.set(tooltipRef.current, { pointerEvents: "auto" });
            gsap.to(tooltipRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "back.out(1.7)",
                delay: 0.1,
                onComplete: () => setIsAnimating(false)
            });
        }
    };

    const hideTooltip = () => {
        // Clear any existing timeout
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }

        // Set a small delay before hiding to allow mouse to move to tooltip
        hideTimeoutRef.current = setTimeout(() => {
            if (isTooltipVisible && !isAnimating) {
                setIsAnimating(true);
                
                // Remove highlight from tags container
                gsap.to(tagsContainerRef.current, {
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                    duration: 0.2,
                    ease: "power2.out"
                });

                // Animate tooltip disappearance and disable pointer events
                gsap.to(tooltipRef.current, {
                    opacity: 0,
                    y: 10,
                    duration: 0.2,
                    ease: "power2.inOut",
                    onComplete: () => {
                        gsap.set(tooltipRef.current, { pointerEvents: "none" });
                        setIsTooltipVisible(false);
                        setIsAnimating(false);
                    }
                });
            }
        }, 150); // Slightly longer delay for better UX
    };

    const handleTagsMouseEnter = () => {
        showTooltip();
    };

    const handleTagsMouseLeave = () => {
        // Only hide if we're not moving to the tooltip
        hideTooltip();
    };

    const handleTooltipMouseEnter = () => {
        // Cancel any pending hide when entering tooltip
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
    };

    const handleTooltipMouseLeave = () => {
        // Immediately hide when leaving tooltip
        hideTooltip();
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
        };
    }, []);

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
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
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
                {/* //TODO: FIND SOMETHING FOR ENTIRE DESCRIPTION */}
                <p className="text-sm text-gray-300 mb-4 line-clamp-2 flex-grow">
                    {project.description}
                </p>

                {/* Tags - Improved UX */}
                <div 
                    ref={tagsContainerRef}
                    className="relative cursor-help border border-transparent rounded-lg p-2 -m-2 transition-all duration-200"
                    onMouseEnter={handleTagsMouseEnter}
                    onMouseLeave={handleTagsMouseLeave}
                >
                    {/* Hint text */}
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400 font-medium">Technologies</span>
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

            {/* Enhanced tooltip overlay */}
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
                                    animationDelay: `${index * 0.05}s`,
                                    animation: isTooltipVisible ? 'fadeInScale 0.3s ease-out forwards' : 'none'
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* CSS for animation */}
            <style jsx>{`
                @keyframes fadeInScale {
                    0% {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
}
