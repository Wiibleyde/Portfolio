import { useTranslations } from "next-intl";
import Background from "@public/img/background/project.jpg";

import { Link } from "@/i18n/routing";
import Image from "next/image";

import HopeLogo from "@public/img/projects/hope.png";
import LexPortLogo from "@public/img/projects/lexport.png";

enum ProjectType {
    School = "school",
    Personal = "personal",
    Professional = "professional",
}

interface Project {
    title: string;
    description: string;
    type: ProjectType;
    url: string;
    image: string;
    tags: string[];
}

const projects: Project[] = [
    {
        title: "Hope - GTARP",
        description: "Hope - GTARP est un serveur de jeu en ligne sur la plateforme FiveM.",
        type: ProjectType.Personal,
        url: "https://panel.hope-rp.com",
        image: HopeLogo.src,
        tags: ["GTAV", "Hope", "FiveM", "Typescript", "Lua", "C#"],
    },
    {
        title: "Site du cartel de camion Lex-Port",
        description: "Site web du cartel de camion pour l'action collective du cabinet d'avocats Lex-Port.",
        type: ProjectType.Professional,
        url: "https://cartel.lex-port.com",
        image: LexPortLogo.src,
        tags: ["Lex-Port", "Alternance", "Next.js", "Typescript", "TailwindCSS", "Prisma"],
    },
]

export default function ProjectsPage() {
    const t = useTranslations("ProjectsPage");

    return (
        <div className='flex flex-col min-h-screen bg-no-repeat bg-fixed overflow-x-hidden' style={{ backgroundImage: `url(${Background.src})`, backgroundSize: 'cover', backgroundPosition: 'top' }}>
            <div id='content' className='flex-grow mb-auto flex flex-col bg-fixed'>
                <div className='h-screen w-full bg-opacity-60 bg-black flex justify-center items-center'>
                    <h1 className='text-white text-8xl font-bold'>{t('title')}</h1>
                </div>
            </div>
            <div className='flex flex-col justify-center items-center bg-black h-fit p-8 space-y-8 text-white'>
                <p className="italic text-gray-500">{t('description')}</p>
                <h1 className='text-4xl font-bold'>{t('projects')}</h1>
                <div className='flex flex-row flex-wrap justify-center space-x-8'>
                    {projects.map((project, index) => (
                        <div key={index} className='flex flex-col w-96 h-auto bg-gray-800 p-6 rounded-lg shadow-lg'>
                            <Image src={project.image} alt={project.title} className='w-full h-48 object-cover rounded-lg bg-gray-300' height={192} width={384} />
                            <div className='p-4'>
                                <h2 className='font-bold text-2xl mb-2'>{project.title}</h2>
                                <p className='text-gray-300 mb-4'>{project.description}</p>
                                <p className='text-sm text-gray-400 mb-4'>{t(`projectType.${project.type}`)}</p>
                                <Link href={project.url} className='inline-block px-6 py-2 text-sm font-medium leading-6 text-center text-white uppercase transition bg-blue-600 rounded-lg shadow ripple hover:shadow-lg hover:bg-blue-800 focus:outline-none'>
                                    {t('link')}
                                </Link>
                                <div className='my-5 flex flex-row flex-wrap space-x-2'>
                                    {project.tags.map((tag, index) => (
                                        <span key={index} className='bg-gray-700 rounded-full px-3 py-1 text-sm'>#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}