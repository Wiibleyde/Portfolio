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
            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <div className="rounded-2xl border border-blue-500/30 bg-linear-to-b from-blue-500/30 to-purple-600/30 p-8 shadow-lg">
                    <h2 className="mb-6 font-bold text-3xl text-white">Mon Parcours</h2>
                    <ol ref={timelineRef} className="relative ml-6 border-gray-600 border-s-2">
                        {data.map((item, index) => (
                            <TimelineItem key={`${item.title}-${item.org}`} item={item} index={index} />
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
}

function TimelineItem({ item, index }: Readonly<{ item: Timeline; index: number }>) {
    return (
        <li className="timeline-item relative mb-8 ml-6">
            <span
                className={`-left-10 absolute flex h-8 w-8 items-center justify-center rounded-full ring-4 ${item.ringColor} ${item.circleColor}`}
            >
                {item.icon ? (
                    <item.icon className={'h-4 w-4 text-white'} />
                ) : (
                    <Calendar className={'h-3 w-3 text-white'} />
                )}
            </span>
            <div className="ml-6">
                <h3 className="mb-1 flex items-center font-semibold text-base text-white">
                    {item.title}
                    {index === 0 && (
                        <span className="ml-2 rounded bg-red-500 px-2.5 py-0.5 font-medium text-white text-xs">
                            {'Expérience la plus récente'}
                        </span>
                    )}
                </h3>
                <time className="mb-2 block font-normal text-base text-gray-400 leading-none">{item.duration}</time>
                <p className="mb-2 text-base text-white">{item.org}</p>
                {item.description && <p className="mb-4 text-base text-white">{item.description}</p>}
                <div className="flex flex-wrap gap-2">
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
