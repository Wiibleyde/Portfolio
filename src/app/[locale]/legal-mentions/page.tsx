import { useLocale } from "next-intl";
import Markdown from 'markdown-to-jsx';
import './markdown.css';

export default function LegalMentions() {
    const locale = useLocale();

    return (
        <div className='flex flex-col items-center justify-center py-12 dark:bg-black bg-gray-100 dark:text-white min-h-screen'>
            {
                locale === "fr" ? (
                    <div className='flex flex-col items-center justify-center'>
                        <div className='w-full max-w-3xl p-8 dark:bg-black bg-gray-100 rounded-lg shadow-lg border-2 markdownApplicable'>
                            <Markdown className='prose prose-lg prose-invert'>{frenchMd}</Markdown>
                        </div>
                    </div>
                ) : locale === "en" ? (
                    <div className='flex flex-col items-center justify-center'>
                        <div className='w-full max-w-3xl p-8 dark:bg-black bg-gray-100 rounded-lg shadow-lg border-2 markdownApplicable'>
                            <Markdown className='prose prose-lg prose-invert'>{englishMd}</Markdown>
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}

const frenchMd = `
# Mentions Légales

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

Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
`

const englishMd = `
# Legal Notice

## Website Publisher

- Last Name: Bonnell
- First Name: Nathan
- Email: <nathan@bonnell.fr>
- Website: <https://nathan.bonnell.fr>
- Publication Date: 2025

## Hosting

The website is hosted on a personal server located at the publisher's residence.

Domain name registered with OVH.

## Technologies Used

This site is developed using Next.js, Tailwind CSS, and Prisma.

Hosted using Docker, Nginx, Proxmox, and Rocky Linux.

## Intellectual Property

All content on this website (texts, images, videos, etc.) is the exclusive property of Nathan Bonnell unless otherwise stated.

A video from the Bugatti website is used on this site. The rights to this video belong to its respective owner. If you own the rights and wish for its removal, please contact the site publisher.

## Liability

The site publisher makes every effort to ensure the accuracy of the published information but cannot be held responsible for any errors or omissions. The use of the information available on this site is at the sole responsibility of the user.

## Personal Data

This site does not collect any personal data for commercial purposes. For any questions or requests regarding personal data, you may contact the publisher at the email address mentioned above.

## Cookies

This site may use cookies for technical and analytical purposes. You can configure your browser to refuse them.

## Applicable Law

This legal notice is governed by French law. In case of a dispute, French courts shall have exclusive jurisdiction.
`
