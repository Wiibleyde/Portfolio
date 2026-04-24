'use client';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import type { ReactNode } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export function ClientLayout({ children }: Readonly<{ children: ReactNode }>) {
    const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_KEY ?? '';

    return (
        <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
            <GoogleTagManager gtmId="GTM-K7P344NG" />
            <GoogleAnalytics gaId="G-YTXQPVERXL" />
            {children}
        </GoogleReCaptchaProvider>
    );
}
