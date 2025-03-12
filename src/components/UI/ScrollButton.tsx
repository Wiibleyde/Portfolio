"use client"
import { useTranslations } from "next-intl";
import { ArrowDownCircleFill } from "react-bootstrap-icons";

export function ScrollButton() {
    const t = useTranslations('ScrollButton');

    const handleScroll = () => {
        const content = document.getElementById('content');
        if (content) {
            content.scrollIntoView({ behavior: 'smooth' });
        }
    }


    return (
        <button className='flex flex-col justify-end items-center space-y-8 mb-10' onClick={handleScroll} name="Scroll to content" aria-label="Scroll to content">
            <p className='text-black dark:text-white lg:text-4xl text-lg italic'>{t('scroll')}</p>
            <ArrowDownCircleFill className='text-black dark:text-white lg:text-4xl text-3xl animate-bounce' />
        </button>
    )
}