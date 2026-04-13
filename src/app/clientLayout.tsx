'use client';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';
import type { ReactNode } from 'react';

export function ClientLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <>
            <GoogleTagManager gtmId="GTM-K7P344NG" />
            <GoogleAnalytics gaId="G-YTXQPVERXL" />
            <Script
                src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_KEY}`}
                strategy="lazyOnload"
            />
            {children}
        </>
    );
}
