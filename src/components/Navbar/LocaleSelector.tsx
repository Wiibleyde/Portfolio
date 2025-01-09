import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import FRFlag from "@public/img/flag/fr.svg";
import ENFlag from "@public/img/flag/en.svg";
import Image from "next/image";

export function LocaleSelector() {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const handleLanguageChange = (language: string) => {
        router.push(pathname, { locale: language, scroll: false });
    }

    return (
        <div className="flex flex-row space-x-2">
            <button onClick={() => handleLanguageChange("fr")} className={`relative p-1 rounded-full transition duration-300 ${locale === "fr" ? "bg-green-500" : "bg-gray-700"} hover:bg-green-400`} name="Change to French">
                <Image src={FRFlag} alt="FR Flag" width={30} height={30} />
            </button>
            <button onClick={() => handleLanguageChange("en")} className={`relative p-1 rounded-full transition duration-300 ${locale === "en" ? "bg-green-500" : "bg-gray-700"} hover:bg-green-400`} name="Change to English">
                <Image src={ENFlag} alt="EN Flag" width={30} height={30} />
            </button>
        </div>
    );
}