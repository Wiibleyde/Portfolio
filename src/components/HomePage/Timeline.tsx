'use client';
import { gsap } from 'gsap';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Book, Briefcase, Calendar, CodeSlash, HeartFill, type Icon } from 'react-bootstrap-icons';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface Timeline {
    title: string;
    duration: string;
    isNow?: boolean;
    org: string;
    icon?: Icon;
    description?: string;
    skills: string[];
    class: string;
    circleColor?: string;
    ringColor?: string;
}

function extractStartDate(duration: string): string {
    return duration.split(' - ')[0];
}

export function Timeline() {
    const timelineRef = useRef<HTMLOListElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScroll, setCanScroll] = useState(false);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const checkScroll = useCallback(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const hasOverflow = el.scrollWidth > el.clientWidth;
        setCanScroll(hasOverflow);
        setIsAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 10);
    }, []);

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        checkScroll();
        el.addEventListener('scroll', checkScroll, { passive: true });
        window.addEventListener('resize', checkScroll);
        return () => {
            el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [checkScroll]);
    const data: Timeline[] = [
        {
            title: 'Scolarité (Maternelle, Primaire, Collège, Lycée)',
            duration: 'Septembre 2007 - Juin 2022',
            org: 'Sainte Marie Grand Lebrun',
            description: 'Scolarité de la maternelle à la terminale, baccalauréat général.',
            icon: Book,
            skills: [
                'Numérique et Sciences Informatiques',
                'Historie-Géographie Géopolitique et Sciences Politiques',
                'Sciences Économiques et Sociales',
            ],
            class: 'text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-green-900 text-green-300',
            circleColor: 'bg-green-900',
            ringColor: 'ring-green-900/45',
        },
        {
            title: "Maraude de l'Ordre de Malte",
            duration: "Septembre 2019 - Aujourd'hui",
            org: 'Ordre de Malte',
            icon: HeartFill,
            description: 'Aide aux sans-abris de Bordeaux.',
            skills: ['Écoute', 'Aide', 'Partage'],
            class: 'text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-red-700 text-red-300',
            circleColor: 'bg-red-500',
            ringColor: 'ring-red-500/45',
        },
        {
            title: 'Mastère Informatique',
            duration: 'Septembre 2022 - Septembre 2027',
            org: 'Ynov Campus (Actuellement en M1)',
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
            class: 'text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-teal-900 text-teal-300',
            circleColor: 'bg-teal-300',
            ringColor: 'ring-teal-300/45',
        },
        {
            title: 'Développeur Full Stack (alternance)',
            duration: 'Septembre 2024 - Août 2025',
            org: 'Lex-Port',
            icon: Briefcase,
            description: 'Développement de sites web pour le cabinet.',
            skills: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'Mariadb', 'Node.js'],
            class: 'text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-blue-900 text-blue-300',
            circleColor: 'bg-blue-800',
            ringColor: 'ring-blue-800/45',
        },
        {
            title: 'Développeur Full Stack (alternance)',
            duration: "Septembre 2025 - Aujourd'hui",
            isNow: true,
            org: 'Orange Business',
            icon: CodeSlash,
            description: 'Développement pour Orange Business (Live Intelligence).',
            skills: ['React', '.NET', 'Tanstack', 'Docker'],
            class: 'text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-orange-400 text-orange-100',
            circleColor: 'bg-orange-400',
            ringColor: 'ring-orange-400/45',
        },
    ];

    useScrollAnimation(timelineRef, () => {
        const items = timelineRef.current?.querySelectorAll('.timeline-item');
        if (items) {
            gsap.fromTo(
                items,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' },
            );
        }
    });

    // Set initial statew
    useEffect(() => {
        if (timelineRef.current) {
            const items = timelineRef.current.querySelectorAll('.timeline-item');
            gsap.set(items, { opacity: 0, y: 50 });
        }
    }, []);

    return (
        <div id="timeline" className="relative min-h-screen snap-start bg-gray-900">
            <div className="absolute inset-0 opacity-5">
                <div
                    className="h-full w-full"
                    style={{
                        backgroundImage: `linear-gradient(45deg, #374151 25%, transparent 25%),
                                     linear-gradient(-45deg, #374151 25%, transparent 25%),
                                     linear-gradient(45deg, transparent 75%, #374151 75%),
                                     linear-gradient(-45deg, transparent 75%, #374151 75%)`,
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                    }}
                />
            </div>
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
                <div className="w-full rounded-2xl border border-blue-500/30 bg-linear-to-b from-blue-500/30 to-purple-600/30 p-8 shadow-lg">
                    <h2 className="mb-6 font-bold text-3xl text-white">Mon Parcours</h2>
                    <div className="relative">
                        <div ref={scrollContainerRef} className="overflow-x-auto pt-14 pb-6 overflow-y-hidden">
                            <ol
                                ref={timelineRef}
                                className="relative flex flex-col border-l-2 border-gray-600 ml-4 md:flex-row md:border-t-2 md:border-l-0 md:ml-0 md:min-w-max"
                            >
                                {data.map((item) => (
                                    <TimelineItem key={`${item.title}-${item.org}`} item={item} />
                                ))}
                            </ol>
                        </div>
                        {canScroll && !isAtEnd && (
                            <div className="hidden md:flex absolute -bottom-2 left-1/2 -translate-x-1/2 pointer-events-none">
                                <span className="animate-pulse flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 text-white/70">
                                    <span className="text-xs font-medium">Scroll</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TimelineItem({ item }: Readonly<{ item: Timeline }>) {
    const startDate = extractStartDate(item.duration);
    return (
        <li className="timeline-item relative pl-8 mb-8 md:flex md:flex-col md:items-center md:min-w-72 md:w-72 md:pl-4 md:pr-4 md:pt-14 md:mb-0">
            <span className="hidden md:block absolute -top-12 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-400 whitespace-nowrap">
                {startDate}
            </span>
            <span
                className={`absolute top-1 -left-4 md:-top-4 md:left-1/2 md:-translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full ring-4 ${item.ringColor} ${item.circleColor}`}
            >
                {item.icon ? (
                    <item.icon className={'h-4 w-4 text-white'} />
                ) : (
                    <Calendar className={'h-3 w-3 text-white'} />
                )}
            </span>
            <div className="w-full md:text-center">
                <h3 className="mb-1 font-semibold text-sm text-white leading-tight">
                    {item.title}
                    {item.isNow && (
                        <span className="mt-1 block rounded bg-green-500 px-2 py-0.5 font-medium text-white text-xs md:mx-auto w-fit">
                            {'Actuellement'}
                        </span>
                    )}
                </h3>
                <time className="mb-1 block font-normal text-xs text-gray-400 leading-none">{item.duration}</time>
                <p className="mb-2 text-sm font-medium text-white">{item.org}</p>
                {item.description && <p className="mb-3 text-xs text-gray-300">{item.description}</p>}
                <div className="flex flex-wrap gap-1 md:justify-center">
                    {item.skills.map((skill) => (
                        <span key={skill} className={item.class}>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </li>
    );
}
