'use client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { Book, Briefcase, Calendar, CodeSlash, HeartFill, type Icon } from 'react-bootstrap-icons';
import { SectionHeading } from './SectionHeading';

gsap.registerPlugin(ScrollTrigger);

interface Timeline {
    title: string;
    duration: string;
    isNow?: boolean;
    org: string;
    icon?: Icon;
    description?: string;
    skills: string[];
}

// most recent first
const data: Timeline[] = [
    {
        title: 'Développeur Full Stack (alternance)',
        duration: "Septembre 2025 - Aujourd'hui",
        isNow: true,
        org: 'Orange Business',
        icon: CodeSlash,
        description: 'Développement pour Orange Business (Live Intelligence).',
        skills: ['.NET 10', 'React', 'TanStack', 'Kubernetes', 'ArgoCD', 'Docker', 'OpenCode', 'Vertex AI'],
    },
    {
        title: 'Développeur Full Stack (alternance)',
        duration: 'Septembre 2024 - Août 2025',
        org: 'Lex-Port',
        icon: Briefcase,
        description: 'Développement de sites web pour le cabinet.',
        skills: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'Mariadb', 'Node.js'],
    },
    {
        title: 'Mastère Informatique',
        duration: 'Septembre 2022 - Septembre 2027',
        org: 'Ynov Campus (Actuellement en M2)',
        description:
            "Développement d'applications web, mobile et logiciel (apprentissage néanmoins de technologies d'infrastructures et de réseaux).",
        skills: [
            'Développement Web',
            'Développement Mobile',
            'Développement Logiciel',
            'Infrastructures et Réseaux',
            'Cybersécurité',
            'Data Science',
        ],
    },
    {
        title: "Maraude de l'Ordre de Malte",
        duration: "Septembre 2019 - Aujourd'hui",
        org: 'Ordre de Malte',
        icon: HeartFill,
        description: 'Aide aux sans-abris de Bordeaux.',
        skills: ['Écoute', 'Aide', 'Partage'],
    },
    {
        title: 'Scolarité (Maternelle, Primaire, Collège, Lycée)',
        duration: 'Septembre 2007 - Juin 2022',
        org: 'Sainte Marie Grand Lebrun',
        description: 'Scolarité de la maternelle à la terminale, baccalauréat général.',
        icon: Book,
        skills: [
            'Numérique et Sciences Informatiques',
            'Histoire-Géographie Géopolitique et Sciences Politiques',
            'Sciences Économiques et Sociales',
        ],
    },
];

export function Timeline() {
    const listRef = useRef<HTMLOListElement>(null);
    const fillRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const list = listRef.current;
        if (!list) return;
        const items = list.querySelectorAll<HTMLElement>(':scope > li');
        // no scroll effect: show the rail filled and every step lit
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            for (const item of items) item.classList.add('is-active');
            return;
        }
        const ctx = gsap.context(() => {
            gsap.fromTo(
                fillRef.current,
                { scaleY: 0 },
                {
                    scaleY: 1,
                    ease: 'none',
                    scrollTrigger: { trigger: list, start: 'top 65%', end: 'bottom 65%', scrub: 0.4 },
                },
            );
            for (const item of items) {
                // stays lit once passed, turns off only when scrolling back above it
                ScrollTrigger.create({
                    trigger: item,
                    start: 'top 65%',
                    onEnter: () => item.classList.add('is-active'),
                    onLeaveBack: () => item.classList.remove('is-active'),
                });
            }
        }, list);
        return () => ctx.revert();
    }, []);

    return (
        <section id="timeline" className="relative border-zinc-900 border-t py-24 md:py-32">
            <div className="mx-auto max-w-6xl px-6 md:px-10">
                <SectionHeading title="Parcours" />

                <ol ref={listRef} className="relative">
                    {/* rail behind the step markers, filled with the accent color as you scroll */}
                    <div
                        aria-hidden="true"
                        className="-translate-x-1/2 absolute top-4 bottom-4 left-4 w-px bg-zinc-800 md:left-[160px]"
                    >
                        <div ref={fillRef} className="h-full w-full origin-top bg-accent" />
                    </div>
                    {data.map((item) => (
                        <TimelineItem key={`${item.title}-${item.org}`} item={item} />
                    ))}
                </ol>
            </div>
        </section>
    );
}

function TimelineItem({ item }: Readonly<{ item: Timeline }>) {
    const ItemIcon = item.icon ?? Calendar;
    const startYear = item.duration.match(/\d{4}/)?.[0];
    return (
        <li className="group relative grid grid-cols-[32px_1fr] gap-x-5 pb-14 last:pb-0 md:grid-cols-[120px_32px_1fr] md:gap-x-6">
            <p className="hidden pt-0.5 text-right font-mono text-3xl text-zinc-700 tracking-tight transition-colors duration-500 group-[.is-active]:text-zinc-100 md:block">
                {startYear}
            </p>
            <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-500 transition-colors duration-500 group-[.is-active]:border-accent group-[.is-active]:text-accent">
                <ItemIcon className="h-3.5 w-3.5" />
            </span>
            <div className="pt-1">
                <time className="font-mono text-xs text-zinc-500">{item.duration}</time>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="font-medium text-lg text-zinc-50">{item.title}</h3>
                    {item.isNow && (
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] text-emerald-300">
                            Actuellement
                        </span>
                    )}
                </div>
                <p className="mt-1 text-accent text-sm">{item.org}</p>
                {item.description && <p className="mt-3 max-w-2xl text-zinc-400">{item.description}</p>}
                <ul className="mt-4 flex flex-wrap gap-1.5">
                    {item.skills.map((skill) => (
                        <li key={skill} className="tag">
                            {skill}
                        </li>
                    ))}
                </ul>
            </div>
        </li>
    );
}
