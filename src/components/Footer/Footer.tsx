"use client"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Github, Linkedin, TwitterX } from "react-bootstrap-icons"

export function Footer() {
    const t = useTranslations('Footer')

    return (
        <footer className='bg-black text-white py-10 px-6 border-t-2 border-gray-800'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex flex-col md:flex-row justify-between items-center'>
                    <ul className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-center md:text-left'>
                        <li><Link href='/' className="hover:underline">{t('home')}</Link></li>
                        <li><Link href='/projects' className="hover:underline">{t('projects')}</Link></li>
                        <li><Link href='/contact' className="hover:underline">{t('contact')}</Link></li>
                    </ul>
                    <h1 className='text-center text-2xl md:text-4xl font-bold mt-8 md:mt-0'>Nathan Bonnell</h1>
                </div>
                <div className='flex justify-center items-center mt-8'>
                    <ul className='flex space-x-6'>
                        <li><Link href='https://github.com/wiibleyde' className="text-white hover:text-gray-400 transition duration-300"><Github size={32} /></Link></li>
                        <li><Link href='https://twitter.com/wiibleyde' className="text-white hover:text-gray-400 transition duration-300"><TwitterX size={32} /></Link></li>
                        <li><Link href='https://www.linkedin.com/in/nathan-bonnell-57736926a/' className="text-white hover:text-blue-500 transition duration-300"><Linkedin size={32} /></Link></li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}