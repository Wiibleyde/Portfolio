"use client"
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { LocaleSelector } from "./LocaleSelector";

export function Navbar() {
    const t = useTranslations("Navbar");
    const pathname = usePathname();

    return (
        <div className="fixed bg-black bg-opacity-95 text-white w-full h-16 flex flex-row items-center justify-between px-6 shadow-lg z-50">
            <div className="flex flex-row space-x-4 items-center">
                <p className="font-bold text-lg">{t("name")}</p>
                <p className="text-gray-400">-</p>
                <p className="font-bold text-green-400 italic">{t("job")}</p>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2">
                <Link href="/">
                    <p className="text-2xl font-semibold">{t("title")}</p>
                </Link>
            </div>
            <div className="flex flex-row space-x-6 items-center">
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
                <Link href="/about">
                    <h2 className={`relative hover:text-gray-400 transition duration-300 ${pathname === "/about" ? "decoration-2 underline-offset-4" : ""}`}>
                        {t("about")}
                        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-400 transition-transform duration-300 ${pathname === "/about" ? "scale-x-100" : "scale-x-0"} origin-left`}></span>
                    </h2>
                </Link>
                <LocaleSelector />
            </div>
        </div>
    );
}
