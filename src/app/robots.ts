import { MetadataRoute } from "next";
import { BASE_URL } from "./sitemap";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/fr',
                    '/en',
                    '/fr/*',
                    '/en/*',
                ],
                disallow: [
                    '/api',
                    '/_next',
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    }
}