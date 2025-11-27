import figlet from "figlet";

/**
 * Convertit une chaîne de caractères en ASCII Art (style 'Slant')
 * @param text - Le texte à convertir
 * @returns Le texte formaté en ASCII Art
 */
export function generateBanner(text: string): string {
    // 'textSync' est la version synchrone, plus simple pour des scripts
    return figlet.textSync(text, {
        font: "Slant", // C'est la police qui correspond à ton exemple
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80, // Largeur max avant retour à la ligne
        whitespaceBreak: true,
    });
}
