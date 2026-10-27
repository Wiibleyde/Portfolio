import Markdown from 'markdown-to-jsx';
import type { Metadata } from 'next';
import type { ComponentProps } from 'react';
import { ToolPageLayout } from '@/components/tools/ToolPageLayout';

export const metadata: Metadata = {
    title: 'Mentions légales - Nathan Bonnell',
};

const ExternalAwareLink = ({ href, children, ...props }: ComponentProps<'a'>) => (
    <a
        {...props}
        href={href}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="text-zinc-200 underline decoration-zinc-600 underline-offset-2 transition-colors hover:decoration-zinc-300"
    >
        {children}
    </a>
);

export default function LegalMentions() {
    return (
        <ToolPageLayout title="Mentions légales" description="Dernière mise à jour : 27 octobre 2026.">
            <div className="max-w-3xl text-zinc-400 leading-relaxed">
                <Markdown
                    options={{
                        overrides: {
                            h2: {
                                props: {
                                    className:
                                        'mt-12 mb-4 border-zinc-800 border-t pt-8 font-medium text-xl text-zinc-50 first:mt-0 first:border-t-0 first:pt-0',
                                },
                            },
                            p: { props: { className: 'mb-4' } },
                            ul: { props: { className: 'mb-4 list-disc space-y-1.5 pl-5 marker:text-zinc-600' } },
                            strong: { props: { className: 'font-medium text-zinc-200' } },
                            a: { component: ExternalAwareLink },
                        },
                    }}
                >
                    {content}
                </Markdown>
            </div>
        </ToolPageLayout>
    );
}

// postal address deliberately not published (owner's choice, self-hosted at home)
const HOST_PHONE = '+33 6 47 80 59 44';
// GDPR: announced retention period for contact messages; old Discord messages must actually be deleted
const RETENTION = '3 ans';

const content = `
## Éditeur du site

- Nom : Nathan Bonnell (particulier)
- Email : <nathan@bonnell.fr>
- Site web : <https://nathan.bonnell.fr>
- Directeur de la publication : Nathan Bonnell

## Hébergement

Le site est auto-hébergé sur un serveur personnel de l'éditeur :

- Hébergeur : Nathan Bonnell
- Téléphone : ${HOST_PHONE}

Le nom de domaine est enregistré chez OVH SAS, 2 rue Kellermann, 59100 Roubaix, France.

## Technologies utilisées

Le site est développé avec Next.js, React, Tailwind CSS et GSAP, et servi avec Bun dans un conteneur Docker (Nginx, Proxmox, Rocky Linux). Certains composants visuels proviennent de [React Bits](https://reactbits.dev).

## Propriété intellectuelle

Les contenus de ce site (textes, images, code) sont la propriété de Nathan Bonnell, sauf mention contraire. Les visuels de projets tiers restent la propriété de leurs auteurs respectifs.

## Données personnelles

Le responsable du traitement est Nathan Bonnell, joignable à <nathan@bonnell.fr>.

**Formulaire de contact.** Les informations saisies (nom, email, objet, message) servent uniquement à répondre à votre demande, sur la base de l'intérêt légitime de l'éditeur à traiter les messages qu'il reçoit. Elles ne sont ni revendues ni utilisées à d'autres fins. Elles sont transmises à l'éditeur sous forme de message sur [Discord](https://discord.com/privacy) (Discord Inc., États-Unis) : ce transfert hors de l'Union européenne est encadré par les garanties décrites dans la politique de confidentialité de Discord. Les messages sont conservés au plus ${RETENTION} après le dernier échange, puis supprimés. Votre adresse IP est utilisée temporairement, en mémoire, pour limiter les envois abusifs, et n'est pas conservée.

**Mesure d'audience.** Le site utilise [Umami](https://umami.is), un outil de statistiques auto-hébergé par l'éditeur : il ne dépose aucun cookie, ne suit pas les visiteurs d'un site à l'autre et ne produit que des statistiques agrégées et anonymes.

**Outils en ligne.** Les fichiers et informations utilisés dans le générateur de QR code, le générateur de vCard et l'assembleur PDF sont traités entièrement dans votre navigateur : ils ne sont jamais envoyés au serveur.

Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données, à exercer en écrivant à <nathan@bonnell.fr>. Vous pouvez aussi introduire une réclamation auprès de la [CNIL](https://www.cnil.fr/fr/plaintes).

## Cookies

Ce site ne dépose aucun cookie et n'utilise aucun service de suivi tiers.

## Responsabilité

L'éditeur s'efforce d'assurer l'exactitude des informations publiées, mais ne saurait être tenu responsable des erreurs ou omissions, ni de l'usage qui en est fait.

## Droit applicable

Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français sont seuls compétents.
`;
