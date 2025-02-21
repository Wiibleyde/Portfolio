"use client"
import { ReactNode } from "react";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
export function ClientProviders({ children }: { children: ReactNode }) {
    return (
        <>
            <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || ''} />
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''} />
            <GoogleReCaptchaProvider reCaptchaKey={'6LeMoT4aAAAAAMF6sWS-mo3hf757jjDrv7rPpmgs'}>
                {children}
            </GoogleReCaptchaProvider>
        </>
    )
}