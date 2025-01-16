import { ScrollButton } from "@/components/UI/ScrollButton";
import { useTranslations } from "next-intl";
import { WordAnimation } from "@/components/Home/WordAnimation";
import { MeCard } from "@/components/Home/MeCard";
import { HardSkills } from "@/components/Home/HardSkills";
import { SoftSkills } from "@/components/Home/SoftSkills";
import { Timeline } from "@/components/Home/Timeline";
import { Pridi } from "next/font/google";

const pridi = Pridi({
    weight: "700",
    subsets: ['latin'],
    display: 'swap',
})

export default function Home() {
    const t = useTranslations('HomePage');

    return (
        <div className='flex flex-col min-h-screen bg-no-repeat bg-fixed overflow-x-hidden'>
            <video autoPlay muted loop className='absolute -z-10 w-full h-full object-cover'>
                <source src={"/video/background.mp4"} type='video/mp4' />
            </video>
            <div className='flex-grow mb-auto flex flex-col bg-fixed'>
                <div className='h-screen w-full bg-opacity-60 bg-black flex flex-col justify-center items-center'>
                    <h1 className='text-white text-8xl font-bold flex-grow flex items-center justify-center'>{t('title')}</h1>
                    <ScrollButton />
                </div>
            </div>
            <div className='flex flex-col justify-center items-center bg-black h-fit p-8 space-y-32 text-white' id='content'>
                <div className='w-full mb-36'>
                    <WordAnimation title={t('description')} />
                </div>
                <div className='w-1/2'>
                    <h1 className={'text-5xl text-center font-bold mb-4 ' + pridi.className}>{t('me')}</h1>
                    <MeCard />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 w-full'>
                    <div className=''>
                        <h1 className={'text-5xl font-bold mb-4 text-center ' + pridi.className}>{t('hardskills')}</h1>
                        <HardSkills />
                    </div>
                    <div className=''>
                        <h1 className={'text-5xl font-bold mb-4 text-center ' + pridi.className}>{t('softskills')}</h1>
                        <SoftSkills />
                    </div>
                </div>
                <div className=''>
                    <h1 className='text-4xl font-bold mb-4'>{t('timeline')}</h1>
                    <Timeline />
                </div>
            </div>
        </div>
    );
}
