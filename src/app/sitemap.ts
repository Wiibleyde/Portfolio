import type { MetadataRoute } from 'next';

export const BASE_URL = 'https://nathan.bonnell.fr';

export default function sitemap(): MetadataRoute.Sitemap {
    const pages = [
        { url: '/', lastModified: new Date() },
        { url: '/files/CV%20Nathan%20Bonnell.pdf', lastModified: new Date() },
        { url: '/tools/pdfAssembler', lastModified: new Date() },
        { url: '/tools/qrcode', lastModified: new Date() },
        { url: '/tools/vcard', lastModified: new Date() },
        { url: '/legal-mentions', lastModified: new Date() },
    ];

    return pages.map((page) => {
        return {
            // sitemaps require absolute URLs
            url: `${BASE_URL}${page.url}`,
            lastModified: page.lastModified.toISOString(),
            priority: getPriority(page.url),
        };
    });
}

function getPriority(url: string): number {
    if (url === '/') return 1.0; // Home page has the highest priority
    if (url.startsWith('/files/')) return 0.5; // Files have medium priority
    if (url.startsWith('/tools/')) return 0.5;
    if (url === '/legal-mentions') return 0.3; // Legal mentions
    return 0.1; // Default priority for other pages
}
