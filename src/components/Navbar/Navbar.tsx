"use client"
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { LocaleSelector } from "./LocaleSelector";
import { useEffect, useState, useRef } from "react";
import { useMouse } from "@/hooks/useMouse";
import { List } from "react-bootstrap-icons";

const cv = "/CV_Nathan_Bonnell.pdf";

export function Navbar() {
    const t = useTranslations("Navbar");
    const pathname = usePathname();

    const [showNavbar, setShowNavbar] = useState(false);
    const [isShowingNavbar, setIsShowingNavbar] = useState(false);
    const navbarRef = useRef<HTMLDivElement>(null);

    const { mouse, onElement, mouseOnWebsite } = useMouse({ element: navbarRef.current as HTMLElement });

    useEffect(() => {
        if(!mouseOnWebsite) {
            setShowNavbar(false);
            setIsShowingNavbar(false);
        }
        const isMouseNearNavbar = mouse.x >= window.innerWidth - 50;
        if (isMouseNearNavbar) {
            setShowNavbar(true);
            setIsShowingNavbar(true);
        } else {
            if (!onElement && isShowingNavbar) {
                setShowNavbar(false);
                setIsShowingNavbar(false);
            } else if (onElement && !isShowingNavbar) {
                setShowNavbar(true);
                setIsShowingNavbar(true);
            }
        }
    }, [mouse, onElement, isShowingNavbar, mouseOnWebsite]);

    return (
        <>
            <div className={`fixed top-4 right-4 z-50 ${showNavbar ? "hidden" : "block"}`}>
                <button onClick={() => setShowNavbar(true)} className="p-2 bg-black bg-opacity-95 text-white rounded-full shadow-lg">
                    <List size={32} />
                </button>
            </div>
            <div ref={navbarRef} id="navbar" className={`fixed bg-gradient-to-r from-black via-gray-900 to-black text-white border-2 border-white rounded-xl w-64 h-[calc(100%-2rem)] top-4 right-4 flex flex-col items-start justify-between p-8 shadow-2xl z-50 transition-transform duration-300 transform ${showNavbar ? "translate-x-0" : "translate-x-[calc(100%+2rem)]"}`}>
                <div className="flex flex-col space-y-6 items-start mt-6">
                    <p className="font-bold text-lg">{t("name")}</p>
                    <p className="font-bold text-green-400 italic">{t("job")}</p>
                </div>
                <div className="flex flex-col space-y-6 items-start mt-4">
                    <Link href="/">
                        <h2 className={`relative hover:text-gray-400 transition duration-300 ${pathname === "/" ? "decoration-2 underline-offset-4" : ""}`}>
                            {t("home")}
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-400 transition-transform duration-300 ${pathname === "/" ? "scale-x-100" : "scale-x-0"} origin-left`}></span>
                        </h2>
                    </Link>
                    <Link href="/projects">
                        <h2 className={`relative hover:text-gray-400 transition duration-300 ${pathname === "/projects" ? "decoration-2 underline-offset-4" : ""}`}>
                            {t("projects")}
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-400 transition-transform duration-300 ${pathname === "/projects" ? "scale-x-100" : "scale-x-0"} origin-left`}></span>
                        </h2>
                    </Link>
                    <Link href="/contact">
                        <h2 className={`relative hover:text-gray-400 transition duration-300 ${pathname === "/contact" ? "decoration-2 underline-offset-4" : ""}`}>
                            {t("contact")}
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-400 transition-transform duration-300 ${pathname === "/contact" ? "scale-x-100" : "scale-x-0"} origin-left`}></span>
                        </h2>
                    </Link>
                    <a href={cv} target="_blank" rel="noreferrer">
                        <h2 className={`relative hover:text-gray-400 transition duration-300`}>
                            {t("cv")}
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-400 transition-transform duration-300 ${pathname === "RIEN CAR IL Y A PAS DE LIENS A METTRE MDRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR" ? "scale-x-100" : "scale-x-0"} origin-left`}></span>
                        </h2>
                    </a>
                    <LocaleSelector />
                </div>
            </div>
        </>
    );
}
