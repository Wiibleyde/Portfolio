'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Markdown from 'markdown-to-jsx';
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
                            '-=0.4'
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
                                }
                            );
                        }
                    }
                });
            },
            { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
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
            '.markdownApplicable h2, .markdownApplicable p, .markdownApplicable ul'
        );
        gsap.set(sections, { opacity: 0, y: 20 });
    }, []);

    return (
        <div
            ref={containerRef}
            className="min-h-screen relative bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/30 py-12"
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), 
                                     radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`,
                    }}
                ></div>
            </div>

            <div className="relative z-10 px-6 max-w-4xl mx-auto">
                {/* Title Section */}
                <div ref={titleRef} className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Mentions Légales</h1>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-3"></div>
                    <p className="text-gray-300 text-lg">Informations légales et conditions d&apos;utilisation</p>
                </div>

                {/* Content Section */}
                <div
                    ref={contentRef}
                    className="bg-gradient-to-br from-white/10 via-white/8 to-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl"
                >
                    <div className="markdownApplicable">
                        <Markdown
                            options={{
                                overrides: {
                                    h2: {
                                        component: ({ children, ...props }) => (
                                            <h2
                                                {...props}
                                                className="group flex items-center gap-3 text-2xl font-bold text-white mb-4 mt-8 first:mt-0 border-b border-white/20 pb-2 hover:border-blue-400/50 transition-colors duration-300"
                                            >
                                                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                                                {children}
                                            </h2>
                                        ),
                                    },
                                    h3: {
                                        component: ({ children, ...props }) => (
                                            <h3 {...props} className="text-xl font-semibold text-blue-300 mb-3 mt-6">
                                                {children}
                                            </h3>
                                        ),
                                    },
                                    p: {
                                        component: ({ children, ...props }) => (
                                            <p
                                                {...props}
                                                className="text-gray-200 leading-relaxed mb-4 hover:text-gray-100 transition-colors duration-200"
                                            >
                                                {children}
                                            </p>
                                        ),
                                    },
                                    ul: {
                                        component: ({ children, ...props }) => (
                                            <ul
                                                {...props}
                                                className="list-disc list-inside text-gray-200 mb-4 space-y-1"
                                            >
                                                {children}
                                            </ul>
                                        ),
                                    },
                                    li: {
                                        component: ({ children, ...props }) => (
                                            <li
                                                {...props}
                                                className="text-gray-200 leading-relaxed hover:text-gray-100 duration-200 hover:translate-x-1 transition-all"
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
                                                className="group relative text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
                                                target={href?.startsWith('http') ? '_blank' : undefined}
                                                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                aria-label={
                                                    href?.startsWith('http')
                                                        ? `Lien externe vers ${children}`
                                                        : undefined
                                                }
                                            >
                                                {children}
                                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                                                {href?.startsWith('http') && (
                                                    <svg
                                                        className="inline w-3 h-3 ml-1 opacity-60 group-hover:opacity-100 transition-opacity"
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
                                            <strong {...props} className="text-white font-semibold">
                                                {children}
                                            </strong>
                                        ),
                                    },
                                    em: {
                                        component: ({ children, ...props }) => (
                                            <em {...props} className="text-blue-300 font-medium">
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
                    <div className="mt-8 pt-6 border-t border-white/20">
                        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 shadow-lg">
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <svg
                                    className="w-5 h-5 text-blue-400"
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
                                    className="group relative text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
                                >
                                    nathan@bonnell.fr
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Back to home button */}
                <div className="text-center mt-8">
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-blue-500/25 transform hover:scale-105"
                    >
                        <svg
                            className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200"
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
