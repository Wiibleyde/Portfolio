'use client';
import Me from '@public/img/pp.webp';
import Bro from '@public/img/projects/bro.png';
import EveBanner from '@public/img/projects/eve-banner.png';
import F1 from '@public/img/projects/f1.png';
import FurutsuGame from '@public/img/projects/furutsugame.png';
import HopeLogo from '@public/img/projects/hope.png';
import LexPortLogo from '@public/img/projects/lexport.png';
import LightManager from '@public/img/projects/light-manager.png';
import Motus from '@public/img/projects/motus.jpg';
import RPlaceLogo from '@public/img/projects/rplace-logo.png';
import SABSLogo from '@public/img/projects/sabs-logo.png';
import Twitch from '@public/img/projects/twitch.webp';
import WeazelNewsLogo from '@public/img/projects/WeazelNews_Logo.png';
import { gsap } from 'gsap';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'react-bootstrap-icons';
import { type Project, ProjectType } from '@/types';
import { ProjectCard } from './ProjectCard';

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
            title: 'Régie lumière FiveM',
            description:
                'Régie lumière pour des concerts. Aide : [JusteKal](https://mapping.justekal.be), [Waytostars](https://github.com/waytostars) et [FailyV](https://x.com/FailyV_GTARP)).',
            type: ProjectType.Personal,
            image: LightManager.src,
            tags: ['FiveM', 'TypeScript', 'GTARP', 'Régie', 'Lumière', 'Concert', 'FailyV'],
        },
        {
            title: 'Site SABS',
            description: 'Site vitrine du projet SABS. Découvrez [le site en ligne](https://sabs.vercel.app).',
            type: ProjectType.Personal,
            url: 'https://sabs.vercel.app',
            repoUrl: 'https://github.com/Wiibleyde/sabs',
            image: SABSLogo.src,
            tags: ['Next.js', 'TailwindCSS', 'Typescript', 'MindCityRP'],
        },
        {
            title: 'F1 App',
            description:
                "F1 App est une application web pour suivre les courses de Formule 1 en utilisant l'[API Open-F1](https://openf1.org/).",
            type: ProjectType.School,
            repoUrl: 'https://github.com/Wiibleyde/f1-app',
            image: F1.src,
            tags: ['F1', 'Open-F1 API', 'React-Native', 'Typescript', 'Expo'],
        },
        {
            title: 'Portfolio',
            description: 'Portfolio de Nathan Bonnell, développeur web fullstack.',
            type: ProjectType.Personal,
            url: 'https://nathan.bonnell.fr',
            repoUrl: 'https://github.com/Wiibleyde/portfolio',
            image: Me.src,
            tags: ['Portfolio', 'React', 'Next.js', 'TailwindCSS', 'Typescript'],
        },
        {
            title: 'Hope - GTARP (Fermé)',
            description:
                'Hope - GTARP est (était 😢) un serveur de jeu sur la plateforme [FiveM](https://fivem.net/). Voir la [vidéo de présentation](https://youtu.be/Q8jP5BC0cXM).',
            type: ProjectType.Personal,
            url: 'https://youtu.be/Q8jP5BC0cXM',
            image: HopeLogo.src,
            tags: [
                'GTAV',
                'Hope',
                'FiveM',
                'Typescript',
                'Lua',
                'C#',
                'Go',
                'MariaDB',
                'InfluxDB',
                'C++',
                'Grafana',
                'Discord.js',
            ],
        },
        {
            title: "Site du cabinet d'avocats Lex-Port",
            description: "Site vitrine du cabinet d'avocats Lex-Port.",
            type: ProjectType.Professional,
            url: 'https://lex-port.com',
            image: LexPortLogo.src,
            tags: ['Lex-Port', 'Alternance', 'Next.js', 'Typescript', 'TailwindCSS', 'Prisma', 'i18n', 'SEO'],
        },
        {
            title: 'RPlace Analyser',
            description: "RPlace Analyzer est un résultat d'analyse de l'événement RPlace 2017.",
            type: ProjectType.School,
            repoUrl: 'https://github.com/Wiibleyde/RPlaceAnalyzer',
            image: RPlaceLogo.src,
            tags: ['RPlace', 'MongoDB', 'Python', 'Reddit', 'Data Analysis'],
        },
        {
            title: 'Site du cartel de camion Lex-Port',
            description: "Site web pour l'action collective du cabinet d'avocats Lex-Port.",
            type: ProjectType.Professional,
            url: 'https://cartel.lex-port.com',
            image: LexPortLogo.src,
            tags: ['Lex-Port', 'Alternance', 'Next.js', 'Typescript', 'TailwindCSS', 'Prisma', 'i18n'],
        },
        {
            title: 'Eve',
            description:
                "Eve est un bot [Discord](https://discord.com/) pour les serveurs Discord fait en Typescript. Consultez les [conditions d'utilisation](/eve/tos).",
            type: ProjectType.Personal,
            repoUrl: 'https://github.com/Wiibleyde/Eve',
            image: EveBanner.src,
            tags: ['Discord.js', 'Bot', 'Typescript', 'Node.js', 'Prisma'],
        },
        {
            title: 'Script Caméra pour FiveM (GTA)',
            description: 'Fivem Cam Script est une ressource FiveM (GTA).',
            type: ProjectType.Personal,
            repoUrl: 'https://github.com/Wiibleyde/Fivem-Cam-Script',
            image: WeazelNewsLogo.src,
            tags: ['FiveM', 'GTARP', 'Lua'],
        },
        {
            title: 'TwitchStreamRetrievers',
            description: 'TwitchStreamRetrievers est une API et un WS pour notifier de streams Twitch.',
            type: ProjectType.Personal,
            repoUrl: 'https://github.com/Wiibleyde/TwitchStreamRetrievers',
            image: Twitch.src,
            tags: ['Twitch', 'API', 'Websocket', 'Typescript', 'Node.js'],
        },
        {
            title: 'Mootus',
            description: 'Mootus est une reproduction du jeu Motus en ligne.',
            type: ProjectType.School,
            url: 'https://wiibleyde.github.io/Mootus/',
            repoUrl: 'https://github.com/Wiibleyde/Mootus',
            image: Motus.src,
            tags: ['Motus', 'Vite', 'React', 'Typescript', 'Atom', 'TailwindCSS'],
        },
        {
            title: 'Régie Black Room Orchestra',
            description: 'Régie vidéo du concert de Black Room Orchestra sur le serveur FailyV.',
            type: ProjectType.Personal,
            url: 'https://youtu.be/otioMSFKVi0',
            image: Bro.src,
            tags: ['VMix', 'FailyV', 'Concert', 'Régie', 'Vidéo', 'Live', 'FiveM'],
        },
        {
            title: 'Furutsu Game',
            description: 'Furutsu Game est une copie du jeu Suika Game fait avec Unity.',
            type: ProjectType.School,
            repoUrl: 'https://github.com/Wiibleyde/FurutsuGame',
            image: FurutsuGame.src,
            tags: ['Unity', 'C#', 'Game', 'Suika Game', 'Ynov'],
        },
    ];

    // Use displayedFilter for actual filtering to ensure sync with animations
    const filteredProjects = projects.filter(
        (project) => displayedFilter === 'all' || project.type === displayedFilter,
    );

    // Calculate how many projects to show at once based on screen size
    const getProjectsPerView = useCallback(() => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth >= 1280) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        }
        return 3;
    }, []);

    const [projectsPerView, setProjectsPerView] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            setProjectsPerView(getProjectsPerView());
            setCurrentIndex(0); // Reset to first page on resize
        };

        setProjectsPerView(getProjectsPerView());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [getProjectsPerView]);

    const maxIndex = Math.max(0, filteredProjects.length - projectsPerView);
    const totalPages = Math.ceil(filteredProjects.length / projectsPerView);

    const nextProjects = () => {
        if (currentIndex < maxIndex) {
            setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
            animateTransition();
        }
    };

    const prevProjects = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => Math.max(prev - 1, 0));
            animateTransition();
        }
    };

    const goToPage = (page: number) => {
        const newIndex = Math.min(page * projectsPerView, maxIndex);
        setCurrentIndex(newIndex);
        animateTransition();
    };

    const animateTransition = useCallback(() => {
        if (gridRef.current && !isAnimating) {
            gsap.to(gridRef.current, {
                x: -currentIndex * (320 + 24),
                duration: 0.5,
                ease: 'power2.out',
            });
        }
    }, [currentIndex, isAnimating]);

    // Initial setup - set all elements to invisible
    useEffect(() => {
        if (titleRef.current && filtersRef.current && carouselRef.current) {
            gsap.set([titleRef.current, filtersRef.current, carouselRef.current], {
                opacity: 0,
                y: 30,
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
                            ease: 'power2.out',
                        })
                            .to(
                                filtersRef.current,
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.6,
                                    ease: 'power2.out',
                                },
                                '-=0.4',
                            )
                            .to(
                                carouselRef.current,
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.8,
                                    ease: 'back.out(1.7)',
                                },
                                '-=0.3',
                            );
                    }
                });
            },
            { threshold: 0.3, rootMargin: '0px 0px -100px 0px' },
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
            },
        });

        // Phase 1: Fade out current projects
        timeline.to(carouselRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: 'power2.inOut',
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
        timeline.to(
            carouselRef.current,
            {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: 'power2.out',
            },
            '+=0.05',
        );
    };

    // Handle carousel transitions only when not animating filter
    useEffect(() => {
        if (isVisible && !isAnimating) {
            animateTransition();
        }
    }, [isVisible, isAnimating, animateTransition]);

    // Sync displayedFilter with activeFilter on initial load
    useEffect(() => {
        if (!isAnimating) {
            setDisplayedFilter(activeFilter);
        }
    }, [activeFilter, isAnimating]);

    const getFilterLabel = (type: ProjectType | 'all') => {
        switch (type) {
            case 'all':
                return 'Tous';
            case ProjectType.Personal:
                return 'Personnel';
            case ProjectType.School:
                return 'École';
            case ProjectType.Professional:
                return 'Professionnel';
            default:
                return type;
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative flex h-screen snap-start flex-col bg-linear-to-br from-slate-900 via-blue-900/20 to-purple-900/30"
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="h-full w-full"
                    style={{
                        backgroundImage: `linear-gradient(90deg, #374151 1px, transparent 1px),
                                     linear-gradient(180deg, #374151 1px, transparent 1px)`,
                        backgroundSize: '20px 20px',
                    }}
                />
            </div>

            <div className="relative z-10 flex h-full flex-col p-6 md:p-8">
                {/* Header */}
                <div ref={titleRef} className="mb-6 text-center">
                    <h2 className="mb-3 font-bold text-3xl text-white md:text-4xl">Mes Projets</h2>
                    <div className="mx-auto h-1 w-20 rounded-full bg-linear-to-r from-blue-500 to-purple-600" />
                </div>

                {/* Filters */}
                <div ref={filtersRef} className="mb-6 flex justify-center">
                    <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
                        {(
                            ['all', ProjectType.Personal, ProjectType.School, ProjectType.Professional] as (
                                | ProjectType
                                | 'all'
                            )[]
                        ).map((filter) => (
                            <button
                                type="button"
                                key={filter}
                                aria-label={`Filtrer par ${getFilterLabel(filter)}`}
                                onClick={() => handleFilterChange(filter)}
                                disabled={isAnimating}
                                className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium text-sm transition-all duration-300 ${
                                    activeFilter === filter
                                        ? 'bg-blue-500 text-white shadow-lg'
                                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                } ${isAnimating ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                <Filter className="h-3 w-3" />
                                {getFilterLabel(filter)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Projects Carousel */}
                <div ref={carouselRef} className="flex flex-1 flex-col justify-center">
                    <div className="relative">
                        {/* Navigation Buttons */}
                        <button
                            type="button"
                            aria-label="Projet précédent"
                            onClick={prevProjects}
                            disabled={currentIndex === 0 || isAnimating}
                            className={`-translate-y-1/2 absolute top-1/2 left-4 z-20 rounded-full p-3 transition-all duration-300 ${
                                currentIndex === 0 || isAnimating
                                    ? 'cursor-not-allowed bg-white/5 text-gray-500'
                                    : 'bg-white/10 text-white hover:scale-110 hover:bg-white/20'
                            }`}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>

                        <button
                            type="button"
                            onClick={nextProjects}
                            aria-label="Projet suivant"
                            disabled={currentIndex >= maxIndex || isAnimating}
                            className={`-translate-y-1/2 absolute top-1/2 right-4 z-20 rounded-full p-3 transition-all duration-300 ${
                                currentIndex >= maxIndex || isAnimating
                                    ? 'cursor-not-allowed bg-white/5 text-gray-500'
                                    : 'bg-white/10 text-white hover:scale-110 hover:bg-white/20'
                            }`}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>

                        {/* Projects Container */}
                        <div className="mx-16 overflow-hidden">
                            <div
                                ref={gridRef}
                                className="flex gap-6 px-2 py-4"
                                style={{
                                    width: `${filteredProjects.length * (320 + 24)}px`,
                                    willChange: 'transform',
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
                        <div className="mt-6 flex justify-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    type="button"
                                    key={i}
                                    onClick={() => goToPage(i)}
                                    disabled={isAnimating}
                                    aria-label={`Aller à la page ${i + 1}`}
                                    className={`h-3 w-3 rounded-full transition-all duration-300 ${
                                        Math.floor(currentIndex / projectsPerView) === i
                                            ? 'scale-125 bg-blue-500'
                                            : 'bg-white/30 hover:bg-white/50'
                                    } ${isAnimating ? 'cursor-not-allowed opacity-50' : ''}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Project Counter */}
                    <div className="mt-4 text-center">
                        <span className="text-gray-400 text-sm">
                            {Math.min(currentIndex + projectsPerView, filteredProjects.length)} sur{' '}
                            {filteredProjects.length} projets
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
