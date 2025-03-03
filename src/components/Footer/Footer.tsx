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
                        <li><Link href='/tools' className="hover:underline">{t('tools')}</Link></li>
                    </ul>
                    <h1 className='text-center text-2xl md:text-4xl font-bold mt-8 md:mt-0'>Nathan Bonnell</h1>
                </div>
                <div className='flex justify-center items-center mt-8'>
                    <ul className='flex space-x-6'>
                        <li><Link href='https://github.com/wiibleyde' aria-label="Wiibleyde Github" className="text-white hover:text-gray-400 transition duration-300"><Github size={32} style={{ width: '32px', height: '32px' }} /></Link></li>
                        <li><Link href='https://twitter.com/wiibleyde' aria-label="Wiibleyde Twitter" className="text-white hover:text-gray-400 transition duration-300"><TwitterX size={32} style={{ width: '32px', height: '32px' }} /></Link></li>
                        <li><Link href='https://www.linkedin.com/in/nathan-bonnell-57736926a/' aria-label="Wiibleyde LinkedIn" className="text-white hover:text-blue-500 transition duration-300"><Linkedin size={32} style={{ width: '32px', height: '32px' }} /></Link></li>
                    </ul>
                </div>
            </div>
            <div className="text-center text-sm mt-12">
                <Link href='/legal-mentions' className="hover:underline mb-4 inline-block">{t('legal')}</Link>
                <br />
                This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.
            </div>
        </footer>
    )
}