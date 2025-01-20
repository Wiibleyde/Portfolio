import Image from "next/image";
import { NextBirthday } from "./NextBirthday";
import { useTranslations } from "next-intl";
import ProfilePicture from "@public/img/picture/pp.png";

import Bluesky from "@public/img/network/bluesky.svg";
import Github from "@public/img/network/github.svg";
import Linkedin from "@public/img/network/linkedin.svg";
import Mail from "@public/img/network/mail.svg";
import Smartphone from "@public/img/network/smartphone.svg";
import Twitter from "@public/img/network/twitter.svg";
import { NetworkCard } from "./NetworkCard";
import { LoadingSvg } from "../UI/Loading";
import { Link } from "@/i18n/routing";

export function MeCard() {
    const t = useTranslations('MeCard');

    const birthdate = new Date('2004-11-01');

    const networks = [
        {
            title: t('email'),
            url: 'mailto:nathan@bonnell.fr',
            icon: Mail
        },
        {
            title: t('bluesky'),
            url: 'https://bsky.app/profile/wiibleyde.bsky.social',
            icon: Bluesky
        },
        {
            title: t('github'),
            url: 'https://github.com/Wiibleyde',
            icon: Github
        },
        {
            title: t('linkedin'),
            url: 'https://www.linkedin.com/in/nathan-bonnell-57736926a',
            icon: Linkedin
        },
        {
            title: t('twitter'),
            url: 'https://twitter.com/Wiibleyde',
            icon: Twitter
        },
    ]

    return (
        <div className="grid grid-cols-3 gap-6 my-16">
            <div className='col-span-2 flex flex-row space-x-4 bg-black p-6 rounded-[2rem] nice-shadow'>
                <Image src={ProfilePicture.src} alt={t('title')} className='h-full rounded-xl bg-gray-900 my-auto' height={300} width={300} />
                <div className='p-4'>
                    <p className='text-2xl font-bold'>{t('title')}</p>
                    <p className='italic text-gray-400'>{t('citation')}</p>
                    <p className='text-lg mt-4 text-justify'>{t('description')}</p>
                </div>
            </div>
            <div className='flex flex-col space-x-4 bg-black p-6 rounded-[2rem] nice-shadow'>
                <h3 className='text-xl font-semibold mb-4'>{t('dates')}</h3>
                <div className='flex items-center'>
                    <span className='text-lg font-medium text-gray-300 bg-gray-800 p-2 rounded-lg'>
                        {birthdate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                </div>
                <div className='mt-4'>
                    <NextBirthday birthdate={birthdate} />
                </div>
            </div>
            <div className='flex flex-col space-y-4 bg-black p-6 rounded-[2rem] nice-shadow'>
                <h3 className='text-xl font-semibold mb-4'>{t('cv')}</h3>
                <div className='rounded-[2rem] w-full p-2'>
                    <Image src='/img/cv/CV_Nathan_Bonnell.png' alt={t('cvAltText')} className='object-cover rounded-[2rem]' height={500} width={500} />
                </div>
                <a href='/CV_Nathan_Bonnell.pdf' target='_blank' className='bg-red-500 text-white p-4 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300'>
                    {t('downloadCv')}
                </a>
            </div>
            <div className='flex flex-col space-x-4 bg-black p-6 rounded-[2rem] nice-shadow'>
                <h3 className='text-xl font-semibold mb-4'>{t('contact')}</h3>
                <div className='w-full flex flex-col space-y-2 my-4 p-2'>
                    {networks.map((network, index) => (
                        <NetworkCard key={index} title={network.title} url={network.url} icon={network.icon} />
                    ))}
                </div>
                <Link href='/contact' className='bg-blue-500 text-white m-2 p-4 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300'>
                    {t('contactMe')}
                </Link>
            </div>
            <div className='bg-black p-6 rounded-[2rem] nice-shadow'>
                <div className='flex flex-col justify-center items-center space-y-4'>
                    <LoadingSvg />
                    <p className='text-xl font-semibold text-center'>{t('WIP')}</p>
                    <p className='text-gray-400 text-center'>{t('WIPMessage')}</p>
                </div>
            </div>
        </div>
    )
}