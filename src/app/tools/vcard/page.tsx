'use client';
import { gsap } from 'gsap';
import QrCodeWithLogo from 'qrcode-with-logos';
import type { BaseOptions, CornerType, DotType } from 'qrcode-with-logos/types/src/core/types';
import { useEffect, useRef, useState } from 'react';

const dotTypes: DotType[] = [
    'dot',
    'dot-small',
    'tile',
    'rounded',
    'square',
    'diamond',
    'star',
    'fluid',
    'fluid-line',
    'stripe',
    'stripe-row',
    'stripe-column',
];
const cornerTypes: CornerType[] = [
    'square',
    'rounded',
    'circle',
    'rounded-circle',
    'circle-rounded',
    'circle-star',
    'circle-diamond',
];

interface VCardData {
    firstName: string;
    lastName: string;
    organization: string;
    title: string;
    phone: string;
    email: string;
    website: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export default function VCardPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);

    // VCard data
    const [vCardData, setVCardData] = useState<VCardData>({
        firstName: '',
        lastName: '',
        organization: '',
        title: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });

    // QR Code customization options
    const [logo, setLogo] = useState<string>('');
    const [dotType, setDotType] = useState<string>('rounded');
    const [cornerType, setCornerType] = useState<string>('rounded');
    const [dotColor, setDotColor] = useState<string>('#1e40af');
    const [cornerColor, setCornerColor] = useState<string>('#1e40af');
    const [lightColor, setLightColor] = useState<string>('#FFFFFF');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVCardData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const generateVCardString = (): string => {
        let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';

        if (vCardData.firstName || vCardData.lastName) {
            vcard += `FN:${vCardData.firstName} ${vCardData.lastName}\n`;
            vcard += `N:${vCardData.lastName};${vCardData.firstName};;;\n`;
        }

        if (vCardData.organization) {
            vcard += `ORG:${vCardData.organization}\n`;
        }

        if (vCardData.title) {
            vcard += `TITLE:${vCardData.title}\n`;
        }

        if (vCardData.phone) {
            vcard += `TEL:${vCardData.phone}\n`;
        }

        if (vCardData.email) {
            vcard += `EMAIL:${vCardData.email}\n`;
        }

        if (vCardData.website) {
            vcard += `URL:${vCardData.website}\n`;
        }

        if (vCardData.address || vCardData.city || vCardData.postalCode || vCardData.country) {
            vcard += `ADR:;;${vCardData.address};${vCardData.city};;${vCardData.postalCode};${vCardData.country}\n`;
        }

        vcard += 'END:VCARD';
        return vcard;
    };

    const handleGenerateVCard = async () => {
        if (!vCardData.firstName && !vCardData.lastName) return;

        setIsGenerating(true);

        // Animation du bouton pendant la génération
        const button = document.querySelector('.generate-button');
        if (button) {
            gsap.to(button, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
            });
        }

        try {
            const vCardString = generateVCardString();

            const qrCodeOptions: BaseOptions = {
                content: vCardString,
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
            };

            const qrCode = new QrCodeWithLogo(qrCodeOptions);
            const image = await qrCode.getImage();

            const img = new Image();
            img.src = image.src;
            const canvas = document.getElementById('vcardCanvas') as HTMLCanvasElement;
            canvas.width = 500;
            canvas.height = 500;
            const context = canvas.getContext('2d');

            img.onload = () => {
                if (context) {
                    context.drawImage(img, 0, 0, 500, 500);

                    // Animation du canvas après génération
                    gsap.fromTo(
                        canvas,
                        { scale: 0.8, opacity: 0, rotation: 5 },
                        {
                            scale: 1,
                            opacity: 1,
                            rotation: 0,
                            duration: 0.6,
                            ease: 'back.out(1.7)',
                        },
                    );

                    if (!hasGenerated) {
                        setHasGenerated(true);
                    }
                }
                setIsGenerating(false);
            };
        } catch (error) {
            console.error('Error generating VCard QR code:', error);
            setIsGenerating(false);
        }
    };

    // Animation on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true);

                        const tl = gsap.timeline({ delay: 0.2 });

                        tl.to(titleRef.current, {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: 'power2.out',
                        })
                            .to(
                                formRef.current,
                                {
                                    opacity: 1,
                                    x: 0,
                                    duration: 0.8,
                                    ease: 'power2.out',
                                },
                                '-=0.4',
                            )
                            .to(
                                canvasRef.current,
                                {
                                    opacity: 1,
                                    x: 0,
                                    duration: 0.8,
                                    ease: 'power2.out',
                                },
                                '-=0.6',
                            );

                        // Animation des champs du formulaire
                        const formFields = formRef.current?.querySelectorAll('.form-field');
                        if (formFields) {
                            gsap.fromTo(
                                formFields,
                                { opacity: 0, y: 20 },
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.5,
                                    stagger: 0.1,
                                    delay: 1,
                                    ease: 'power2.out',
                                },
                            );
                        }
                    }
                });
            },
            { threshold: 0.3, rootMargin: '0px 0px -100px 0px' },
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [isVisible]);

    // Set initial state
    useEffect(() => {
        gsap.set([titleRef.current], {
            opacity: 0,
            y: 50,
        });

        gsap.set([formRef.current], {
            opacity: 0,
            x: -50,
        });

        gsap.set([canvasRef.current], {
            opacity: 0,
            x: 50,
        });

        // Set initial state for form fields
        const formFields = document.querySelectorAll('.form-field');
        gsap.set(formFields, { opacity: 0, y: 20 });
    }, []);

    // Animation pour le téléchargement du QR code
    const handleDownloadVCard = () => {
        const canvas = document.getElementById('vcardCanvas') as HTMLCanvasElement;
        if (canvas && hasGenerated) {
            // Animation du canvas
            gsap.to(canvas, {
                scale: 1.05,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut',
            });

            // Télécharger l'image
            const link = document.createElement('a');
            link.download = 'vcard-qrcode.png';
            link.href = canvas.toDataURL();
            link.click();
        }
    };

    const isFormValid = vCardData.firstName.trim() || vCardData.lastName.trim();

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen bg-linear-to-br from-slate-900 via-blue-900/20 to-purple-900/30 py-12"
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%),
                                     radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`,
                    }}
                />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                {/* Title Section */}
                <div ref={titleRef} className="mb-8 text-center">
                    <h2 className="mb-3 font-bold text-3xl text-white md:text-4xl">Générateur de VCard</h2>
                    <div className="mx-auto mb-3 h-1 w-20 rounded-full bg-linear-to-r from-blue-500 to-purple-600" />
                    <p className="text-gray-300 text-lg">Créez un QR code de carte de visite numérique</p>
                </div>

                <div className="grid items-start gap-8 lg:grid-cols-2">
                    {/* Form Section */}
                    <div
                        ref={formRef}
                        className="rounded-3xl border border-white/20 bg-linear-to-br from-white/10 via-white/8 to-white/5 p-6 shadow-2xl backdrop-blur-md md:p-8"
                    >
                        <h3 className="mb-6 flex items-center gap-2 font-bold text-white text-xl">
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6 text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            Informations personnelles
                        </h3>

                        <form className="space-y-5">
                            {/* Name Fields */}
                            <div className="form-field grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label htmlFor="firstName" className="mb-2 block font-medium text-gray-200 text-sm">
                                        Prénom *
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={vCardData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="mb-2 block font-medium text-gray-200 text-sm">
                                        Nom *
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={vCardData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            {/* Professional Info */}
                            <div className="form-field grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="organization"
                                        className="mb-2 block font-medium text-gray-200 text-sm"
                                    >
                                        Entreprise
                                    </label>
                                    <input
                                        type="text"
                                        id="organization"
                                        name="organization"
                                        value={vCardData.organization}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        placeholder="Mon Entreprise"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="title" className="mb-2 block font-medium text-gray-200 text-sm">
                                        Titre/Poste
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={vCardData.title}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        placeholder="Développeur"
                                    />
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="form-field grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label htmlFor="phone" className="mb-2 block font-medium text-gray-200 text-sm">
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={vCardData.phone}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        placeholder="+33 6 12 34 56 78"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="mb-2 block font-medium text-gray-200 text-sm">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={vCardData.email}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        placeholder="john.doe@exemple.com"
                                    />
                                </div>
                            </div>

                            {/* Website */}
                            <div className="form-field">
                                <label htmlFor="website" className="mb-2 block font-medium text-gray-200 text-sm">
                                    Site web
                                </label>
                                <input
                                    type="url"
                                    id="website"
                                    name="website"
                                    value={vCardData.website}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    placeholder="https://monsite.com"
                                />
                            </div>

                            {/* Address */}
                            <div className="form-field">
                                <label htmlFor="address" className="mb-2 block font-medium text-gray-200 text-sm">
                                    Adresse
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={vCardData.address}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    placeholder="123 Rue de la Paix"
                                />
                            </div>

                            {/* City, Postal Code, Country */}
                            <div className="form-field grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <label htmlFor="city" className="mb-2 block font-medium text-gray-200 text-sm">
                                        Ville
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={vCardData.city}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        placeholder="Paris"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="postalCode"
                                        className="mb-2 block font-medium text-gray-200 text-sm"
                                    >
                                        Code postal
                                    </label>
                                    <input
                                        type="text"
                                        id="postalCode"
                                        name="postalCode"
                                        value={vCardData.postalCode}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        placeholder="75001"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="country" className="mb-2 block font-medium text-gray-200 text-sm">
                                        Pays
                                    </label>
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        value={vCardData.country}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        placeholder="France"
                                    />
                                </div>
                            </div>

                            {/* QR Code Customization Section */}
                            <div className="form-field border-white/20 border-t pt-5">
                                <h4 className="mb-4 flex items-center gap-2 font-semibold text-lg text-white">
                                    <svg
                                        aria-hidden="true"
                                        className="h-5 w-5 text-purple-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                                        />
                                    </svg>
                                    Personnalisation du QR Code
                                </h4>

                                {/* Logo Upload */}
                                <div className="mb-4">
                                    <label htmlFor="logo" className="mb-2 block font-medium text-gray-200 text-sm">
                                        Logo (optionnel)
                                    </label>
                                    <input
                                        type="file"
                                        id="logo"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-medium file:text-white file:transition-colors hover:file:bg-blue-700"
                                    />
                                </div>

                                {/* Dot Type and Color */}
                                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="dotType"
                                            className="mb-2 block font-medium text-gray-200 text-sm"
                                        >
                                            Type de point
                                        </label>
                                        <select
                                            id="dotType"
                                            value={dotType}
                                            onChange={(e) => setDotType(e.target.value)}
                                            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white transition-colors focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        >
                                            {dotTypes.map((type) => (
                                                <option key={type} value={type} className="bg-gray-800">
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="dotColor"
                                            className="mb-2 block font-medium text-gray-200 text-sm"
                                        >
                                            Couleur du point
                                        </label>
                                        <input
                                            type="color"
                                            id="dotColor"
                                            value={dotColor}
                                            onChange={(e) => setDotColor(e.target.value)}
                                            className="h-12 w-full cursor-pointer rounded-xl border border-white/20 bg-white/10 px-2 transition-colors focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        />
                                    </div>
                                </div>

                                {/* Corner Type and Color */}
                                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="cornerType"
                                            className="mb-2 block font-medium text-gray-200 text-sm"
                                        >
                                            Type de coin
                                        </label>
                                        <select
                                            id="cornerType"
                                            value={cornerType}
                                            onChange={(e) => setCornerType(e.target.value)}
                                            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white transition-colors focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        >
                                            {cornerTypes.map((type) => (
                                                <option key={type} value={type} className="bg-gray-800">
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="cornerColor"
                                            className="mb-2 block font-medium text-gray-200 text-sm"
                                        >
                                            Couleur du coin
                                        </label>
                                        <input
                                            type="color"
                                            id="cornerColor"
                                            value={cornerColor}
                                            onChange={(e) => setCornerColor(e.target.value)}
                                            className="h-12 w-full cursor-pointer rounded-xl border border-white/20 bg-white/10 px-2 transition-colors focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        />
                                    </div>
                                </div>

                                {/* Background Color */}
                                <div>
                                    <label
                                        htmlFor="lightColor"
                                        className="mb-2 block font-medium text-gray-200 text-sm"
                                    >
                                        Couleur de fond
                                    </label>
                                    <input
                                        type="color"
                                        id="lightColor"
                                        value={lightColor}
                                        onChange={(e) => setLightColor(e.target.value)}
                                        className="h-12 w-full cursor-pointer rounded-xl border border-white/20 bg-white/10 px-2 transition-colors focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                </div>
                            </div>

                            {/* Generate Button */}
                            <div className="pt-4">
                                <button
                                    type="button"
                                    onClick={handleGenerateVCard}
                                    disabled={!isFormValid || isGenerating}
                                    className="generate-button group relative flex w-full transform items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-500/25 disabled:scale-100 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700"
                                >
                                    <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-400 to-purple-400 opacity-0 blur transition-opacity duration-300 group-hover:opacity-30" />

                                    {isGenerating ? (
                                        <>
                                            <svg
                                                aria-hidden="true"
                                                className="relative z-10 h-5 w-5 animate-spin"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                />
                                            </svg>
                                            <span className="relative z-10">Génération...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                aria-hidden="true"
                                                className="relative z-10 h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                            <span className="relative z-10">Générer VCard</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* VCard Display Section */}
                    <div
                        ref={canvasRef}
                        className="rounded-3xl border border-white/20 bg-linear-to-br from-white/10 via-white/8 to-white/5 p-6 shadow-2xl backdrop-blur-md md:p-8"
                    >
                        <h3 className="mb-6 flex items-center gap-2 font-bold text-white text-xl">
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6 text-purple-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                            Aperçu
                        </h3>

                        <div className="flex justify-center">
                            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-inner">
                                <canvas
                                    id="vcardCanvas"
                                    className="h-auto max-w-full rounded-lg border border-white/10 shadow-lg"
                                />
                                {!isFormValid && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center text-gray-400">
                                            <svg
                                                aria-hidden="true"
                                                className="mx-auto mb-4 h-16 w-16 opacity-50"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                            <p className="text-sm">
                                                Entrez au moins un prénom ou un nom
                                                <br />
                                                pour générer votre VCard
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Download Button */}
                        {hasGenerated && (
                            <div className="mt-6 flex justify-center">
                                <button
                                    type="button"
                                    onClick={handleDownloadVCard}
                                    className="group relative flex transform items-center gap-2 rounded-2xl bg-linear-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-emerald-700 hover:shadow-green-500/25"
                                >
                                    <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-green-400 to-emerald-400 opacity-0 blur transition-opacity duration-300 group-hover:opacity-30" />
                                    <svg
                                        aria-hidden="true"
                                        className="relative z-10 h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    <span className="relative z-10">Télécharger</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
