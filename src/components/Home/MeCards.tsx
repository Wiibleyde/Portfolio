import Image from "next/image";
import { NextBirthday } from "./NextBirthday";
import { useTranslations } from "next-intl";
import ProfilePicture from "@public/img/picture/pp.png";

import Bluesky from "@public/img/network/bluesky.svg";
import Github from "@public/img/network/github.svg";
import Linkedin from "@public/img/network/linkedin.svg";
import Mail from "@public/img/network/mail.svg";
import Twitter from "@public/img/network/twitter.svg";
import { NetworkCard } from "./NetworkCard";
import { Link } from "@/i18n/routing";

export function MeCards() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-16">
            <div className='col-span-1 md:col-span-2 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 dark:bg-black bg-gray-200 p-6 rounded-[2rem] nice-shadow items-center'>
                <Image src={ProfilePicture.src} alt={t('title')} className='w-full md:w-auto h-auto rounded-xl bg-gray-900 my-auto' height={300} width={300} />
                <div className='p-4'>
                    <h3 className='text-2xl font-bold'>{t('title')}</h3>
                    <p className='italic dark:text-gray-400 text-gray-500'>{t('citation')}</p>
                    <p className='text-lg mt-4 text-justify'>{t('description')}</p>
                </div>
            </div>
            <div className='row-span-2 flex flex-col space-y-4 dark:bg-black bg-gray-200 p-6 rounded-[2rem] nice-shadow items-center'>
                <h3 className='text-xl font-semibold mb-4'>{t('cv')}</h3>
                <a href="/CV_Nathan_Bonnell.pdf" className='rounded-[2rem] w-full p-2'>
                    <Image src='/img/cv/CV_Nathan_Bonnell.png' alt={t('cvAltText')} className='object-cover w-full rounded-[2rem]' height={500} width={500} />
                </a>
                <a href='/CV_Nathan_Bonnell.pdf' target='_blank' className='bg-red-500 text-white p-4 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300'>
                    {t('downloadCv')}
                </a>
            </div>
            <div className='flex flex-col space-x-4 dark:bg-black bg-gray-200 p-6 rounded-[2rem] nice-shadow items-center'>
                <h3 className='text-xl font-semibold mb-4'>{t('dates')}</h3>
                <p className='text-lg dark:text-white'>{t('born', { date: birthdate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) })}</p>
                <div className='mt-4 w-full'>
                    <NextBirthday birthdate={birthdate} />
                </div>
            </div>
            <div className='flex flex-col space-y-4 dark:bg-black bg-gray-200 p-6 rounded-[2rem] nice-shadow items-center'>
                <h3 className='text-xl font-semibold mb-4'>{t('contact')}</h3>
                <div className='w-full flex flex-wrap justify-center items-center space-x-4'>
                    {networks.map((network) => (
                        <NetworkCard key={network.url} title={network.title} url={network.url} icon={network.icon} />
                    ))}
                </div>
                <Link href='/contact' className='bg-blue-500 text-white m-2 p-4 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300'>
                    {t('contactMe')}
                </Link>
            </div>
        </div>
    )
}