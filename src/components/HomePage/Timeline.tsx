'use client';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { Book, Briefcase, Calendar, CodeSlash, HeartFill, type Icon } from 'react-bootstrap-icons';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface Timeline {
    title: string;
    duration: string;
    org: string;
    icon?: Icon;
    description?: string;
    skills: string[];
    class: string;
    circleColor?: string;
    ringColor?: string;
}

export function Timeline() {
    const timelineRef = useRef<HTMLOListElement>(null);
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
            org: 'Ynov Campus (Actuellement en B3)',
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
            org: 'Orange Business',
            icon: CodeSlash,
            description: 'Développement pour Orange Business.',
            skills: ['React', '.NET'],
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

    // Set initial state
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
                    <div className="overflow-x-auto pt-6 pb-4">
                        <ol
                            ref={timelineRef}
                            className="relative flex flex-col border-l-2 border-gray-600 ml-4 md:flex-row md:border-t-2 md:border-l-0 md:ml-0 md:max-w-full"
                        >
                            {data.map((item, index) => (
                                <TimelineItem
                                    key={`${item.title}-${item.org}`}
                                    item={item}
                                    isLast={index === data.length - 1}
                                />
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TimelineItem({ item, isLast }: Readonly<{ item: Timeline; isLast: boolean }>) {
    return (
        <li className="timeline-item relative pl-8 mb-8 md:flex md:flex-col md:items-center md:min-w-30 md:flex-1 md:pl-4 md:pr-4 md:pt-10 md:mb-0">
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
                    {isLast && (
                        <span className="mt-1 block rounded bg-red-500 px-2 py-0.5 font-medium text-white text-xs md:mx-auto w-fit">
                            {'Récent'}
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
