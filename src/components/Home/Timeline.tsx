"use client"
import { Book, Briefcase, Calendar, HeartFill, Icon } from "react-bootstrap-icons";
import { motion } from "framer-motion";

interface Timeline {
    title: string;
    duration: string;
    org: string;
    icon?: Icon;
    description?: string;
    skills: string[];
    class: string;
}

const data: Timeline[] = [
    {
        title: "Développeur Fullstack",
        duration: "Septembre 2024 - Aujourd'hui",
        org: "Lex-Port",
        icon: Briefcase,
        description: "Développement de sites web pour les clients de l'entreprise.",
        skills: ["Next.js", "React", "TailwindCSS", "TypeScript", "Node.js"],
        class: "bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300",
    },
    {
        title: "Mastère Informatique",
        duration: "Septembre 2022 - Septembre 2027",
        org: "Ynov Campus",
        description: "Développement d'applications web, mobile et logiciel (apprentissage néanmoins de technologies d'infrastructures et de réseaux).",
        skills: ["Développement Web", "Développement Mobile", "Développement Logiciel"],
        class: "bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300",
    },
    {
        title: "Maraude de l'Ordre de Malte",
        duration: "Septembre 2019 - Aujourd'hui",
        org: "Ordre de Malte",
        icon: HeartFill,
        description: "Aide aux sans-abris de Bordeaux.",
        skills: ["Écoute", "Aide", "Partage"],
        class: "bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300",
    },
    {
        title: "Baccalauréat Général",
        duration: "Septembre 2007 - Juin 2022",
        org: "Sainte Marie Grand Lebrun",
        icon: Book,
        skills: ["Numérique et Sciences Informatiques", "Historie-Géographie géopolitique et sciences politiques", "Sciences économiques et sociales"],
        class: "bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300",
    },
];

export function Timeline() {
    return (
        <div>
            <ol className="relative border-s border-gray-200 dark:border-gray-700">
                {data.map((item) => (
                    <TimelineItem key={item.title} item={item} index={data.indexOf(item)} />
                ))}
            </ol>
        </div>
    );
}

const TimelineItem = ({ item, index }: { item: Timeline; index: number }) => (
    <motion.li
        className="mb-10 ms-6"
        initial={{ opacity: 0, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
    >
        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
            {item.icon ? <item.icon className={"text-blue-800 dark:text-blue-300 w-2.5 h-2.5"} /> : <Calendar className={"text-blue-800 dark:text-blue-300 w-2.5 h-2.5"} />}
        </span>
        <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
            {item.title}
            {index === 0 && (
                <span className="bg-red-500 text-[#fff] text-sm font-medium me-2 px-2.5 py-0.5 border-sky-100 rounded ms-3">
                    Latest
                </span>
            )}
        </h3>
        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
            {item.duration}
        </time>
        <p>{item.org}</p>
        {item.description && <p>{item.description}</p>}
        <div className="flex flex-wrap mt-8">
            {item.skills.map((skill, idx) => (
                <span key={idx} className={item.class}>
                    {skill}
                </span>
            ))}
        </div>
    </motion.li>
);