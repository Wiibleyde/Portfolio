import Markdown from 'markdown-to-jsx';
import '../markdown.css';

export default function PrivacyPolicy() {
    return (
        <div className='flex flex-col items-center justify-center py-12 dark:bg-black bg-gray-100 dark:text-white min-h-screen'>
            <div className='flex flex-col items-center justify-center'>
                <div className='w-full max-w-3xl p-8 dark:bg-black bg-gray-100 rounded-lg shadow-lg border-2 markdownApplicable'>
                    <Markdown className='prose prose-lg prose-invert'>{frenchMd}</Markdown>
                </div>
            </div>
        </div>
    )
}

const frenchMd = `
# Politique de Confidentialité

Dernière mise à jour : 2025

La présente politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations lors de l'utilisation du bot Eve.

## 1. Informations collectées
- Identifiants Discord (ID utilisateur, ID serveur, ID canal)
- Messages traités par le bot pour exécuter ses fonctions
- Préférences et configurations du bot pour chaque serveur

## 2. Utilisation des données
Les données collectées sont utilisées uniquement pour le bon fonctionnement du bot et ne sont partagées avec aucun tiers.

## 3. Stockage et sécurité
- Les données sont stockées sur un serveur personnel situé chez le développeur.
- Des mesures de sécurité sont mises en place pour protéger les informations contre tout accès non autorisé.

## 4. Droits des utilisateurs
- Vous pouvez demander la suppression de vos données en contactant **nathan@bonnell.fr**.
- Conformément au RGPD, vous avez le droit d'accéder, de rectifier et de supprimer vos données personnelles.

## 5. Contact
Si vous avez des questions concernant ces politiques, veuillez nous contacter à **nathan@bonnell.fr**.
`