import { ContactForm } from "@/components/Forms/ContactForm";
import { ScrollButton } from "@/components/UI/ScrollButton";
import { useTranslations } from "next-intl";

export default function ContactPage() {
    const t = useTranslations('ContactPage');

    return (
        <div className='flex flex-col min-h-screen bg-no-repeat bg-fixed overflow-x-hidden' style={{ backgroundImage: 'radial-gradient(circle, rgba(30, 172, 10, 0.7) 20%, rgba(0, 0, 0, 1) 80%)', backgroundSize: 'cover', backgroundPosition: 'top' }}>
            <div className='flex-grow mb-auto flex flex-col bg-fixed'>
                <div className='h-screen w-full bg-white/80 dark:bg-black/80 flex flex-col justify-center items-center'>
                    <h1 className='text-black dark:text-white text-4xl md:text-6xl lg:text-8xl font-bold flex-grow flex items-center justify-center'>{t('title')}</h1>
                    <ScrollButton />
                </div>
            </div>
            <div className='flex flex-col justify-center items-center dark:bg-black bg-gray-100 h-fit p-8 space-y-8 dark:text-white boxShadowHomepage' id='content'>
                <h2 className='text-4xl font-bold'>{t('contact')}</h2>
                <p className='dark:text-gray-500 text-gray-700'>{t('description')}</p>
                <ContactForm />
            </div>
        </div>
    )
}
