import { Book, Briefcase, CodeSlash, HeartFill, type Icon } from 'react-bootstrap-icons';

export interface TimelineEntry {
    title: string;
    duration: string;
    isNow?: boolean;
    org: string;
    // section of the generated CV
    kind: 'work' | 'education' | 'volunteer';
    // title shown on the CV instead of `title`
    cvTitle?: string;
    icon?: Icon;
    description?: string;
    skills: string[];
}

// most recent first
export const timeline: TimelineEntry[] = [
    {
        title: 'Développeur Full Stack (alternance)',
        duration: "Septembre 2025 - Aujourd'hui",
        isNow: true,
        org: 'Orange Business',
        kind: 'work',
        icon: CodeSlash,
        description: 'Développement pour Orange Business (Live Intelligence).',
        skills: ['.NET 10', 'React', 'TanStack', 'Kubernetes', 'ArgoCD', 'Docker', 'OpenCode', 'Vertex AI'],
    },
    {
        title: 'Développeur Full Stack (alternance)',
        duration: 'Septembre 2024 - Août 2025',
        org: 'Lex-Port',
        kind: 'work',
        icon: Briefcase,
        description: 'Développement de sites web pour le cabinet.',
        skills: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'Mariadb', 'Node.js'],
    },
    {
        title: 'Mastère Informatique',
        duration: 'Septembre 2022 - Septembre 2027',
        org: 'Ynov Campus (Actuellement en M2)',
        kind: 'education',
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
        kind: 'volunteer',
        icon: HeartFill,
        description: 'Aide aux sans-abris de Bordeaux.',
        skills: ['Écoute', 'Aide', 'Partage'],
    },
    {
        title: 'Scolarité (Maternelle, Primaire, Collège, Lycée)',
        duration: 'Septembre 2007 - Juin 2022',
        org: 'Sainte Marie Grand Lebrun',
        kind: 'education',
        cvTitle: 'Baccalauréat général',
        description: 'Scolarité de la maternelle à la terminale, baccalauréat général.',
        icon: Book,
        skills: [
            'Numérique et Sciences Informatiques',
            'Histoire-Géographie Géopolitique et Sciences Politiques',
            'Sciences Économiques et Sociales',
        ],
    },
];
