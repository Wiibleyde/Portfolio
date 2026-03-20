'use client';
import { gsap } from 'gsap';
import Markdown from 'markdown-to-jsx';
import { useEffect, useRef, useState } from 'react';
import './markdown.css';
import Link from 'next/link';

export default function LegalMentions() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Animation on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true);

                        const tl = gsap.timeline({ delay: 0.2 });

                        tl.to(titleRef.current, {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: 'power2.out',
                        }).to(
                            contentRef.current,
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.8,
                                ease: 'power2.out',
                            },
                            '-=0.4',
                        );

                        // Animation des sections du contenu
                        const sections = contentRef.current?.querySelectorAll('h2, p, ul');
                        if (sections) {
                            gsap.fromTo(
                                sections,
                                { opacity: 0, y: 20 },
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.6,
                                    stagger: 0.1,
                                    delay: 1,
                                    ease: 'power2.out',
                                },
                            );
                        }
                    }
                });
            },
            { threshold: 0.2, rootMargin: '0px 0px -50px 0px' },
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [isVisible]);

    // Set initial state
    useEffect(() => {
        gsap.set([titleRef.current, contentRef.current], {
            opacity: 0,
            y: 50,
        });

        // Set initial state for content sections
        const sections = document.querySelectorAll(
            '.markdownApplicable h2, .markdownApplicable p, .markdownApplicable ul',
        );
        gsap.set(sections, { opacity: 0, y: 20 });
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen bg-linear-to-br from-slate-900 via-blue-900/20 to-purple-900/30 py-12"
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%),
                                     radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`,
                    }}
                />
            </div>

            <div className="relative z-10 mx-auto max-w-4xl px-6">
                {/* Title Section */}
                <div ref={titleRef} className="mb-8 text-center">
                    <h1 className="mb-3 font-bold text-3xl text-white md:text-4xl">Mentions Légales</h1>
                    <div className="mx-auto mb-3 h-1 w-20 rounded-full bg-linear-to-r from-blue-500 to-purple-600" />
                    <p className="text-gray-300 text-lg">Informations légales et conditions d&apos;utilisation</p>
                </div>

                {/* Content Section */}
                <div
                    ref={contentRef}
                    className="rounded-3xl border border-white/20 bg-linear-to-br from-white/10 via-white/8 to-white/5 p-6 shadow-2xl backdrop-blur-md md:p-8"
                >
                    <div className="markdownApplicable">
                        <Markdown
                            options={{
                                overrides: {
                                    h2: {
                                        component: ({ children, ...props }) => (
                                            <h2
                                                {...props}
                                                className="group mt-8 mb-4 flex items-center gap-3 border-white/20 border-b pb-2 font-bold text-2xl text-white transition-colors duration-300 first:mt-0 hover:border-blue-400/50"
                                            >
                                                <div className="h-2 w-2 rounded-full bg-linear-to-r from-blue-500 to-purple-600 transition-transform duration-300 group-hover:scale-125" />
                                                {children}
                                            </h2>
                                        ),
                                    },
                                    h3: {
                                        component: ({ children, ...props }) => (
                                            <h3 {...props} className="mt-6 mb-3 font-semibold text-blue-300 text-xl">
                                                {children}
                                            </h3>
                                        ),
                                    },
                                    p: {
                                        component: ({ children, ...props }) => (
                                            <p
                                                {...props}
                                                className="mb-4 text-gray-200 leading-relaxed transition-colors duration-200 hover:text-gray-100"
                                            >
                                                {children}
                                            </p>
                                        ),
                                    },
                                    ul: {
                                        component: ({ children, ...props }) => (
                                            <ul
                                                {...props}
                                                className="mb-4 list-inside list-disc space-y-1 text-gray-200"
                                            >
                                                {children}
                                            </ul>
                                        ),
                                    },
                                    li: {
                                        component: ({ children, ...props }) => (
                                            <li
                                                {...props}
                                                className="text-gray-200 leading-relaxed transition-all duration-200 hover:translate-x-1 hover:text-gray-100"
                                            >
                                                {children}
                                            </li>
                                        ),
                                    },
                                    a: {
                                        component: ({ children, href, ...props }) => (
                                            <a
                                                {...props}
                                                href={href}
                                                className="group relative font-medium text-blue-400 transition-colors duration-200 hover:text-blue-300"
                                                target={href?.startsWith('http') ? '_blank' : undefined}
                                                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                aria-label={
                                                    href?.startsWith('http')
                                                        ? `Lien externe vers ${children}`
                                                        : undefined
                                                }
                                            >
                                                {children}
                                                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full" />
                                                {href?.startsWith('http') && (
                                                    <svg
                                                        aria-hidden="true"
                                                        className="ml-1 inline h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                        />
                                                    </svg>
                                                )}
                                            </a>
                                        ),
                                    },
                                    strong: {
                                        component: ({ children, ...props }) => (
                                            <strong {...props} className="font-semibold text-white">
                                                {children}
                                            </strong>
                                        ),
                                    },
                                    em: {
                                        component: ({ children, ...props }) => (
                                            <em {...props} className="font-medium text-blue-300">
                                                {children}
                                            </em>
                                        ),
                                    },
                                },
                            }}
                        >
                            {frenchMd}
                        </Markdown>
                    </div>

                    {/* Contact Section */}
                    <div className="mt-8 border-white/20 border-t pt-6">
                        <div className="rounded-2xl border border-blue-500/20 bg-linear-to-r from-blue-500/10 to-purple-500/10 p-6 shadow-lg backdrop-blur-sm">
                            <h3 className="mb-3 flex items-center gap-2 font-semibold text-lg text-white">
                                <svg
                                    aria-hidden="true"
                                    className="h-5 w-5 text-blue-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                Contact
                            </h3>
                            <p className="text-gray-200 leading-relaxed">
                                Pour toute question concernant ces mentions légales ou ce site web, vous pouvez me
                                contacter à l&apos;adresse{' '}
                                <a
                                    href="mailto:nathan@bonnell.fr"
                                    aria-label="Envoyer un email à Nathan Bonnell"
                                    className="group relative font-medium text-blue-400 transition-colors duration-200 hover:text-blue-300"
                                >
                                    nathan@bonnell.fr
                                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full" />
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Back to home button */}
                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="group inline-flex transform items-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-500/25"
                    >
                        <svg
                            aria-hidden="true"
                            className="group-hover:-translate-x-1 h-5 w-5 transition-transform duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Retour à l&apos;accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}

const frenchMd = `
## Éditeur du site

- Nom : Bonnell
- Prénom : Nathan
- Email : <nathan@bonnell.fr>
- Site web : <https://nathan.bonnell.fr>
- Date de publication : 2025

## Hébergement

Le site est hébergé sur un serveur personnel situé chez l'éditeur du site.

Nom de domaine enregistré chez OVH.

## Technologies utilisées

Ce site est développé avec Next.js, Tailwind CSS et Prisma.

Hébergé avec Docker, Nginx, Proxmox et Rocky Linux.

## Propriété intellectuelle

L'ensemble des contenus présents sur ce site (textes, images, vidéos, etc.) sont la propriété exclusive de Nathan Bonnell, sauf mention contraire.

Une vidéo issue du site Bugatti est utilisée sur ce site. Les droits de cette vidéo appartiennent à leur propriétaire respectif. Si vous êtes détenteur des droits et souhaitez sa suppression, veuillez contacter l'éditeur du site.

## Responsabilité

L'éditeur du site met tout en œuvre pour assurer l'exactitude des informations publiées, mais ne saurait être tenu responsable des erreurs ou omissions. L'utilisation des informations disponibles sur ce site se fait sous la responsabilité exclusive de l'utilisateur.

## Données personnelles

Ce site ne collecte aucune donnée personnelle à des fins commerciales. Pour toute question ou demande relative aux données personnelles, vous pouvez contacter l'éditeur à l'adresse mentionnée ci-dessus.

## Cookies

Ce site peut utiliser des cookies à des fins techniques et analytiques. Vous pouvez configurer votre navigateur pour les refuser.

## Droit applicable

LES PRÉSENTES MENTIONS LÉGALES SONT SOUMISES AU DROIT FRANÇAIS. EN CAS DE LITIGE, LES TRIBUNAUX FRANÇAIS SERONT SEULS COMPÉTENTS.
`;
