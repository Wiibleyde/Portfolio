import Me from '@public/img/pp.webp';
import Bro from '@public/img/projects/bro.png';
import EveBanner from '@public/img/projects/eve-banner.png';
import F1 from '@public/img/projects/f1.png';
import FurutsuGame from '@public/img/projects/furutsugame.png';
import HopeLogo from '@public/img/projects/hope.png';
import LexPortLogo from '@public/img/projects/lexport.png';
import LightManager from '@public/img/projects/light-manager.png';
import LiveIntelligence from '@public/img/projects/live-intelligence.jpg';
import MindCity from '@public/img/projects/mindcity.jpg';
import Motus from '@public/img/projects/motus.jpg';
import RPlaceLogo from '@public/img/projects/rplace-logo.png';
import SABSLogo from '@public/img/projects/sabs-logo.png';
import Twitch from '@public/img/projects/twitch.webp';
import WeazelNewsLogo from '@public/img/projects/WeazelNews_Logo.png';
import WikiGuessrBanner from '@public/img/projects/wikiguessr-banner.png';
import { type Project, ProjectType } from '@/types';

export const projects: Project[] = [
    {
        title: 'Live Intelligence',
        description:
            "Console d'administration et Studio d'agents IA de la plateforme d'IA générative d'[Orange Business](https://www.orange-business.com/fr/solutions/data-ia-iot/live-intelligence).",
        type: ProjectType.Professional,
        url: 'https://www.orange-business.com/fr/solutions/data-ia-iot/live-intelligence',
        image: LiveIntelligence.src,
        tags: [
            '.NET 10',
            'React',
            'TanStack',
            'Kubernetes',
            'ArgoCD',
            'Docker',
            'OpenCode',
            'LLM self-hostés',
            'Vertex AI',
        ],
    },
    {
        title: 'MindCity RP',
        cv: true,
        description:
            'Serveur GTA RP communautaire : scripts Lua, interfaces en jeu en Vue et [site web](https://mindcity-rp.fr) en Symfony.',
        type: ProjectType.Personal,
        url: 'https://mindcity-rp.fr',
        image: MindCity.src,
        tags: ['FiveM', 'Lua', 'Vue.js', 'PHP', 'Symfony', 'MindCityRP'],
    },
    {
        title: 'WikiGuessr',
        cv: true,
        description:
            'WikiGuessr est un jeu inspiré de [Pédantix](https://pedantix.certitudes.org/) où les joueurs doivent deviner la page.',
        type: ProjectType.School,
        url: 'https://wikiguessr.bonnell.fr/',
        repoUrl: 'https://github.com/Wiibleyde/BetterWikiGuessr',
        tags: ['WikiGuessr', 'Pédantix', 'Next.js', 'TailwindCSS', 'Typescript', 'Docker', 'Github Actions'],
        image: WikiGuessrBanner.src,
    },
    {
        title: 'Régie lumière FiveM',
        description:
            'Régie lumière pour des concerts. Aide : [JusteKal](https://mapping.justekal.be), [Waytostars](https://github.com/waytostars) et [FailyV](https://x.com/FailyV_GTARP)).',
        type: ProjectType.Personal,
        image: LightManager.src,
        tags: ['FiveM', 'TypeScript', 'GTARP', 'Régie', 'Lumière', 'Concert', 'FailyV'],
    },
    {
        title: 'Site SABS',
        description: 'Site vitrine du projet SABS. Découvrez [le site en ligne](https://sabs.vercel.app).',
        type: ProjectType.Personal,
        url: 'https://sabs.vercel.app',
        repoUrl: 'https://github.com/Wiibleyde/sabs',
        image: SABSLogo.src,
        tags: ['Next.js', 'TailwindCSS', 'Typescript', 'MindCityRP'],
    },
    {
        title: 'F1 App',
        cv: true,
        description:
            "F1 App est une application web pour suivre les courses de Formule 1 en utilisant l'[API Open-F1](https://openf1.org/).",
        type: ProjectType.School,
        repoUrl: 'https://github.com/Wiibleyde/f1-app',
        image: F1.src,
        tags: ['F1', 'Open-F1 API', 'React-Native', 'Typescript', 'Expo'],
    },
    {
        title: 'Portfolio',
        cv: true,
        description: 'Portfolio de Nathan Bonnell, développeur web fullstack.',
        type: ProjectType.Personal,
        url: 'https://nathan.bonnell.fr',
        repoUrl: 'https://github.com/Wiibleyde/portfolio',
        image: Me.src,
        tags: ['Portfolio', 'React', 'Next.js', 'TailwindCSS', 'Typescript'],
    },
    {
        title: 'Hope - GTARP (Fermé)',
        cv: true,
        description:
            'Hope - GTARP est (était 😢) un serveur de jeu sur la plateforme [FiveM](https://fivem.net/). Voir la [vidéo de présentation](https://youtu.be/Q8jP5BC0cXM).',
        type: ProjectType.Personal,
        url: 'https://youtu.be/Q8jP5BC0cXM',
        image: HopeLogo.src,
        tags: [
            'GTAV',
            'Hope',
            'FiveM',
            'Typescript',
            'Lua',
            'C#',
            'Go',
            'MariaDB',
            'InfluxDB',
            'C++',
            'Grafana',
            'Discord.js',
        ],
    },
    {
        title: "Site du cabinet d'avocats Lex-Port",
        description: "Site vitrine du cabinet d'avocats Lex-Port.",
        type: ProjectType.Professional,
        url: 'https://lex-port.com',
        image: LexPortLogo.src,
        tags: ['Lex-Port', 'Alternance', 'Next.js', 'Typescript', 'TailwindCSS', 'Prisma', 'i18n', 'SEO'],
    },
    {
        title: 'RPlace Analyser',
        description: "RPlace Analyzer est un résultat d'analyse de l'événement RPlace 2017.",
        type: ProjectType.School,
        repoUrl: 'https://github.com/Wiibleyde/RPlaceAnalyzer',
        image: RPlaceLogo.src,
        tags: ['RPlace', 'MongoDB', 'Python', 'Reddit', 'Data Analysis'],
    },
    {
        title: 'Site du cartel de camion Lex-Port',
        description: "Site web pour l'action collective du cabinet d'avocats Lex-Port.",
        type: ProjectType.Professional,
        url: 'https://cartel.lex-port.com',
        image: LexPortLogo.src,
        tags: ['Lex-Port', 'Alternance', 'Next.js', 'Typescript', 'TailwindCSS', 'Prisma', 'i18n'],
    },
    {
        title: 'Eve',
        cv: true,
        description:
            "Eve est un bot [Discord](https://discord.com/) pour les serveurs Discord fait en Typescript. Consultez les [conditions d'utilisation](/eve/tos).",
        type: ProjectType.Personal,
        repoUrl: 'https://github.com/Wiibleyde/Eve',
        image: EveBanner.src,
        tags: ['Discord.js', 'Bot', 'Typescript', 'Node.js', 'Prisma'],
    },
    {
        title: 'Script Caméra pour FiveM (GTA)',
        description: 'Fivem Cam Script est une ressource FiveM (GTA).',
        type: ProjectType.Personal,
        repoUrl: 'https://github.com/Wiibleyde/Fivem-Cam-Script',
        image: WeazelNewsLogo.src,
        tags: ['FiveM', 'GTARP', 'Lua'],
    },
    {
        title: 'TwitchStreamRetrievers',
        description: 'TwitchStreamRetrievers est une API et un WS pour notifier de streams Twitch.',
        type: ProjectType.Personal,
        repoUrl: 'https://github.com/Wiibleyde/TwitchStreamRetrievers',
        image: Twitch.src,
        tags: ['Twitch', 'API', 'Websocket', 'Typescript', 'Node.js'],
    },
    {
        title: 'Mootus',
        description: 'Mootus est une reproduction du jeu Motus en ligne.',
        type: ProjectType.School,
        url: 'https://wiibleyde.github.io/Mootus/',
        repoUrl: 'https://github.com/Wiibleyde/Mootus',
        image: Motus.src,
        tags: ['Motus', 'Vite', 'React', 'Typescript', 'Atom', 'TailwindCSS'],
    },
    {
        title: 'Régie Black Room Orchestra',
        description: 'Régie vidéo du concert de Black Room Orchestra sur le serveur FailyV.',
        type: ProjectType.Personal,
        url: 'https://youtu.be/otioMSFKVi0',
        image: Bro.src,
        tags: ['VMix', 'FailyV', 'Concert', 'Régie', 'Vidéo', 'Live', 'FiveM'],
    },
    {
        title: 'Furutsu Game',
        description: 'Furutsu Game est une copie du jeu Suika Game fait avec Unity.',
        type: ProjectType.School,
        repoUrl: 'https://github.com/Wiibleyde/FurutsuGame',
        image: FurutsuGame.src,
        tags: ['Unity', 'C#', 'Game', 'Suika Game', 'Ynov'],
    },
];
