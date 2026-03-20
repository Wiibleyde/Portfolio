'use client';
import { gsap } from 'gsap';
import QrCodeWithLogo from 'qrcode-with-logos';
import type { BaseOptions, CornerType, DotType } from 'qrcode-with-logos/types/src/core/types';
import { useEffect, useRef, useState } from 'react';
import { QrCodeOptionsPanel } from '@/components/tools/QrCodeOptionsPanel';
import { ToolPageLayout } from '@/components/tools/ToolPageLayout';
import { useQrCodeOptions } from '@/hooks/useQrCodeOptions';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function QrCodePage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [text, setText] = useState('');

    const qrOptions = useQrCodeOptions({
        dotType: 'dot',
        cornerType: 'circle',
        dotColor: '#000000',
        cornerColor: '#000000',
    });

    useScrollAnimation(containerRef, () => {
        const tl = gsap.timeline({ delay: 0.2 });
        tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
            .to(formRef.current, { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4')
            .to(canvasRef.current, { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6');

        const formFields = formRef.current?.querySelectorAll('.form-field');
        if (formFields) {
            gsap.fromTo(
                formFields,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 1, ease: 'power2.out' },
            );
        }
    });

    useEffect(() => {
        gsap.set(titleRef.current, { opacity: 0, y: 50 });
        gsap.set(formRef.current, { opacity: 0, x: -50 });
        gsap.set(canvasRef.current, { opacity: 0, x: 50 });
        gsap.set(document.querySelectorAll('.form-field'), { opacity: 0, y: 20 });
    }, []);

    const handleGenerateQrCode = async () => {
        if (!text.trim()) return;
        setIsGenerating(true);

        const button = document.querySelector('.generate-button');
        if (button) gsap.to(button, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });

        try {
            const qrCodeOptions: BaseOptions = {
                content: text,
                width: 900,
                nodeQrCodeOptions: { color: { light: qrOptions.lightColor } },
                dotsOptions: { type: qrOptions.dotType as DotType, color: qrOptions.dotColor },
                cornersOptions: { type: qrOptions.cornerType as CornerType, color: qrOptions.cornerColor },
                logo: qrOptions.logo ? { src: qrOptions.logo, logoRadius: 1 } : undefined,
            };

            const qrCode = new QrCodeWithLogo(qrCodeOptions);
            const image = await qrCode.getImage();

            const img = new Image();
            img.src = image.src;
            const canvas = document.getElementById('qrcodeCanvas') as HTMLCanvasElement;
            canvas.width = 500;
            canvas.height = 500;
            const context = canvas.getContext('2d');

            img.onload = () => {
                if (context) {
                    context.drawImage(img, 0, 0, 500, 500);
                    gsap.fromTo(
                        canvas,
                        { scale: 0.8, opacity: 0, rotation: 5 },
                        { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.7)' },
                    );
                    if (!hasGenerated) setHasGenerated(true);
                }
                setIsGenerating(false);
            };
        } catch (error) {
            console.error('Error generating QR code:', error);
            setIsGenerating(false);
        }
    };

    const handleDownloadQrCode = () => {
        const canvas = document.getElementById('qrcodeCanvas') as HTMLCanvasElement;
        if (canvas && hasGenerated) {
            gsap.to(canvas, { scale: 1.05, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.inOut' });
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = canvas.toDataURL();
            link.click();
        }
    };

    return (
        <ToolPageLayout>
            <div ref={containerRef} className="mx-auto max-w-7xl px-6">
                {/* Title */}
                <div ref={titleRef} className="mb-8 text-center">
                    <h2 className="mb-3 font-bold text-3xl text-white md:text-4xl">Générateur de QR Code</h2>
                    <div className="mx-auto mb-3 h-1 w-20 rounded-full bg-linear-to-r from-blue-500 to-purple-600" />
                    <p className="text-gray-300 text-lg">Créez des QR codes personnalisés avec logo et couleurs</p>
                </div>

                <div className="grid items-start gap-8 lg:grid-cols-2">
                    {/* Form */}
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
                                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                                />
                            </svg>
                            Configuration
                        </h3>

                        <form className="space-y-5">
                            <div className="form-field">
                                <label htmlFor="text" className="mb-2 block font-medium text-gray-200 text-sm">
                                    Texte/URL *
                                </label>
                                <input
                                    type="text"
                                    id="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    placeholder="https://example.com ou votre texte"
                                />
                            </div>

                            <QrCodeOptionsPanel options={qrOptions} />

                            <div className="pt-4">
                                <button
                                    type="button"
                                    onClick={handleGenerateQrCode}
                                    disabled={!text.trim() || isGenerating}
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
                                                    d="M12 4v16m8-8H4"
                                                />
                                            </svg>
                                            <span className="relative z-10">Générer QR Code</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preview */}
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
                                    id="qrcodeCanvas"
                                    className="h-auto max-w-full rounded-lg border border-white/10 shadow-lg"
                                />
                                {!text && (
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
                                                    d="M12 4v16m8-8H4"
                                                />
                                            </svg>
                                            <p className="text-sm">
                                                Entrez du texte ou une URL
                                                <br />
                                                pour générer votre QR code
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {hasGenerated && (
                            <div className="mt-6 flex justify-center">
                                <button
                                    type="button"
                                    onClick={handleDownloadQrCode}
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
        </ToolPageLayout>
    );
}
