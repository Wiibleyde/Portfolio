import { ScrollButton } from "@/components/UI/ScrollButton";
import { useTranslations } from "next-intl";
import { MeCards } from "@/components/Home/MeCards";
import { HardSkills } from "@/components/Home/HardSkills";
import { SoftSkills } from "@/components/Home/SoftSkills";
import { Timeline } from "@/components/Home/Timeline";
import BlurText from "@/components/UI/BlurText";

export default function Home() {
    const t = useTranslations('HomePage');

    return (
        <div className='flex flex-col min-h-screen bg-no-repeat bg-fixed overflow-x-hidden'>
            <video autoPlay muted loop className='absolute -z-10 w-full h-full object-cover'>
                <source src={"/video/background.mp4"} type='video/mp4' />
            </video>
            <div className='flex-grow mb-auto flex flex-col bg-fixed'>
                <div className='h-screen w-full bg-white/50 dark:bg-black/50 flex flex-col justify-start items-start'>
                    <div className="lg:mt-28 lg:ml-28 mt-32 ml-16">
                        <BlurText
                            text={t('title')}
                            delay={10}
                            animateBy="letters"
                            direction="top"
                            className="text-white text-3xl md:text-6xl lg:text-8xl font-bold flex-grow flex items-start justify-start"
                        />
                        <BlurText
                            text={t('title-desc')}
                            delay={15}
                            animateBy="letters"
                            direction="bottom"
                            className="text-white text-2xl font-bold flex-grow flex items-start justify-start"
                        />
                    </div>
                    {/* center */}
                    <div className='absolute bottom-0 left-0 right-0 flex justify-center'>
                        <ScrollButton />
                    </div>
                </div>
            </div>
            <div className='flex flex-col justify-center items-center dark:bg-black bg-gray-100 h-fit p-8 space-y-32 dark:text-white boxShadowHomepage' id='content'>
                {/* <div className='w-full mb-24'>
                    <WordAnimation title={t('description')} />
                </div> */}
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
