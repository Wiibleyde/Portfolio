import { useTranslations } from "next-intl";
import { WordAnimation } from "@/components/Home/WordAnimation";
import { MeCards } from "@/components/Home/MeCards";
import { HardSkills } from "@/components/Home/HardSkills";
import { SoftSkills } from "@/components/Home/SoftSkills";
import { Timeline } from "@/components/Home/Timeline";
import BlurText from "@/components/UI/BlurText";
import Wallpaper from "@public/img/picture/wallpaper.jpg";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ScrollButton } from "@/components/UI/ScrollButton";

export default function Home() {
    const t = useTranslations('HomePage');

    return (
        <div className='flex flex-col min-h-screen bg-no-repeat bg-fixed overflow-x-hidden'>
            <div className="-z-10 w-screen h-screen object-cover bg-fixed fixed">
                <Image src={Wallpaper} alt="Wallpaper" className="blur-xs bg-black w-full h-full object-cover" />
            </div>
            <div className='flex-grow mb-auto flex flex-col bg-fixed'>
                <div className='h-screen w-full bg-black/50 flex flex-col justify-start items-start'>
                    <div className="mt-28 ml-28">
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
                    <Link href="/contact" className="absolute bottom-0 right-0 mr-28 mb-28 text-white text-4xl font-bold transition duration-300 hover:text-gray-400">
                        {t('contact')}
                    </Link>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-28">
                        <ScrollButton />
                    </div>
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
