import { useTranslations } from "next-intl";
import Background from "@public/img/background/project.jpg";
import HopeLogo from "@public/img/projects/hope.png";
import LexPortLogo from "@public/img/projects/lexport.png";
import { ScrollButton } from "@/components/UI/ScrollButton";
import { Project, ProjectCard, ProjectType } from "@/components/projects/ProjectCard";

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
            <div className='flex-grow mb-auto flex flex-col bg-fixed'>
                <div className='h-screen w-full bg-opacity-60 bg-black flex flex-col justify-center items-center'>
                    <h1 className='text-white text-8xl font-bold flex-grow flex items-center justify-center'>{t('title')}</h1>
                    <ScrollButton />
                </div>
            </div>
            <div className='flex flex-col justify-center items-center bg-black h-fit p-8 space-y-8 text-white' id='content'>
                <p className="italic text-gray-500">{t('description')}</p>
                <h1 className='text-4xl font-bold'>{t('projects')}</h1>
                <div className='flex flex-row flex-wrap justify-center space-x-8'>
                    {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} />
                    ))}
                </div>
            </div>
        </div>
    )
}

