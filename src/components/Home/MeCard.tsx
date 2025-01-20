import Image from "next/image";
import { NextBirthday } from "./NextBirthday";
import { Calendar2DateFill } from "react-bootstrap-icons";
import { useTranslations } from "next-intl";
import ProfilePicture from "@public/img/picture/pp.png";

import Bluesky from "@public/img/network/bluesky.svg";
import Github from "@public/img/network/github.svg";
import Linkedin from "@public/img/network/linkedin.svg";
import Mail from "@public/img/network/mail.svg";
import Smartphone from "@public/img/network/smartphone.svg";
import Twitter from "@public/img/network/twitter.svg";
import { NetworkCard } from "./NetworkCard";

export function MeCard() {
    const t = useTranslations('MeCard');

    const bithdate = new Date('2004-11-01');

    const networks = [
        {
            title: t('phone'),
            url: 'tel:+33647805944',
            icon: Smartphone
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
        {
            title: t('email'),
            url: 'mailto:nathan@bonnell.fr',
            icon: Mail
        },
    ]

    return (
        <div className="w-full h-auto bg-black p-6 rounded-3xl border-white border-2 flex flex-col">
            <div className='flex flex-row space-x-4 mb-5'>
                <Image src={ProfilePicture.src} alt={t('title')} className='w-1/2 h-full rounded-lg bg-gray-300 my-auto' height={300} width={300} />
                <div className='p-4'>
                    <div>
                        <h2 className='font-bold text-2xl mb-2 text-white'>{t('title')}</h2>
                    </div>
                    <div>
                        <p className='text-gray-300 text-sm italic mb-2'>{t('citation')}</p>
                    </div>
                    <div>
                        <h3 className='text-gray-300 text-lg font-semibold'>{t('dates')}</h3>
                        <div className='grid grid-cols-2 gap-2'>
                            <div className='text-gray-300 mb-2 text-sm'>
                                <Calendar2DateFill className='inline-block' /> : {bithdate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </div>
                            <div className='text-gray-300 mb-2 text-sm'>
                                <NextBirthday bithdate={bithdate} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className='text-gray-300 text-lg font-semibold mb-3'>{t('contact')}</h3>
                        <div className="grid grid-cols-2 gap-6">
                            {networks.map((network, index) => (
                                <NetworkCard key={index} title={network.title} url={network.url} icon={network.icon} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <a href='/CV_Nathan_Bonnell.pdf' target='_blank' className='bg-white text-black p-2 rounded-lg my-auto font-extrabold text-center hover:bg-gray-200 transition duration-300 ease-in-out'>
                {t('cv')}
            </a>
        </div>
    )
}
