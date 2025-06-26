import { MetadataRoute } from "next";

export const BASE_URL = 'https://nathan.bonnell.fr';

export default function sitemap(): MetadataRoute.Sitemap {
    const pages = [
        { url: '/', lastModified: new Date() },
        { url: '/files/CV Nathan Bonnel.pdf', lastModified: new Date() },
        { url: '/legal-mentions', lastModified: new Date() },
    ];

    return pages.map(page => {
        return {
            url: page.url,
            lastModified: page.lastModified.toISOString(),
            priority: getPriority(page.url),
        };
    });
}

function getPriority(url: string): number {
    if (url === '/') return 1.0; // Home page has the highest priority
    if (url.startsWith('/files/')) return 0.5; // Files have medium priority
    if (url === '/legal-mentions') return 0.3; // Legal mentions
    return 0.1; // Default priority for other pages
}