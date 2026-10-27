import Link from 'next/link';
import { Envelope, Github, Linkedin } from 'react-bootstrap-icons';

const SOCIALS = [
    { href: 'https://github.com/Wiibleyde', label: 'GitHub', icon: Github },
    { href: 'https://www.linkedin.com/in/nathan-bonnell-57736926a', label: 'LinkedIn', icon: Linkedin },
    { href: 'mailto:nathan@bonnell.fr', label: 'Email', icon: Envelope },
];

const TOOLS = [
    { href: '/tools/pdfAssembler', label: 'Fusion de PDF' },
    { href: '/tools/qrcode', label: 'Générateur de QR code' },
    { href: '/tools/vcard', label: 'Carte de visite (vCard)' },
];

export function Footer() {
    return (
        <footer id="footer" className="border-zinc-900 border-t">
            <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3 md:px-10">
                <div>
                    <p className="font-semibold text-zinc-50 tracking-tight">Nathan Bonnell</p>
                    <p className="mt-2 text-sm text-zinc-500">
                        « La meilleure façon de prédire l&apos;avenir est de l&apos;inventer. » — Alan Kay
                    </p>
                    <div className="mt-5 flex gap-1">
                        {SOCIALS.map(({ href, label, icon: SocialIcon }) => (
                            <Link
                                key={label}
                                href={href}
                                target={href.startsWith('http') ? '_blank' : undefined}
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
                            >
                                <SocialIcon className="h-5 w-5" />
                            </Link>
                        ))}
                    </div>
                </div>

                <nav aria-label="Outils">
                    <p className="eyebrow">Outils</p>
                    <ul className="mt-4 space-y-2 text-sm">
                        {TOOLS.map(({ href, label }) => (
                            <li key={href}>
                                <Link href={href} className="text-zinc-400 transition-colors hover:text-zinc-100">
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div>
                    <p className="eyebrow">Informations</p>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li>
                            <Link
                                href="/legal-mentions"
                                className="text-zinc-400 transition-colors hover:text-zinc-100"
                            >
                                Mentions légales
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-zinc-900 border-t">
                <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-zinc-600 md:flex-row md:justify-between md:px-10">
                    <p>© {new Date().getFullYear()} Nathan Bonnell — Bordeaux</p>
                </div>
            </div>
        </footer>
    );
}
