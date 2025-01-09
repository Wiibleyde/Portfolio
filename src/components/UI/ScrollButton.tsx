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
        <button className='flex flex-col justify-end items-center space-y-8 mb-10' onClick={handleScroll} name="Scroll to content">
            <p className='text-white text-4xl italic'>{t('scroll')}</p>
            <ArrowDownCircleFill className='text-white text-4xl animate-bounce' />
        </button>
    )
}