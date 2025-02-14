"use client"
import { ScrollButton } from "@/components/UI/ScrollButton";
import { useTranslations } from "next-intl";
import QrCodeWithLogo from 'qrcode-with-logos'
import { BaseOptions, CornerType, DotType } from "qrcode-with-logos/types/src/core/types";
import { useState } from "react";

interface VCardData {
    firstName: string
    lastName: string
    company: string
    jobTitle: string
    email: string
    phone: string
    address: string
    website: string
}

const initialVCardData: VCardData = {
    firstName: '',
    lastName: '',
    company: '',
    jobTitle: '',
    email: '',
    phone: '',
    address: '',
    website: '',
}

const dotTypes: DotType[] = ['dot', 'dot-small', 'tile', 'rounded', 'square', 'diamond', 'star', 'fluid', 'fluid-line', 'stripe', 'stripe-row', 'stripe-column'];
const cornerTypes: CornerType[] = ['square', 'rounded', 'circle', 'rounded-circle', 'circle-rounded', 'circle-star', 'circle-diamond'];

export default function ContactPage() {
    const t = useTranslations('QrCodePage');

    const [vcardData, setVcardData] = useState<VCardData>(initialVCardData)
    const [logo, setLogo] = useState<string>('')
    const [dotType, setDotType] = useState<string>('dot');
    const [cornerType, setCornerType] = useState<string>('circle');
    const [dotColor, setDotColor] = useState<string>('#000000');
    const [cornerColor, setCornerColor] = useState<string>('#000000');
    const [lightColor, setLightColor] = useState<string>('#FFFFFF');

    const placeholders = {
        firstName: t('placeholders.firstName'),
        lastName: t('placeholders.lastName'),
        company: t('placeholders.company'),
        jobTitle: t('placeholders.jobTitle'),
        email: t('placeholders.email'),
        phone: t('placeholders.phone'),
        address: t('placeholders.address'),
        website: t('placeholders.website'),
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setVcardData((prevData) => ({ ...prevData, [name]: value }))
    }

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setLogo(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const generateVCardString = () => {
        const { firstName, lastName, company, jobTitle, email, phone, address, website } = vcardData
        let vcardString = `BEGIN:VCARD\nVERSION:3.0\n`
        if (lastName || firstName) vcardString += `N:${lastName};${firstName};;;\n`
        if (firstName || lastName) vcardString += `FN:${firstName} ${lastName}\n`
        if (company) vcardString += `ORG:${company}\n`
        if (jobTitle) vcardString += `TITLE:${jobTitle}\n`
        if (phone) vcardString += `TEL;TYPE=WORK,VOICE:${phone}\n`
        if (address) vcardString += `ADR;TYPE=WORK:;;${address}\n`
        if (email) vcardString += `EMAIL:${email}\n`
        if (website) vcardString += `URL:${website}\n`
        vcardString += `END:VCARD`
        return vcardString
    }

    const handleGenerateQrCode = () => {
        const vcardString = generateVCardString()
        const qrCodeOptions: BaseOptions = {
            content: vcardString,
            width: 900,
            nodeQrCodeOptions: {
                color: {
                    light: lightColor,
                },
            },
            dotsOptions: {
                type: dotType as DotType,
                color: dotColor,
            },
            cornersOptions: {
                type: cornerType as CornerType,
                color: cornerColor,
            },
            logo: logo ? { src: logo, logoRadius: 1 } : undefined,
        }
        const qrCode = new QrCodeWithLogo(qrCodeOptions)
        qrCode.getImage().then((image) => {
            const img = new Image()
            img.src = image.src
            const canvas = document.getElementById('qrcodeCanvas') as HTMLCanvasElement
            canvas.width = 500
            canvas.height = 500
            const context = canvas.getContext('2d')
            img.onload = () => {
                if (context) {
                    context.drawImage(img, 0, 0, 500, 500)
                }
            }
        })
    }

    return (
        <div className='flex flex-col min-h-screen bg-no-repeat bg-fixed overflow-x-hidden' style={{ backgroundImage: 'radial-gradient(circle, rgba(250, 86, 250, 0.8) 30%, rgba(0, 0, 0, 1) 80%)', backgroundSize: 'cover', backgroundPosition: 'top' }}>
            <div className='flex-grow mb-auto flex flex-col bg-fixed'>
                <div className='h-screen w-full bg-black/80 flex flex-col justify-center items-center'>
                    <h1 className='text-white text-4xl md:text-6xl lg:text-8xl font-bold flex-grow flex items-center justify-center'>{t('titleVCard')}</h1>
                    <ScrollButton />
                </div>
            </div>
            <div className='flex flex-col justify-center items-center bg-black h-fit p-8 space-y-8 text-white' id='content'>
                <h2 className='text-2xl font-bold'>{t('description')}</h2>
                <div className="flex flex-row space-x-4 p-4">
                    <div>
                        <form className="space-y-4">
                            {Object.keys(initialVCardData).map((key) => (
                                <div key={key} className="flex flex-col space-y-1">
                                    <label htmlFor={key} className="text-sm font-medium text-gray-300">
                                        {placeholders[key as keyof typeof placeholders]}
                                    </label>
                                    <input
                                        key={key}
                                        type="text"
                                        name={key}
                                        placeholder={placeholders[key as keyof typeof placeholders]}
                                        onChange={handleChange}
                                        className="w-full p-1 border border-gray-300 rounded-md bg-gray-800 text-white"
                                    />
                                </div>
                            ))}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="logo" className="text-sm font-medium text-gray-300">
                                    {t('placeholders.logo')}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="w-full p-1 border border-gray-300 rounded-md bg-gray-800 text-white"
                                />
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex flex-col space-y-1 w-1/2">
                                    <label htmlFor="dotType" className="text-sm font-medium text-gray-300">
                                        {t('placeholders.dotType')}
                                    </label>
                                    <select
                                        value={dotType}
                                        onChange={(e) => setDotType(e.target.value)}
                                        className="w-full p-1 border border-gray-300 rounded-md bg-gray-800 text-white"
                                    >
                                        {dotTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col space-y-1 w-1/2">
                                    <label htmlFor="dotColor" className="text-sm font-medium text-gray-300">
                                        {t('placeholders.dotColor')}
                                    </label>
                                    <input
                                        type="color"
                                        value={dotColor}
                                        onChange={(e) => setDotColor(e.target.value)}
                                        className="w-full h-full p-1 border border-gray-300 rounded-md bg-gray-800 text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex flex-col space-y-1 w-1/2">
                                    <label htmlFor="cornerType" className="text-sm font-medium text-gray-300">
                                        {t('placeholders.cornerType')}
                                    </label>
                                    <select
                                        value={cornerType}
                                        onChange={(e) => setCornerType(e.target.value)}
                                        className="w-full p-1 border border-gray-300 rounded-md bg-gray-800 text-white"
                                    >
                                        {cornerTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col space-y-1 w-1/2">
                                    <label htmlFor="cornerColor" className="text-sm font-medium text-gray-300">
                                        {t('placeholders.cornerColor')}
                                    </label>
                                    <input
                                        type="color"
                                        value={cornerColor}
                                        onChange={(e) => setCornerColor(e.target.value)}
                                        className="w-full h-full p-1 border border-gray-300 rounded-md bg-gray-800 text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="lightColor" className="text-sm font-medium text-gray-300">
                                    {t('placeholders.lightColor')}
                                </label>
                                <input
                                    type="color"
                                    value={lightColor}
                                    onChange={(e) => setLightColor(e.target.value)}
                                    className="w-full h-full p-1 border border-gray-300 rounded-md bg-gray-800 text-white"
                                />
                            </div>
                        </form>
                        <button
                            onClick={handleGenerateQrCode}
                            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        >
                            {t('generateQrCode')}
                        </button>
                    </div>
                    <div className="mt-4">
                        <canvas id="qrcodeCanvas" className="border border-gray-300 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    )
}
