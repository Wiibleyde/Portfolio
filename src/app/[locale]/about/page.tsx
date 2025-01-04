import { ScrollButton } from "@/components/UI/ScrollButton";
import { useTranslations } from "next-intl";

export default function AboutPage() {
    const t = useTranslations('AboutPage');

    return (
        <div className='flex flex-col min-h-screen bg-no-repeat bg-fixed overflow-x-hidden' style={{ background: 'radial-gradient(circle, rgba(232, 3, 3, 0.7) 20%, rgba(0, 0, 0, 1) 80%)', backgroundSize: 'cover', backgroundPosition: 'top' }}>
            <div className='flex-grow mb-auto flex flex-col bg-fixed'>
                <div className='h-screen w-full bg-opacity-60 bg-black flex flex-col justify-center items-center'>
                    <h1 className='text-white text-8xl font-bold flex-grow flex items-center justify-center'>{t('title')}</h1>
                    <ScrollButton />
                </div>
            </div>
            <div className='flex flex-col justify-center items-center bg-black h-fit p-8 space-y-8 text-white' id='content'>
                <h1 className='text-4xl font-bold'>{t('about')}</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 w-full'>
                    <div className='text-end'>
                        <h1 className='text-4xl font-bold mb-4'>{t('design')}</h1>
                        <p>{t('designContent')}</p>
                    </div>
                    <div className=''>
                        <h1 className='text-4xl font-bold mb-4'>{t('technical')}</h1>
                        <p>{t('technicalContent')}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}