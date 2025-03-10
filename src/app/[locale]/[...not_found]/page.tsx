import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function NotFound() {
    const t = useTranslations('Error');

    return (
        <div className='flex flex-col min-h-screen bg-no-repeat bg-fixed overflow-x-hidden' style={{ background: 'radial-gradient(circle, rgba(255, 0, 34, 0.8) 20%, rgba(0, 0, 0, 1) 80%)', backgroundSize: 'cover', backgroundPosition: 'top' }}>
            <div className='flex-grow mb-auto flex flex-col bg-fixed'>
                <div className='h-screen w-full bg-black/80 flex flex-col justify-center items-center'>
                    <div className='flex flex-col animate-fade-in'>
                        <h1 className='text-white text-8xl font-bold flex-grow flex items-center justify-center mb-4'>{t('title')}</h1>
                        <p className='text-white text-4xl font-bold flex-grow flex items-center justify-center mb-8'>{t('message')}</p>
                        <div className='flex flex-row flex-wrap justify-center space-x-4 my-16'>
                            <Link href='/' className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105'>
                                {t('home')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Ajout de l'animation fade-in dans le fichier CSS global
