"use client"
import { Link, usePathname } from "@/i18n/routing";
import { LocaleSelector } from "./LocaleSelector";
import { useEffect, useState, useRef } from "react";
import { useMouse } from "@/hooks/useMouse";
import { List, X } from "react-bootstrap-icons";
import { useTranslations } from "next-intl";

const cv = "/CV_Nathan_Bonnell.pdf";

export function Navbar() {
    const t = useTranslations("Navbar");
    const pathname = usePathname();

    const [showNavbar, setShowNavbar] = useState(false);
    const [isShowingNavbar, setIsShowingNavbar] = useState(false);
    const navbarRef = useRef<HTMLDivElement>(null);

    const { mouse, onElement } = useMouse({ element: typeof window !== 'undefined' ? navbarRef.current ?? undefined : undefined });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const isMouseNearNavbar = mouse.x <= 40;
        if (isMouseNearNavbar && !isShowingNavbar) {
            setShowNavbar(true);
            setIsShowingNavbar(true);
        } else if (!isMouseNearNavbar && !onElement && isShowingNavbar) {
            setShowNavbar(false);
            setIsShowingNavbar(false);
        } else if (onElement && !isShowingNavbar) {
            setShowNavbar(true);
            setIsShowingNavbar(true);
        }
    }, [onElement, isShowingNavbar, mouse]);

    return (
        <>
            <div className={`fixed top-4 left-4 z-50 ${showNavbar ? "hidden" : "block"}`}>
                <button onClick={() => setShowNavbar(true)} className="p-2 text-black dark:text-white" name="Open Navbar" aria-label="Open Navbar">
                    <List size={32} />
                </button>
            </div>
            <div ref={navbarRef} id="navbar" className={`fixed bg-white dark:bg-gradient-to-r dark:from-black dark:via-gray-900 dark:to-black text-black dark:text-white border-2 border-black dark:border-white rounded-xl w-64 h-[calc(100%-2rem)] top-4 left-4 flex flex-col items-start justify-between p-8 shadow-2xl z-50 transition-transform duration-300 transform ${showNavbar ? "translate-x-0" : "-translate-x-[calc(100%+2rem)]"}`}>
                <div className="absolute top-4 left-4 z-50">
                    <button onClick={() => setShowNavbar(false)} className="p-2 bg-white dark:bg-black dark:bg-opacity-95 text-black dark:text-white rounded-full shadow-lg" name="Close Navbar" aria-label="Close Navbar">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex flex-col space-y-6 items-start mt-6">
                    <p className="font-bold text-lg">{t("name")}</p>
                    <p className="font-bold text-green-400 italic">{t("job")}</p>
                </div>
                <div className="flex flex-col space-y-6 items-start mt-4">
                    <Link href="/">
                        <h2 className={`relative hover:text-gray-600 dark:hover:text-gray-400 transition duration-300 ${pathname === "/" ? "decoration-2 underline-offset-4" : ""}`}>
                            {t("home")}
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-400 transition-transform duration-300 ${pathname === "/" ? "scale-x-100" : "scale-x-0"} origin-left`}></span>
                        </h2>
                    </Link>
                    <Link href="/projects">
                        <h2 className={`relative hover:text-gray-600 dark:hover:text-gray-400 transition duration-300 ${pathname === "/projects" ? "decoration-2 underline-offset-4" : ""}`}>
                            {t("projects")}
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-400 transition-transform duration-300 ${pathname === "/projects" ? "scale-x-100" : "scale-x-0"} origin-left`}></span>
                        </h2>
                    </Link>
                    <Link href="/contact">
                        <h2 className={`relative hover:text-gray-600 dark:hover:text-gray-400 transition duration-300 ${pathname === "/contact" ? "decoration-2 underline-offset-4" : ""}`}>
                            {t("contact")}
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-400 transition-transform duration-300 ${pathname === "/contact" ? "scale-x-100" : "scale-x-0"} origin-left`}></span>
                        </h2>
                    </Link>
                    <Link href="/tools">
                        <h2 className={`relative hover:text-gray-600 dark:hover:text-gray-400 transition duration-300 ${pathname === "/tools" ? "decoration-2 underline-offset-4" : ""}`}>
                            {t("tools")}
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-400 transition-transform duration-300 ${pathname === "/tools" ? "scale-x-100" : "scale-x-0"} origin-left`}></span>
                        </h2>
                    </Link>
                    <a href={cv} target="_blank" rel="noreferrer">
                        <h2 className={`relative hover:text-gray-600 dark:hover:text-gray-400 transition duration-300`}>
                            {t("cv")}
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 transition-transform duration-300`}></span>
                        </h2>
                    </a>
                    <LocaleSelector />
                </div>
            </div>
        </>
    );
}
