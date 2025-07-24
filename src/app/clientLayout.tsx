'use client';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { ReactNode } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export function ClientLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <>
            <GoogleTagManager gtmId="GTM-K7P344NG" />
            <GoogleAnalytics gaId="G-YTXQPVERXL" />
            <GoogleReCaptchaProvider reCaptchaKey={'6LeMoT4aAAAAAMF6sWS-mo3hf757jjDrv7rPpmgs'}>
                {children}
            </GoogleReCaptchaProvider>
        </>
    );
}
