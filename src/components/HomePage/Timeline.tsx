"use client"
import { Book, Briefcase, Calendar, HeartFill, Icon } from "react-bootstrap-icons";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

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
    const data: Timeline[] = [
        {
            "title": "Développeur Full Stack (alternance)",
            "duration": "Septembre 2024 - Aujourd'hui",
            "org": "Lex-Port",
            "icon": Briefcase,
            "description":"Développement de sites web pour les clients du cabinet.",
            "skills": ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "Mariadb", "Node.js"],
            "class": "text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-red-900 text-red-300",
            "circleColor": "bg-red-900",
            "ringColor": "ring-red-900/45"
        },
        {
            "title": "Mastère Informatique",
            "duration": "Septembre 2022 - Septembre 2027",
            "org": "Ynov Campus (Actuellement en B3)",
            "description": "Développement d'applications web, mobile et logiciel (apprentissage néanmoins de technologies d'infrastructures et de réseaux).",
            "skills": ["Développement Web", "Développement Mobile", "Développement Logiciel", "Infrastructures et Réseaux", "Cybersécurité", "Data Science"],
            "class": "text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-blue-900 text-blue-300",
            "circleColor": "bg-blue-900",
            "ringColor": "ring-blue-900/45"
        },
        {
            "title": "Maraude de l'Ordre de Malte",
            "duration": "Septembre 2019 - Aujourd'hui",
            "org": "Ordre de Malte",
            "icon": HeartFill,
            "description": "Aide aux sans-abris de Bordeaux.",
            "skills": ["Écoute", "Aide", "Partage"],
            "class": "text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-yellow-900 text-yellow-300",
            "circleColor": "bg-yellow-900",
            "ringColor": "ring-yellow-900/45"
        },
        {
            "title": "Scolarité (Maternelle, Primaire, Collège, Lycée)",
            "duration": "Septembre 2007 - Juin 2022",
            "org": "Sainte Marie Grand Lebrun",
            "description": "Scolarité de la maternelle à la terminale, baccalauréat général.",
            "icon": Book,
            "skills": ["Numérique et Sciences Informatiques", "Historie-Géographie Géopolitique et Sciences Politiques", "Sciences Économiques et Sociales"],
            "class": "text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-green-900 text-green-300",
            "circleColor": "bg-green-900",
            "ringColor": "ring-green-900/45"
        },
    ]

    return (
        <div className="min-h-screen snap-start p-8">
            <ol className="relative border-s-2 border-gray-600 ml-6">
                {data.map((item) => (
                    <TimelineItem key={item.title} item={item} index={data.indexOf(item)} />
                ))}
            </ol>
        </div>
    );
}

function TimelineItem({ item, index }: Readonly<{ item: Timeline; index: number }>) {
    const itemRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        if (itemRef.current) {
            gsap.fromTo(
                itemRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    delay: index * 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: itemRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }
    }, [index]);

    return (
        <li
            ref={itemRef}
            className="mb-10 ml-6 relative"
        >
            <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-10 ring-4 ${item.ringColor} ${item.circleColor}`}>
                {item.icon ? <item.icon className={"text-white w-4 h-4"} /> : <Calendar className={"text-white w-3 h-3"} />}
            </span>
            <div className="ml-6">
                <h3 className="flex items-center mb-1 lg:text-lg text-sm font-semibold text-white">
                    {item.title}
                    {index === 0 && (
                        <span className="bg-red-500 text-white text-xs font-medium ml-2 px-2.5 py-0.5 rounded">
                            {"Expérience la plus récente"}
                        </span>
                    )}
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                    {item.duration}
                </time>
                <p className="lg:text-lg text-sm text-white mb-2">{item.org}</p>
                {item.description && <p className="lg:text-lg text-sm text-white mb-4">{item.description}</p>}
                <div className="flex flex-wrap gap-2">
                    {item.skills.map((skill) => (
                        <span key={skill} className={item.class}>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </li>
    )
}