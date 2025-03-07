import Bootstrap from '@public/img/stack/bootstrap.svg'
import Cpp from '@public/img/stack/cpp.svg'
import Csharp from '@public/img/stack/csharp.svg'
import Css from '@public/img/stack/css.svg'
import DavinciResolve from '@public/img/stack/davinciResolve.svg'
import Docker from '@public/img/stack/docker.svg'
import Express from '@public/img/stack/express.svg'
import FastAPI from '@public/img/stack/fastapi.svg'
import Figma from '@public/img/stack/figma.svg'
import Git from '@public/img/stack/git.svg'
import Go from '@public/img/stack/go.svg'
import Grafana from '@public/img/stack/grafana.svg'
import Html from '@public/img/stack/html.svg'
import JavaScipt from '@public/img/stack/javascript.svg'
import Linux from '@public/img/stack/linux.svg'
import MongoDb from '@public/img/stack/mongodb.svg'
import Mysql from '@public/img/stack/mysql.svg'
import NextJs from '@public/img/stack/nextjs.svg'
import Nginx from '@public/img/stack/nginx.svg'
import NodeJS from '@public/img/stack/nodejs.svg'
import Obs from '@public/img/stack/obs.svg'
import Office from '@public/img/stack/office.svg'
import Prisma from '@public/img/stack/prisma.svg'
import Python from '@public/img/stack/python.svg'
import React from '@public/img/stack/react.svg'
import Tailwindcss from '@public/img/stack/tailwindcss.svg'
import TypeScript from '@public/img/stack/typescript.svg'
import Unity from '@public/img/stack/unity.svg'
import Vmix from '@public/img/stack/vmix.svg'
import VsCode from '@public/img/stack/vscode.svg'

import { useTranslations } from 'next-intl'
import { SkillCard, SkillProps } from './SkillCard'

interface HardSkillsProps {
    title: string;
    stacks: SkillProps[];
}

export function HardSkills() {
    const t = useTranslations('HardSkills')

    const hardSkills: HardSkillsProps[] = [
        {
            title: t('languages'),
            stacks: [
                { title: 'TypeScript', image: TypeScript, url: "https://www.typescriptlang.org/" },
                { title: 'Python', image: Python, url: "https://www.python.org/" },
                { title: 'Go', image: Go, url: "https://go.dev/" },
                { title: 'JavaScript', image: JavaScipt },
                { title: 'C#', image: Csharp },
                { title: 'C++', image: Cpp, url: "https://isocpp.org/" },
            ]
        },
        {
            title: t('frontend'),
            stacks: [
                { title: 'React', image: React, url: "https://reactjs.org/" },
                { title: 'Next.js', image: NextJs, url: "https://nextjs.org/" },
                { title: 'Bootstrap', image: Bootstrap, url: "https://getbootstrap.com/" },
                { title: 'Tailwind CSS', image: Tailwindcss, url: "https://tailwindcss.com/" },
                { title: 'HTML', image: Html },
                { title: 'CSS', image: Css },
            ]
        },
        {
            title: t('backend'),
            stacks: [
                { title: 'Node.js', image: NodeJS },
                { title: 'FastAPI', image: FastAPI, url: "https://fastapi.tiangolo.com/" },
                { title: 'Express', image: Express, url: "https://expressjs.com/" },
                { title: 'Prisma', image: Prisma, url: "https://www.prisma.io/" },
                { title: 'MongoDB', image: MongoDb, url: "https://www.mongodb.com/" },
                { title: 'MySQL', image: Mysql, url: "https://www.mysql.com/" },
            ]
        },
        {
            title: t('tools'),
            stacks: [
                { title: 'Git', image: Git },
                { title: 'Docker', image: Docker, url: "https://www.docker.com/" },
                { title: 'Nginx', image: Nginx },
                { title: 'Grafana', image: Grafana },
                { title: 'VS Code', image: VsCode, url: "https://code.visualstudio.com/" },
                { title: 'Figma', image: Figma },
                { title: 'Obs', image: Obs, url: "https://obsproject.com/" },
                { title: 'Davinci Resolve', image: DavinciResolve, url: "https://www.blackmagicdesign.com/products/davinciresolve/" },
                { title: 'Unity', image: Unity, url: "https://unity.com/" },
                { title: 'Vmix', image: Vmix, url: "https://www.vmix.com/" },
                { title: 'Office', image: Office },
                { title: 'Linux', image: Linux },
            ]
        }
    ]

    return (
        <div className='flex flex-col space-y-9'>
            {hardSkills.map(({ title, stacks }) => (
                <div key={title} className='flex flex-col space-y-3'>
                    <h2 className='dark:text-gray-100 text-3xl font-semibold text-center'>{title}</h2>
                    <div className='flex flex-wrap space-x-9 justify-center'>
                        {stacks.map(({ title, image, url }, index) => (
                            <SkillCard key={index} title={title} image={image} url={url} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
