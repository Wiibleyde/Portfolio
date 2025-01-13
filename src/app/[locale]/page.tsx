import { ScrollButton } from "@/components/UI/ScrollButton";
import { useTranslations } from "next-intl";
import { MeCard } from "@/components/Home/MeCard";
import { HardSkills } from "@/components/Home/HardSkills";
import { SoftSkills } from "@/components/Home/SoftSkills";
import { Timeline } from "@/components/Home/Timeline";
import { Words3D } from "@/components/Home/Words3D";
import { WordAnimation } from "@/components/Home/WordAnimation";

export default function Home() {
    const t = useTranslations('HomePage');

    return (
        <div className='flex flex-col min-h-screen bg-no-repeat bg-fixed overflow-x-hidden'>
            <video autoPlay muted loop className='absolute -z-10 w-full h-full object-cover'>
                <source src={"/video/background.mp4"} type='video/mp4' />
            </video>
            <div className='flex-grow mb-auto flex flex-col bg-fixed'>
                <div className='h-screen w-full bg-opacity-60 bg-black flex flex-col justify-center items-center'>
                    {/* <h1 className='text-white text-8xl font-bold flex-grow flex items-center justify-center'>{t('title')}</h1> */}
                    <div className='flex flex-col items-center justify-center'>
                        <Words3D text={t('title')} />
                    </div>
                    <div className='absolute bottom-0'>
                        <ScrollButton />
                    </div>
                </div>
            </div>
            <div className='flex flex-col justify-center items-center bg-black h-fit p-8 space-y-32 text-white' id='content'>
                <div className='w-full mb-36'>
                    <WordAnimation title={t('description')} />
                </div>
                <div className='w-1/2'>
                    <h1 className='text-4xl font-bold mb-4'>{t('me')}</h1>
                    <MeCard />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 w-full'>
                    <div className=''>
                        <h1 className='text-4xl font-bold mb-4 text-center'>{t('hardskills')}</h1>
                        <HardSkills />
                    </div>
                    <div className=''>
                        <h1 className='text-4xl font-bold mb-4 text-center'>{t('softskills')}</h1>
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
