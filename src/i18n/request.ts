import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export type Languges = "fr" | "en";

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !routing.locales.includes(locale as Languges)) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        messages: (await import(`../../${locale}.json`)).default
    };
});