"use client"
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

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

function getDominantColor(imageSrc: string, callback: (color: string) => void) {
    const img = document.createElement('img');
    img.src = imageSrc;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, img.width, img.height);
            const data = context.getImageData(0, 0, img.width, img.height).data;
            const color = { r: 0, g: 0, b: 0, count: 0 };
            for (let i = 0; i < data.length; i += 4) {
                color.r += data[i];
                color.g += data[i + 1];
                color.b += data[i + 2];
                color.count++;
            }
            color.r = Math.floor(color.r / color.count);
            color.g = Math.floor(color.g / color.count);
            color.b = Math.floor(color.b / color.count);

            // Adjust color if too dark
            const brightness = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
            if (brightness < 128) {
                color.r = Math.min(color.r + 70, 255);
                color.g = Math.min(color.g + 70, 255);
                color.b = Math.min(color.b + 70, 255);
            }

            callback(`rgb(${color.r}, ${color.g}, ${color.b})`);
        }
    };
}

export function ProjectCard({ project }: { project: Project }) {
    const t = useTranslations("ProjectsPage");
    const [dominantColor, setDominantColor] = useState<string>("dark");

    useEffect(() => {
        getDominantColor(project.image, setDominantColor);
    }, [project.image]);

    return (
        <div className='flex flex-col w-full md:w-80 lg:w-96 h-auto m-3 bg-black border border-gray-700 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105'>
            <Image src={project.image} alt={project.title} className='w-full h-48 object-cover rounded-t-lg bg-gray-300' width={300} height={150} />
            <div className='p-4'>
                <h2 className='font-bold text-2xl mb-2' style={{ color: dominantColor }}>{project.title}</h2>
                <p className='text-gray-300 mb-4'>{project.description}</p>
                <p className='text-sm text-gray-400 mb-4'>{project.type && t(`projectType.${project.type.toLowerCase()}`)}</p>
                <div className='flex flex-row space-x-2'>
                    {project.url && (
                        <Link href={project.url} className='inline-block px-6 py-2 text-sm font-medium leading-6 text-center text-white bg-black uppercase transition rounded-lg shadow ripple hover:shadow-lg focus:outline-none' style={{ backgroundColor: dominantColor }}>
                            {t('link')}
                        </Link>
                    )}
                    {project.repoUrl && (
                        <Link href={project.repoUrl} className='inline-block px-6 py-2 text-sm font-medium leading-6 text-center text-white uppercase transition bg-gray-700 rounded-lg shadow ripple hover:shadow-lg focus:outline-none'>
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