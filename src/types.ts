export enum ProjectType {
    School = 'École',
    Personal = 'Personnel',
    Professional = 'Professionnel',
}

export interface Project {
    title: string;
    description: string;
    type: ProjectType;
    url?: string;
    repoUrl?: string;
    image: string;
    tags: string[];
    // listed in the generated CV
    cv?: boolean;
}
