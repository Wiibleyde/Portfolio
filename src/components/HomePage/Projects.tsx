"use client";
import HopeLogo from "@public/img/projects/hope.png";
import LexPortLogo from "@public/img/projects/lexport.png";
import RPlaceLogo from "@public/img/projects/rplace-logo.png";
import EveBanner from "@public/img/projects/eve-banner.png";
import WeazelNewsLogo from "@public/img/projects/WeazelNews_Logo.png";
import Motus from "@public/img/projects/motus.jpg";
import Twitch from "@public/img/projects/twitch.webp";
import Bro from "@public/img/projects/bro.png";
import FurutsuGame from "@public/img/projects/furutsugame.png";
import Me from "@public/img/pp.webp";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Filter, ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { ProjectType, Project } from "./types";
import { ProjectCard } from "./ProjectCard";


export function Projects() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const filtersRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [activeFilter, setActiveFilter] = useState<ProjectType | 'all'>('all');
    const [displayedFilter, setDisplayedFilter] = useState<ProjectType | 'all'>('all'); // Filter actually shown
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const projects: Project[] = [
        {
            title: "Portfolio",
            description: "Portfolio de Nathan Bonnell, développeur web fullstack.",
            type: ProjectType.Personal,
            url: "https://nathan.bonnell.fr",
            repoUrl: "https://github.com/Wiibleyde/portfolio",
            image: Me.src,
            tags: ["Portfolio", "React", "Next.js", "TailwindCSS", "Typescript"],
        },
        {
            title: "Hope - GTARP (Fermé)",
            description: "Hope - GTARP est (était 😢) un serveur de jeu en ligne sur la plateforme FiveM.",
            type: ProjectType.Personal,
            image: HopeLogo.src,
            tags: ["GTAV", "Hope", "FiveM", "Typescript", "Lua", "C#", "Go", "MariaDB", "InfluxDB", "C++", "Grafana", "Discord.js"],
        },
        {
            title: "RPlace Analyser",
            description: "RPlace Analyzer est un outil d'analyse des données de l'événement RPlace 2017. Il permet de visualiser les données de l'événement.",
            type: ProjectType.School,
            repoUrl: "https://github.com/Wiibleyde/RPlaceAnalyzer",
            image: RPlaceLogo.src,
            tags: ["RPlace", "MongoDB", "Python", "Reddit", "Data Analysis"],
        },
        {
            title: "Site du cartel de camion Lex-Port",
            description: "Site web du cartel de camion pour l'action collective du cabinet d'avocats Lex-Port.",
            type: ProjectType.Professional,
            url: "https://cartel.lex-port.com",
            image: LexPortLogo.src,
            tags: ["Lex-Port", "Alternance", "Next.js", "Typescript", "TailwindCSS", "Prisma", "i18n"],
        },
        {
            title: "Eve",
            description: "Eve est un bot Discord multifonctionnel pour les serveurs Discord fait en Typescript.",
            type: ProjectType.Personal,
            repoUrl: "https://github.com/Wiibleyde/Eve",
            image: EveBanner.src,
            tags: ["Discord.js", "Bot", "Typescript", "Node.js", "Prisma"],
        },
        {
            title: "Script Caméra pour FiveM (GTA)",
            description: "Fivem Cam Script est une ressource à ajouter à votre serveur FiveM (GTA-RP) qui vous permet de passer en mode caméraman à pied ou en hélicoptère, écrite en Lua.",
            type: ProjectType.Personal,
            repoUrl: "https://github.com/Wiibleyde/Fivem-Cam-Script",
            image: WeazelNewsLogo.src,
            tags: ["FiveM", "GTARP", "Lua"],
        },
        {
            title: "TwitchStreamRetrievers",
            description: "TwitchStreamRetrievers est une API et websocket pour récupérer les informations de streams Twitch.",
            type: ProjectType.Personal,
            repoUrl: "https://github.com/Wiibleyde/TwitchStreamRetrievers",
            image: Twitch.src,
            tags: ["Twitch", "API", "Websocket", "Typescript", "Node.js"],
        },
        {
            title: "Mootus",
            description: "Mootus est une reproduction du jeu Motus en ligne.",
            type: ProjectType.School,
            url: "https://wiibleyde.github.io/Mootus/",
            repoUrl: "https://github.com/Wiibleyde/Mootus",
            image: Motus.src,
            tags: ["Motus", "Vite", "React", "Typescript", "Atom", "TailwindCSS"],
        },
        {
            title: "Régie Black Room Orchestra",
            description: "Régie vidéo du concert de Black Room Orchestra sur le serveur FailyV (ainsi que d'autres sur le même serveur).",
            type: ProjectType.Personal,
            url: "https://youtu.be/otioMSFKVi0",
            image: Bro.src,
            tags: ["VMix", "FailyV", "Concert", "Régie", "Vidéo", "Live", "FiveM"],
        },
        {
            title: "Furutsu Game",
            description: "Furutsu Game est une copie du jeu Suika Game fait avec Unity.",
            type: ProjectType.School,
            repoUrl: "https://github.com/Wiibleyde/FurutsuGame",
            image: FurutsuGame.src,
            tags: ["Unity", "C#", "Game", "Suika Game", "Ynov"],
        }
    ]

    // Use displayedFilter for actual filtering to ensure sync with animations
    const filteredProjects = projects.filter(project =>
        displayedFilter === 'all' || project.type === displayedFilter
    );

    // Calculate how many projects to show at once based on screen size
    const getProjectsPerView = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth >= 1280) return 3; // xl screens
            if (window.innerWidth >= 768) return 2;  // md screens
            return 1; // sm screens
        }
        return 3;
    };

    const [projectsPerView, setProjectsPerView] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            setProjectsPerView(getProjectsPerView());
            setCurrentIndex(0); // Reset to first page on resize
        };

        setProjectsPerView(getProjectsPerView());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, filteredProjects.length - projectsPerView);
    const totalPages = Math.ceil(filteredProjects.length / projectsPerView);

    const nextProjects = () => {
        if (currentIndex < maxIndex) {
            setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
            animateTransition();
        }
    };

    const prevProjects = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => Math.max(prev - 1, 0));
            animateTransition();
        }
    };

    const goToPage = (page: number) => {
        const newIndex = Math.min(page * projectsPerView, maxIndex);
        setCurrentIndex(newIndex);
        animateTransition();
    };

    const animateTransition = () => {
        if (gridRef.current && !isAnimating) {
            gsap.to(gridRef.current, {
                x: -currentIndex * (320 + 24),
                duration: 0.5,
                ease: "power2.out"
            });
        }
    };

    // Initial setup - set all elements to invisible
    useEffect(() => {
        if (titleRef.current && filtersRef.current && carouselRef.current) {
            gsap.set([titleRef.current, filtersRef.current, carouselRef.current], {
                opacity: 0,
                y: 30
            });
        }
    }, []);

    // Intersection Observer for initial animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true);

                        // Create main timeline for initial appearance
                        const tl = gsap.timeline({ delay: 0.2 });

                        tl.to(titleRef.current, {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power2.out"
                        })
                            .to(filtersRef.current, {
                                opacity: 1,
                                y: 0,
                                duration: 0.6,
                                ease: "power2.out"
                            }, "-=0.4")
                            .to(carouselRef.current, {
                                opacity: 1,
                                y: 0,
                                duration: 0.8,
                                ease: "back.out(1.7)"
                            }, "-=0.3");
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

    const handleFilterChange = (filter: ProjectType | 'all') => {
        if (isAnimating || filter === activeFilter) return;

        setIsAnimating(true);
        setActiveFilter(filter);

        // Create timeline for smooth filter transition
        const timeline = gsap.timeline({
            onComplete: () => {
                setIsAnimating(false);
            }
        });

        // Phase 1: Fade out current projects
        timeline.to(carouselRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: "power2.inOut"
        });

        // Phase 2: Change the displayed filter and reset position (happens during fade out)
        timeline.call(() => {
            setDisplayedFilter(filter);
            setCurrentIndex(0);
            if (gridRef.current) {
                gsap.set(gridRef.current, { x: 0 });
            }
        });

        // Phase 3: Small delay to ensure DOM update, then fade back in
        timeline.to(carouselRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out"
        }, "+=0.05");
    };

    // Handle carousel transitions only when not animating filter
    useEffect(() => {
        if (isVisible && !isAnimating) {
            animateTransition();
        }
    }, [currentIndex, isVisible, isAnimating]);

    // Sync displayedFilter with activeFilter on initial load
    useEffect(() => {
        if (!isAnimating) {
            setDisplayedFilter(activeFilter);
        }
    }, [activeFilter, isAnimating]);

    const getFilterLabel = (type: ProjectType | 'all') => {
        switch (type) {
            case 'all': return 'Tous';
            case ProjectType.Personal: return 'Personnel';
            case ProjectType.School: return 'École';
            case ProjectType.Professional: return 'Professionnel';
            default: return type;
        }
    };

    // const getTypeColor = (type: ProjectType) => {
    //     switch (type) {
    //         case ProjectType.Personal: return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    //         case ProjectType.School: return 'bg-green-500/20 text-green-300 border-green-500/30';
    //         case ProjectType.Professional: return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    //         default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    //     }
    // };

    return (
        <div ref={containerRef} className="snap-start h-screen relative bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/30 flex flex-col">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full" style={{
                    backgroundImage: `linear-gradient(90deg, #374151 1px, transparent 1px), 
                                     linear-gradient(180deg, #374151 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                }}></div>
            </div>

            <div className="relative z-10 p-6 md:p-8 flex flex-col h-full">
                {/* Header */}
                <div ref={titleRef} className="text-center mb-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Mes Projets
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
                </div>

                {/* Filters */}
                <div ref={filtersRef} className="flex justify-center mb-6">
                    <div className="flex gap-2 bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
                        {(['all', ProjectType.Personal, ProjectType.School, ProjectType.Professional] as (ProjectType | 'all')[]).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => handleFilterChange(filter)}
                                disabled={isAnimating}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${activeFilter === filter
                                        ? 'bg-blue-500 text-white shadow-lg'
                                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                                    } ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Filter className="w-3 h-3" />
                                {getFilterLabel(filter)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Projects Carousel */}
                <div ref={carouselRef} className="flex-1 flex flex-col justify-center">
                    <div className="relative">
                        {/* Navigation Buttons */}
                        <button
                            onClick={prevProjects}
                            disabled={currentIndex === 0 || isAnimating}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full transition-all duration-300 ${currentIndex === 0 || isAnimating
                                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                    : 'bg-white/10 hover:bg-white/20 text-white hover:scale-110'
                                }`}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <button
                            onClick={nextProjects}
                            disabled={currentIndex >= maxIndex || isAnimating}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full transition-all duration-300 ${currentIndex >= maxIndex || isAnimating
                                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                    : 'bg-white/10 hover:bg-white/20 text-white hover:scale-110'
                                }`}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Projects Container */}
                        <div className="overflow-hidden mx-16">
                            <div
                                ref={gridRef}
                                className="flex gap-6 py-4 px-2"
                                style={{
                                    width: `${filteredProjects.length * (320 + 24)}px`,
                                    willChange: 'transform'
                                }}
                            >
                                {filteredProjects.map((project, index) => (
                                    <ProjectCard
                                        key={`${displayedFilter}-${project.title}-${index}`}
                                        project={project}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Pagination Dots */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goToPage(i)}
                                    disabled={isAnimating}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${Math.floor(currentIndex / projectsPerView) === i
                                            ? 'bg-blue-500 scale-125'
                                            : 'bg-white/30 hover:bg-white/50'
                                        } ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Project Counter */}
                    <div className="text-center mt-4">
                        <span className="text-gray-400 text-sm">
                            {Math.min(currentIndex + projectsPerView, filteredProjects.length)} sur {filteredProjects.length} projets
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}