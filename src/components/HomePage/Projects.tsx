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
import WikiGuessrBanner from '@public/img/projects/wikiguessr-banner.png';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ProjectCard } from '@/components/HomePage/ProjectCard';
import { type Project, ProjectType } from '@/types';
import { SectionHeading } from './SectionHeading';

const projects: Project[] = [
    {
        title: 'WikiGuessr',
        description:
            'WikiGuessr est un jeu inspiré de [Pédantix](https://pedantix.certitudes.org/) où les joueurs doivent deviner la page.',
        type: ProjectType.School,
        url: 'https://wikiguessr.bonnell.fr/',
        repoUrl: 'https://github.com/Wiibleyde/BetterWikiGuessr',
        tags: ['WikiGuessr', 'Pédantix', 'Next.js', 'TailwindCSS', 'Typescript', 'Docker', 'Github Actions'],
        image: WikiGuessrBanner.src,
    },
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
const FILTERS: { value: ProjectType | 'all'; label: string }[] = [
    { value: 'all', label: 'Tous' },
    { value: ProjectType.Personal, label: 'Personnel' },
    { value: ProjectType.School, label: 'École' },
    { value: ProjectType.Professional, label: 'Professionnel' },
];

const INITIAL_COUNT = 6;

gsap.registerPlugin(Flip);

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function Projects() {
    const [activeFilter, setActiveFilter] = useState<ProjectType | 'all'>('all');
    const [showAll, setShowAll] = useState(false);

    const gridRef = useRef<HTMLDivElement>(null);
    const flipState = useRef<Flip.FlipState | null>(null);
    const previousHeight = useRef(0);

    const filteredProjects = projects.filter((project) => activeFilter === 'all' || project.type === activeFilter);
    const visibleTitles = new Set(
        (showAll ? filteredProjects : filteredProjects.slice(0, INITIAL_COUNT)).map((project) => project.title),
    );

    // Snapshot card positions before the layout changes, then animate from that snapshot (FLIP)
    const updateView = (update: () => void) => {
        if (gridRef.current) {
            flipState.current = Flip.getState(gridRef.current.children);
            previousHeight.current = gridRef.current.offsetHeight;
        }
        update();
    };

    useLayoutEffect(() => {
        const state = flipState.current;
        const grid = gridRef.current;
        if (!state || !grid) return;
        flipState.current = null;
        if (prefersReducedMotion()) return;
        // tween the grid height between the old and new layout so the next section doesn't jump
        gsap.fromTo(
            grid,
            { height: previousHeight.current, overflow: 'hidden' },
            { height: grid.offsetHeight, duration: 0.6, ease: 'power3.inOut' },
        );
        Flip.from(state, {
            duration: 0.6,
            ease: 'power3.inOut',
            // only leaving cards go absolute; staying/entering ones keep their grid width and just slide
            absolute: grid.querySelectorAll(':scope > .hidden'),
            // release the height only once every card is back in the normal flow
            onComplete: () => gsap.set(grid, { clearProps: 'height,overflow' }),
            onEnter: (cards) =>
                gsap.fromTo(cards, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.45, delay: 0.2 }),
            onLeave: (cards) => gsap.to(cards, { opacity: 0, scale: 0.95, duration: 0.3 }),
        });
    });

    // One staggered entrance the first time the grid scrolls into view
    useEffect(() => {
        const grid = gridRef.current;
        if (!grid || prefersReducedMotion()) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                gsap.from(grid.querySelectorAll(':scope > :not(.hidden)'), {
                    opacity: 0,
                    y: 24,
                    duration: 0.7,
                    stagger: 0.07,
                    ease: 'power3.out',
                });
            },
            { threshold: 0.1 },
        );
        observer.observe(grid);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="projects" className="relative border-zinc-900 border-t py-24 md:py-32">
            <div className="mx-auto max-w-6xl px-6 md:px-10">
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <SectionHeading title="Projets" />
                    <div
                        role="tablist"
                        aria-label="Filtrer les projets"
                        className="mb-10 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-zinc-800 p-1 md:mb-14"
                    >
                        {FILTERS.map(({ value, label }) => (
                            <button
                                type="button"
                                role="tab"
                                key={value}
                                aria-selected={activeFilter === value}
                                onClick={() =>
                                    updateView(() => {
                                        setActiveFilter(value);
                                        setShowAll(false);
                                    })
                                }
                                className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition-colors sm:px-3.5 ${
                                    activeFilter === value
                                        ? 'bg-zinc-100 text-zinc-950'
                                        : 'text-zinc-400 hover:text-zinc-100'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div
                    ref={gridRef}
                    className="relative grid grid-cols-1 content-start gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {/* every card stays mounted so Flip can animate the ones leaving */}
                    {projects.map((project) => (
                        <div
                            key={project.title}
                            data-flip-id={project.title}
                            className={visibleTitles.has(project.title) ? 'flex min-w-0' : 'hidden'}
                        >
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>

                {filteredProjects.length > INITIAL_COUNT && (
                    <div className="mt-10 flex justify-center">
                        <button
                            type="button"
                            onClick={() => updateView(() => setShowAll((v) => !v))}
                            className="btn btn-secondary"
                        >
                            {showAll ? 'Voir moins' : `Voir les ${filteredProjects.length} projets`}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
