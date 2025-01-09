import { routing } from "@/i18n/routing";

export const BASE_URL = 'https://nathan.bonnell.fr';

export default async function sitemap() {
    const locales = routing.locales;
    const paths = [
        '/',
        '/projects',
    ];
    const urls = locales.flatMap(locale => paths.map(path => `${BASE_URL}/${locale}${path}`));
    return urls.map(url => {
        const path = paths.find(path => url.endsWith(path)) as string;
        return {
            url,
            lastmod: new Date().toISOString(),
            priority: getPriority(path)
        };
    });
}

function getPriority(path: string): number {
    switch (path) {
        case '/':
            return 1;
        case '/projects':
            return 0.9;
        default:
            return 0.5;
    }
}