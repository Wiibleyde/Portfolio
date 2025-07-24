import Markdown from 'markdown-to-jsx';
import '../markdown.css';

export default function TermsOfService() {
    return (
        <div className="flex flex-col items-center justify-center py-12 dark:bg-black bg-gray-100 dark:text-white min-h-screen">
            <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-3xl p-8 dark:bg-black bg-gray-100 rounded-lg shadow-lg border-2 markdownApplicable">
                    <Markdown className="prose prose-lg prose-invert">{frenchMd}</Markdown>
                </div>
            </div>
        </div>
    );
}

const frenchMd = `
# Conditions d'utilisation

Dernière mise à jour : 2025

Bienvenue sur Eve, un bot Discord développé par Wiibleyde. En utilisant ce bot, vous acceptez les conditions suivantes :

## 1. Acceptation des conditions
En accédant et en utilisant Eve, vous acceptez ces conditions d'utilisation. Si vous n'êtes pas d'accord, veuillez ne pas utiliser ce bot.

## 2. Utilisation du bot
- Eve est un bot Discord développé en TypeScript avec Discord.js et Prisma.
- Le bot est hébergé sur un serveur personnel situé chez le développeur.
- Vous êtes responsable de votre utilisation du bot et de votre conformité aux règles de Discord.

## 3. Collecte et utilisation des données
L'utilisation d'Eve implique la collecte et le traitement de certaines données, conformément à notre [Politique de confidentialité](/eve/pp).

## 4. Responsabilité
L'équipe de développement ne pourra être tenue responsable des dommages directs ou indirects liés à l'utilisation du bot.

## 5. Modifications
Ces conditions peuvent être mises à jour à tout moment. Il est de votre responsabilité de les consulter régulièrement.
`;
