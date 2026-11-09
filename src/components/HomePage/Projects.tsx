'use client';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ProjectCard } from '@/components/HomePage/ProjectCard';
import { projects } from '@/data/projects';
import { ProjectType } from '@/types';
import { SectionHeading } from './SectionHeading';

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
