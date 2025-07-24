'use client';
import { Book, Briefcase, Calendar, HeartFill, Icon, CodeSlash } from 'react-bootstrap-icons';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

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
    const [isVisible, setIsVisible] = useState(false);
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

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true);

                        const items = timelineRef.current?.querySelectorAll('.timeline-item');
                        if (items) {
                            gsap.fromTo(
                                items,
                                { opacity: 0, y: 50 },
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.6,
                                    stagger: 0.15,
                                    ease: 'power2.out',
                                }
                            );
                        }
                    }
                });
            },
            { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
        );

        if (timelineRef.current) {
            observer.observe(timelineRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [isVisible]);

    // Set initial state
    useEffect(() => {
        if (timelineRef.current) {
            const items = timelineRef.current.querySelectorAll('.timeline-item');
            gsap.set(items, { opacity: 0, y: 50 });
        }
    }, []);

    return (
        <div id="timeline" className="min-h-screen snap-start relative bg-gray-900">
            <div className="absolute inset-0 opacity-5">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `linear-gradient(45deg, #374151 25%, transparent 25%), 
                                     linear-gradient(-45deg, #374151 25%, transparent 25%), 
                                     linear-gradient(45deg, transparent 75%, #374151 75%), 
                                     linear-gradient(-45deg, transparent 75%, #374151 75%)`,
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                    }}
                ></div>
            </div>
            <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
                <div className="border border-blue-500/30 bg-gradient-to-b from-blue-500/30 to-purple-600/30 rounded-2xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-white mb-6">Mon Parcours</h2>
                    <ol ref={timelineRef} className="relative border-s-2 border-gray-600 ml-6">
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
        <li className="mb-8 ml-6 relative timeline-item">
            <span
                className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-10 ring-4 ${item.ringColor} ${item.circleColor}`}
            >
                {item.icon ? (
                    <item.icon className={'text-white w-4 h-4'} />
                ) : (
                    <Calendar className={'text-white w-3 h-3'} />
                )}
            </span>
            <div className="ml-6">
                <h3 className="flex items-center mb-1 text-base font-semibold text-white">
                    {item.title}
                    {index === 0 && (
                        <span className="bg-red-500 text-white text-xs font-medium ml-2 px-2.5 py-0.5 rounded">
                            {'Expérience la plus récente'}
                        </span>
                    )}
                </h3>
                <time className="block mb-2 text-base font-normal leading-none text-gray-400">{item.duration}</time>
                <p className="text-base text-white mb-2">{item.org}</p>
                {item.description && <p className="text-base text-white mb-4">{item.description}</p>}
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
