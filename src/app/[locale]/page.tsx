import { ScrollButton } from "@/components/UI/ScrollButton";
import { useTranslations } from "next-intl";
import { WordAnimation } from "@/components/Home/WordAnimation";
import { MeCards } from "@/components/Home/MeCards";
import { HardSkills } from "@/components/Home/HardSkills";
import { SoftSkills } from "@/components/Home/SoftSkills";
import { Timeline } from "@/components/Home/Timeline";

export default function Home() {
    const t = useTranslations('HomePage');

    return (
        <div className='flex flex-col min-h-screen bg-no-repeat bg-fixed overflow-x-hidden'>
            <video autoPlay muted loop className='absolute -z-10 w-full h-full object-cover'>
                <source src={"/video/background.mp4"} type='video/mp4' />
            </video>
            <div className='flex-grow mb-auto flex flex-col bg-fixed'>
                <div className='h-screen w-full bg-black/80 flex flex-col justify-center items-center'>
                    <h1 className='text-white text-3xl md:text-6xl lg:text-8xl font-bold flex-grow flex items-center justify-center'>{t('title')}</h1>
                    <ScrollButton />
                </div>
            </div>
            <div className='flex flex-col justify-center items-center bg-black h-fit p-8 space-y-32 text-white' id='content'>
                <div className='w-full mb-24'>
                    <WordAnimation title={t('description')} />
                </div>
                <div className='w-full'>
                    <h2 className={'text-5xl text-center font-bold mb-4'}>{t('me')}</h2>
                    <MeCards />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 w-full'>
                    <div className=''>
                        <h2 className={'text-5xl font-bold mb-4 text-center'}>{t('hardskills')}</h2>
                        <HardSkills />
                    </div>
                    <div className=''>
                        <h2 className={'text-5xl font-bold mb-4 text-center'}>{t('softskills')}</h2>
                        <SoftSkills />
                    </div>
                </div>
                <div className=''>
                    <h2 className='text-4xl font-bold mb-4'>{t('timeline')}</h2>
                    <Timeline />
                </div>
            </div>
        </div>
    );
}
