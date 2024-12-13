import { ScrollButton } from "@/components/UI/ScrollButton";
import { useTranslations } from "next-intl";
import Background from "@public/img/background/project.jpg";
import { WordAnimation } from "@/components/home/WordAnimation";
import { MeCard } from "@/components/home/MeCard";
import { Stack } from "@/components/home/Stack";

export default function Home() {
    const t = useTranslations('HomePage');

    return (
        <div className='flex flex-col min-h-screen bg-no-repeat bg-fixed overflow-x-hidden' style={{ backgroundImage: `url(${Background.src})`, backgroundSize: 'cover', backgroundPosition: 'top' }}>
            <div className='flex-grow mb-auto flex flex-col bg-fixed'>
                <div className='h-screen w-full bg-opacity-60 bg-black flex flex-col justify-center items-center'>
                    <h1 className='text-white text-8xl font-bold flex-grow flex items-center justify-center'>{t('title')}</h1>
                    <ScrollButton />
                </div>
            </div>
            <div className='flex flex-col justify-center items-center bg-black h-fit p-8 space-y-8 text-white' id='content'>
                <WordAnimation title={t('description')} />
                <div className='grid grid-cols-2 gap-8 w-full'>
                    <div className=''>
                        <h1 className='text-4xl font-bold mb-4'>{t('me')}</h1>
                        <MeCard />
                    </div>
                    <div className=''>
                        <h1 className='text-4xl font-bold mb-4'>{t('stack')}</h1>
                        <Stack />
                    </div>
                </div>
            </div>
        </div>
    );
}
