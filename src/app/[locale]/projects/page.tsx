"use client"
import { useTranslations } from "next-intl";
import { ScrollButton } from "@/components/UI/ScrollButton";
import { Project, ProjectCard, ProjectType } from "@/components/Projects/ProjectCard";

import HopeLogo from "@public/img/projects/hope.png";
import LexPortLogo from "@public/img/projects/lexport.png";
import RPlaceLogo from "@public/img/projects/rplace-logo.png";
import EveBanner from "@public/img/projects/eve-banner.png";
import WeazelNewsLogo from "@public/img/projects/WeazelNews_Logo.png";
import Motus from "@public/img/projects/motus.jpg";
import Twitch from "@public/img/projects/twitch.webp";
import Bro from "@public/img/projects/bro.png";
import FurutsuGame from "@public/img/projects/furutsugame.png";

const projects: Project[] = [
    {
        title: "Portfolio",
        description: "Portfolio de Nathan Bonnell, développeur web fullstack.",
        type: ProjectType.Personal,
        url: "https://nathan.bonnell.fr",
        repoUrl: "https://github.com/Wiibleyde/portfolio",
        image: "/img/picture/pp.png",
        tags: ["Portfolio", "React", "Next.js", "TailwindCSS", "Typescript"],
    },
    {
        title: "Hope - GTARP (Fermé)",
        description: "Hope - GTARP est (était 😢) un serveur de jeu en ligne sur la plateforme FiveM.",
        type: ProjectType.Personal,
        image: HopeLogo.src,
        tags: ["GTAV", "Hope", "FiveM", "Typescript", "Lua", "C#", "Go", "MariaDB", "InfluxDB", "C++", "Grafana", "Discord.js"],
    },
    {
        title: "RPlace Analyser",
        description: "RPlace Analyzer est un outil d'analyse des données de l'événement RPlace 2017. Il permet de visualiser les données de l'événement.",
        type: ProjectType.School,
        repoUrl: "https://github.com/Wiibleyde/RPlaceAnalyzer",
        image: RPlaceLogo.src,
        tags: ["RPlace", "MongoDB", "Python", "Reddit", "Data Analysis"],
    },
    {
        title: "Site du cartel de camion Lex-Port",
        description: "Site web du cartel de camion pour l'action collective du cabinet d'avocats Lex-Port.",
        type: ProjectType.Professional,
        url: "https://cartel.lex-port.com",
        image: LexPortLogo.src,
        tags: ["Lex-Port", "Alternance", "Next.js", "Typescript", "TailwindCSS", "Prisma", "i18n"],
    },
    {
        title: "Eve",
        description: "Eve est un bot Discord multifonctionnel pour les serveurs Discord fait en Typescript.",
        type: ProjectType.Personal,
        repoUrl: "https://github.com/Wiibleyde/Eve",
        image: EveBanner.src,
        tags: ["Discord.js", "Bot", "Typescript", "Node.js", "Prisma"],
    },
    {
        title: "Script Caméra pour FiveM (GTA)",
        description: "Fivem Cam Script est une ressource à ajouter à votre serveur FiveM (GTA-RP) qui vous permet de passer en mode caméraman à pied ou en hélicoptère, écrite en Lua.",
        type: ProjectType.Personal,
        repoUrl: "https://github.com/Wiibleyde/Fivem-Cam-Script",
        image: WeazelNewsLogo.src,
        tags: ["FiveM", "GTARP", "Lua"],
    },
    {
        title: "TwitchStreamRetrievers",
        description: "TwitchStreamRetrievers est une API et websocket pour récupérer les informations de streams Twitch.",
        type: ProjectType.Personal,
        repoUrl: "https://github.com/Wiibleyde/TwitchStreamRetrievers",
        image: Twitch.src,
        tags: ["Twitch", "API", "Websocket", "Typescript", "Node.js"],
    },
    {
        title: "Mootus",
        description: "Mootus est une reproduction du jeu Motus en ligne.",
        type: ProjectType.School,
        url: "https://wiibleyde.github.io/Mootus/",
        repoUrl: "https://github.com/Wiibleyde/Mootus",
        image: Motus.src,
        tags: ["Motus", "Vite", "React", "Typescript", "Atom", "TailwindCSS"],
    },
    {
        title: "Régie Black Room Orchestra",
        description: "Régie vidéo du concert de Black Room Orchestra sur le serveur FailyV (ainsi que d'autres sur le même serveur).",
        type: ProjectType.Personal,
        url: "https://youtu.be/otioMSFKVi0",
        image: Bro.src,
        tags: ["VMix", "FailyV", "Concert", "Régie", "Vidéo", "Live","FiveM"],
    },
    {
        title: "Furutsu Game",
        description: "Furutsu Game est une copie du jeu Suika Game fait avec Unity.",
        type: ProjectType.School,
        repoUrl: "https://github.com/Wiibleyde/FurutsuGame",
        image: FurutsuGame.src,
        tags: ["Unity", "C#", "Game", "Suika Game", "Ynov"],
    }
]

export default function ProjectsPage() {
    const t = useTranslations("ProjectsPage");

    return (
        <div className='flex flex-col min-h-screen bg-no-repeat bg-fixed overflow-x-hidden' style={{ background: 'radial-gradient(circle, rgba(0, 192, 219, 0.3) 20%, rgba(0, 0, 0, 1) 80%)', backgroundSize: 'cover', backgroundPosition: 'top' }}>
            <div className='flex-grow mb-auto flex flex-col bg-fixed'>
                <div className='h-screen w-full bg-black/80 flex flex-col justify-center items-center'>
                    <h1 className='text-white text-4xl md:text-6xl lg:text-8xl font-bold flex-grow flex items-center justify-center'>{t('title')}</h1>
                    <ScrollButton />
                </div>
            </div>
            <div className='flex flex-col justify-center items-center bg-black h-fit p-8 space-y-8 text-white' id='content'>
                <p className="italic text-gray-500">{t('description')}</p>
                <h1 className='text-4xl font-bold'>{t('projects')}</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
                    {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} />
                    ))}
                </div>
            </div>
        </div>
    )
}

