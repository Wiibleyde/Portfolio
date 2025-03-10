import { ScrollButton } from "@/components/UI/ScrollButton";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function ToolsPage() {
    const t = useTranslations("ToolsPage");

    const subfolders = [
        {
            label: t("qrcode"),
            url: "/tools/qrcode",
        },
        {
            label: t("vcard"),
            url: "/tools/vcard",
        },
    ]

    return (
            <div className='flex flex-col min-h-screen bg-no-repeat bg-fixed overflow-x-hidden' style={{ backgroundImage: 'radial-gradient(circle, rgba(243, 120, 128, 0.7) 20%, rgba(0, 0, 0, 1) 80%)', backgroundSize: 'cover', backgroundPosition: 'top' }}>
                <div className='flex-grow mb-auto flex flex-col bg-fixed'>
                    <div className='h-screen w-full bg-black/80 flex flex-col justify-center items-center'>
                        <h1 className='text-white text-4xl md:text-6xl lg:text-8xl font-bold flex-grow flex items-center justify-center'>{t('title')}</h1>
                        <ScrollButton />
                    </div>
                </div>
                <div className='flex flex-col justify-center items-center bg-black h-fit p-8 space-y-8 text-white' id='content'>
                    <p className='text-xl font-light'>{t('description')}</p>
                    <div className='flex flex-col sm:flex-row justify-center items-center gap-8'>
                        {subfolders.map((subfolder) => (
                            <Link key={subfolder.url} href={subfolder.url} className='bg-black border-2 rounded-xl p-4 text-center'>
                                <h2 className='text-xl font-bold'>{subfolder.label}</h2>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        )
}
