'use client';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import type { ReactNode } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export function ClientLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <>
            <GoogleTagManager gtmId="GTM-K7P344NG" />
            <GoogleAnalytics gaId="G-YTXQPVERXL" />
            <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY!}>
                {children}
            </GoogleReCaptchaProvider>
        </>
    );
}
