import Image from 'next/image';
import { ArrowUpRight, Github } from 'react-bootstrap-icons';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import type { Project } from '@/types';
import { RichDescription } from './RichDescription';

const MAX_TAGS = 3;

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    return (
        <SpotlightCard
            spotlightColor="#8fb3ff"
            intensity={0.12}
            borderGlow={0.5}
            className="group flex w-full min-w-0 flex-col overflow-hidden rounded-2xl! border border-zinc-800 p-0!"
            style={{ '--spotlight-card-surface': '#0e0e10' } as React.CSSProperties}
        >
            <div className="relative aspect-video overflow-hidden border-zinc-800 border-b bg-zinc-900">
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="eyebrow">{project.type}</p>
                        <h3 className="mt-1.5 line-clamp-1 font-medium text-lg text-zinc-50">{project.title}</h3>
                    </div>
                    <div className="flex shrink-0 gap-1">
                        {project.repoUrl && (
                            <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Code source de ${project.title}`}
                                className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                            >
                                <Github className="h-4 w-4" />
                            </a>
                        )}
                        {project.url && (
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Voir ${project.title} en ligne`}
                                className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                            >
                                <ArrowUpRight className="h-4 w-4" />
                            </a>
                        )}
                    </div>
                </div>

                <p className="mt-3 line-clamp-3 h-[3lh] text-sm text-zinc-400 leading-relaxed">
                    <RichDescription text={project.description} />
                </p>

                {/* single row so every card has the same height and only moves (no resize) when filtering */}
                <ul className="mt-5 flex gap-1.5 overflow-hidden">
                    {project.tags.slice(0, MAX_TAGS).map((tag) => (
                        <li key={tag} className="tag shrink-0 whitespace-nowrap">
                            {tag}
                        </li>
                    ))}
                    {project.tags.length > MAX_TAGS && (
                        <li className="tag shrink-0" title={project.tags.slice(MAX_TAGS).join(', ')}>
                            +{project.tags.length - MAX_TAGS}
                        </li>
                    )}
                </ul>
            </div>
        </SpotlightCard>
    );
}
