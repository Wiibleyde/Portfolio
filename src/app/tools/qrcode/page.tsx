"use client"
import QrCodeWithLogo from 'qrcode-with-logos';
import { BaseOptions, CornerType, DotType } from "qrcode-with-logos/types/src/core/types";
import { useState, useEffect, useRef } from "react";
import { gsap } from 'gsap';

const dotTypes: DotType[] = ['dot', 'dot-small', 'tile', 'rounded', 'square', 'diamond', 'star', 'fluid', 'fluid-line', 'stripe', 'stripe-row', 'stripe-column'];
const cornerTypes: CornerType[] = ['square', 'rounded', 'circle', 'rounded-circle', 'circle-rounded', 'circle-star', 'circle-diamond'];

export default function VCardPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [text, setText] = useState<string>("")
    const [logo, setLogo] = useState<string>('')
    const [dotType, setDotType] = useState<string>('dot');
    const [cornerType, setCornerType] = useState<string>('circle');
    const [dotColor, setDotColor] = useState<string>('#000000');
    const [cornerColor, setCornerColor] = useState<string>('#000000');
    const [lightColor, setLightColor] = useState<string>('#FFFFFF');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        setText(value)
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

    const handleGenerateQrCode = async () => {
        if (!text.trim()) return;

        setIsGenerating(true);

        // Animation du bouton pendant la génération
        const button = document.querySelector('.generate-button');
        if (button) {
            gsap.to(button, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });
        }

        try {
            const qrCodeOptions: BaseOptions = {
                content: text,
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
            const image = await qrCode.getImage()

            const img = new Image()
            img.src = image.src
            const canvas = document.getElementById('qrcodeCanvas') as HTMLCanvasElement
            canvas.width = 500
            canvas.height = 500
            const context = canvas.getContext('2d')

            img.onload = () => {
                if (context) {
                    context.drawImage(img, 0, 0, 500, 500)

                    // Animation du canvas après génération
                    gsap.fromTo(canvas,
                        { scale: 0.8, opacity: 0, rotation: 5 },
                        {
                            scale: 1,
                            opacity: 1,
                            rotation: 0,
                            duration: 0.6,
                            ease: "back.out(1.7)"
                        }
                    );

                    if (!hasGenerated) {
                        setHasGenerated(true);
                    }
                }
                setIsGenerating(false);
            }
        } catch (error) {
            console.error('Error generating QR code:', error);
            setIsGenerating(false);
        }
    }

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
                            ease: "power2.out"
                        })
                            .to(formRef.current, {
                                opacity: 1,
                                x: 0,
                                duration: 0.8,
                                ease: "power2.out"
                            }, "-=0.4")
                            .to(canvasRef.current, {
                                opacity: 1,
                                x: 0,
                                duration: 0.8,
                                ease: "power2.out"
                            }, "-=0.6");

                        // Animation des champs du formulaire
                        const formFields = formRef.current?.querySelectorAll('.form-field');
                        if (formFields) {
                            gsap.fromTo(formFields,
                                { opacity: 0, y: 20 },
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.5,
                                    stagger: 0.1,
                                    delay: 1,
                                    ease: "power2.out"
                                }
                            );
                        }
                    }
                });
            },
            { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
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
            y: 50
        });

        gsap.set([formRef.current], {
            opacity: 0,
            x: -50
        });

        gsap.set([canvasRef.current], {
            opacity: 0,
            x: 50
        });

        // Set initial state for form fields
        const formFields = document.querySelectorAll('.form-field');
        gsap.set(formFields, { opacity: 0, y: 20 });
    }, []);

    // Animation pour le téléchargement du QR code
    const handleDownloadQrCode = () => {
        const canvas = document.getElementById('qrcodeCanvas') as HTMLCanvasElement;
        if (canvas && hasGenerated) {
            // Animation du canvas
            gsap.to(canvas, {
                scale: 1.05,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });

            // Télécharger l'image
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = canvas.toDataURL();
            link.click();
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen relative bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/30 py-12">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), 
                                     radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`
                }}></div>
            </div>

            <div className="relative z-10 px-6 max-w-7xl mx-auto">
                {/* Title Section */}
                <div ref={titleRef} className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Générateur de QR Code
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-3"></div>
                    <p className="text-gray-300 text-lg">
                        Créez des QR codes personnalisés avec logo et couleurs
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Form Section */}
                    <div ref={formRef} className="bg-gradient-to-br from-white/10 via-white/8 to-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                            </svg>
                            Configuration
                        </h3>

                        <form className="space-y-5">
                            {/* Text/URL Input */}
                            <div className="form-field">
                                <label htmlFor="text" className="block text-sm font-medium text-gray-200 mb-2">
                                    Texte/URL *
                                </label>
                                <input
                                    type="text"
                                    id="text"
                                    value={text}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                                    placeholder="https://example.com ou votre texte"
                                />
                            </div>

                            {/* Logo Upload */}
                            <div className="form-field">
                                <label htmlFor="logo" className="block text-sm font-medium text-gray-200 mb-2">
                                    Logo (optionnel)
                                </label>
                                <input
                                    type="file"
                                    id="logo"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-medium hover:file:bg-blue-700 file:transition-colors"
                                />
                            </div>

                            {/* Dot Type and Color */}
                            <div className="form-field grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="dotType" className="block text-sm font-medium text-gray-200 mb-2">
                                        Type de point
                                    </label>
                                    <select
                                        id="dotType"
                                        value={dotType}
                                        onChange={(e) => setDotType(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                                    >
                                        {dotTypes.map((type) => (
                                            <option key={type} value={type} className="bg-gray-800">
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="dotColor" className="block text-sm font-medium text-gray-200 mb-2">
                                        Couleur du point
                                    </label>
                                    <input
                                        type="color"
                                        id="dotColor"
                                        value={dotColor}
                                        onChange={(e) => setDotColor(e.target.value)}
                                        className="w-full h-12 px-2 bg-white/10 border border-white/20 rounded-xl cursor-pointer focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Corner Type and Color */}
                            <div className="form-field grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="cornerType" className="block text-sm font-medium text-gray-200 mb-2">
                                        Type de coin
                                    </label>
                                    <select
                                        id="cornerType"
                                        value={cornerType}
                                        onChange={(e) => setCornerType(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                                    >
                                        {cornerTypes.map((type) => (
                                            <option key={type} value={type} className="bg-gray-800">
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="cornerColor" className="block text-sm font-medium text-gray-200 mb-2">
                                        Couleur du coin
                                    </label>
                                    <input
                                        type="color"
                                        id="cornerColor"
                                        value={cornerColor}
                                        onChange={(e) => setCornerColor(e.target.value)}
                                        className="w-full h-12 px-2 bg-white/10 border border-white/20 rounded-xl cursor-pointer focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Background Color */}
                            <div className="form-field">
                                <label htmlFor="lightColor" className="block text-sm font-medium text-gray-200 mb-2">
                                    Couleur de fond
                                </label>
                                <input
                                    type="color"
                                    id="lightColor"
                                    value={lightColor}
                                    onChange={(e) => setLightColor(e.target.value)}
                                    className="w-full h-12 px-2 bg-white/10 border border-white/20 rounded-xl cursor-pointer focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                                />
                            </div>

                            {/* Generate Button */}
                            <div className="pt-4">
                                <button
                                    type="button"
                                    onClick={handleGenerateQrCode}
                                    disabled={!text.trim() || isGenerating}
                                    className="generate-button group relative w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>

                                    {isGenerating ? (
                                        <>
                                            <svg className="w-5 h-5 relative z-10 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            <span className="relative z-10">Génération...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <span className="relative z-10">Générer QR Code</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* QR Code Display Section */}
                    <div ref={canvasRef} className="bg-gradient-to-br from-white/10 via-white/8 to-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Aperçu
                        </h3>

                        <div className="flex justify-center">
                            <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 shadow-inner">
                                <canvas
                                    id="qrcodeCanvas"
                                    className="max-w-full h-auto rounded-lg shadow-lg border border-white/10"
                                />
                                {!text && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center text-gray-400">
                                            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <p className="text-sm">Entrez du texte ou une URL<br />pour générer votre QR code</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Download Button */}
                        {hasGenerated && (
                            <div className="mt-6 flex justify-center">
                                <button
                                    onClick={handleDownloadQrCode}
                                    className="group relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-green-500/25 transform hover:scale-105"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                    <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="relative z-10">Télécharger</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}