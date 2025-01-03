"use client"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Github, Linkedin, TwitterX } from "react-bootstrap-icons"

export function Footer() {
    const t = useTranslations('Footer')

    return (
        <footer className='bg-black text-white p-16 border-t-2 border-white'>
            <div className='flex justify-center items-center space-x-1'>
                <ul className='space-y-2 text-center'>
                    <li><Link href='/'>{t('home')}</Link></li>
                    <li><Link href='/about'>{t('about')}</Link></li>
                    <li><Link href='/contact'>{t('contact')}</Link></li>
                </ul>
            </div>
            <div className='flex justify-center items-center'>
                <h1 className='text-center text-4xl font-bold mt-8'>Nathan Bonnell</h1>
            </div>
            <div className='flex justify-center items-center mt-8'>
                <ul className='flex space-x-4'>
                    <li><Link href='https://github.com/wiibleyde' className="text-white hover:text-gray-400 transition duration-300"><Github size={32} /></Link></li>
                    <li><Link href='https://twitter.com/wiibleyde'><TwitterX size={32} /></Link></li>
                    <li><Link href='https://www.linkedin.com/in/nathan-bonnell-57736926a/' className="text-white hover:text-blue-500 transition duration-300"><Linkedin size={32} /></Link></li>
                </ul>
            </div>
        </footer>
    )
}