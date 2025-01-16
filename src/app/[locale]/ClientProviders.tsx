"use client"
import { ReCaptchaProvider } from "next-recaptcha-v3";
import { ReactNode } from "react";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'

export function ClientProviders({ children }: { children: ReactNode }) {
    return (
        <>
            <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || ''} />
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''} />
            <ReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
                {children}
            </ReCaptchaProvider>
        </>
    )
}