import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";

export enum ProjectType {
    School = "school",
    Personal = "personal",
    Professional = "professional",
}

export interface Project {
    title: string;
    description: string;
    type: ProjectType;
    url?: string;
    repoUrl?: string;
    image: string;
    tags: string[];
}


export function ProjectCard({ project }: { project: Project }) {
    const t = useTranslations("ProjectsPage");

    return (
        <div className='flex flex-col w-96 h-auto m-3 bg-black border-2 border-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:border-green-500 shadow-white hover:shadow-green-500'>
            <Image src={project.image} alt={project.title} className='w-full h-48 object-cover rounded-lg bg-gray-300' height={300} width={900} />
            <div className='p-4'>
                <h2 className='font-bold text-2xl mb-2'>{project.title}</h2>
                <p className='text-gray-300 mb-4'>{project.description}</p>
                <p className='text-sm text-gray-400 mb-4'>{t(`projectType.${project.type}`)}</p>
                <div className='flex flex-row space-x-2'>
                    {project.url && (
                        <Link href={project.url} className='inline-block px-6 py-2 text-sm font-medium leading-6 text-center text-white uppercase transition bg-green-500 rounded-lg shadow ripple hover:shadow-lg hover:bg-green-800 focus:outline-none'>
                            {t('link')}
                        </Link>
                    )}
                    {project.repoUrl && (
                        <Link href={project.repoUrl} className='inline-block px-6 py-2 text-sm font-medium leading-6 text-center text-white uppercase transition bg-gray-700 rounded-lg shadow ripple hover:shadow-lg hover:bg-gray-800 focus:outline-none'>
                            {t('repo')}
                        </Link>
                    )}
                </div>
                <div className='my-5 flex flex-row flex-wrap space-x-2'>
                    {project.tags.map((tag, index) => (
                        <span key={index} className='bg-gray-700 rounded-full px-3 py-1 text-sm'>#{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}