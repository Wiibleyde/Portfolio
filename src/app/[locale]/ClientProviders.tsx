"use client"
import { ReactNode, useEffect, useRef, useState } from "react";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ChatLeft, FileEarmarkPerson, House, Laptop, Wrench } from "react-bootstrap-icons";
import Dock from "@/components/UI/Dock";
import { useRouter } from "@/i18n/routing";
import { useMouse } from "@/hooks/useMouse";
import { useTranslations } from "next-intl";

export function ClientProviders({ children }: { children: ReactNode }) {
    const t = useTranslations("Navbar");

    const [showNavbar, setShowNavbar] = useState(false);
    const [isShowingNavbar, setIsShowingNavbar] = useState(false);
    const navbarRef = useRef<HTMLDivElement>(null);

    const { mouse, onElement } = useMouse({ element: typeof window !== 'undefined' ? navbarRef.current ?? undefined : undefined });

    const router = useRouter();
    const items = [
        { icon: <House size={18} />, label: t("home"), onClick: () => router.push('/') },
        { icon: <Laptop size={18} />, label: t("projects"), onClick: () => router.push('/projects') },
        { icon: <ChatLeft size={18} />, label: t("contact"), onClick: () => router.push('/contact') },
        { icon: <Wrench size={18} />, label: t("tools"), onClick: () => router.push('/tools') },
        { icon: <FileEarmarkPerson size={18} />, label: t("cv"), onClick: () => window.open('/CV_Nathan_Bonnell.pdf', '_blank') },
    ];

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const isMouseNearNavbar = mouse.y >= window.innerHeight - 70
        if (isMouseNearNavbar && !isShowingNavbar) {
            setShowNavbar(true);
            setIsShowingNavbar(true);
        } else if (!isMouseNearNavbar && !onElement && isShowingNavbar) {
            setShowNavbar(false);
            setTimeout(() => setIsShowingNavbar(false), 300); // Delay to allow animation
        } else if (onElement && !isShowingNavbar) {
            setShowNavbar(true);
            setIsShowingNavbar(true);
        }
    }, [onElement, isShowingNavbar, mouse]);

    return (
        <>
            <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${showNavbar ? 'translate-y-0' : 'translate-y-full'}`}>
                <Dock
                    items={items}
                    panelHeight={68}
                    baseItemSize={50}
                    magnification={70}
                />
            </div>
            <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || ''} />
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''} />
            <GoogleReCaptchaProvider reCaptchaKey={'6LeMoT4aAAAAAMF6sWS-mo3hf757jjDrv7rPpmgs'}>
                {children}
            </GoogleReCaptchaProvider>
        </>
    )
}