import { BASE_URL } from "./sitemap";

export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    }
}