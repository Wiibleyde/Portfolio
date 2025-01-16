"use client"
import { ReCaptchaProvider } from "next-recaptcha-v3";
import { ReactNode } from "react";
import { GoogleTagManager } from '@next/third-parties/google'

export function ClientProviders({ children }: { children: ReactNode }) {
    return (
        <>
            <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || ''} />
            <ReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
                {children}
            </ReCaptchaProvider>
        </>
    )
}