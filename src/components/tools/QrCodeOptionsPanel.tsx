'use client';

import type { UseQrCodeOptionsReturn } from '@/hooks/useQrCodeOptions';
import { CORNER_TYPES, DOT_TYPES } from '@/lib/qrcode';

interface QrCodeOptionsPanelProps {
    options: UseQrCodeOptionsReturn;
}

export function QrCodeOptionsPanel({ options }: QrCodeOptionsPanelProps) {
    const {
        logo,
        dotType,
        cornerType,
        dotColor,
        cornerColor,
        lightColor,
        setDotType,
        setCornerType,
        setDotColor,
        setCornerColor,
        setLightColor,
        handleLogoChange,
    } = options;

    return (
        <div className="space-y-5">
            {/* Logo Upload */}
            <div>
                <label htmlFor="logo" className="mb-1.5 block text-sm text-zinc-300">
                    Logo (optionnel)
                </label>
                <input
                    type="file"
                    id="logo"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="input text-sm text-zinc-400 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:font-medium file:text-zinc-950"
                />
                {logo && <p className="mt-1.5 text-xs text-zinc-500">Logo chargé</p>}
            </div>

            {/* Dot Type and Color */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label htmlFor="dotType" className="mb-1.5 block text-sm text-zinc-300">
                        Type de point
                    </label>
                    <select id="dotType" value={dotType} onChange={(e) => setDotType(e.target.value)} className="input">
                        {DOT_TYPES.map((type) => (
                            <option key={type} value={type} className="bg-zinc-900">
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="dotColor" className="mb-1.5 block text-sm text-zinc-300">
                        Couleur des points
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            id="dotColor"
                            value={dotColor}
                            onChange={(e) => setDotColor(e.target.value)}
                            className="h-11 w-11 shrink-0 cursor-pointer rounded-lg border border-zinc-800 bg-transparent"
                        />
                        <input
                            type="text"
                            value={dotColor}
                            onChange={(e) => setDotColor(e.target.value)}
                            className="input flex-1 font-mono text-sm"
                            placeholder="#000000"
                        />
                    </div>
                </div>
            </div>

            {/* Corner Type and Color */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label htmlFor="cornerType" className="mb-1.5 block text-sm text-zinc-300">
                        Type de coin
                    </label>
                    <select
                        id="cornerType"
                        value={cornerType}
                        onChange={(e) => setCornerType(e.target.value)}
                        className="input"
                    >
                        {CORNER_TYPES.map((type) => (
                            <option key={type} value={type} className="bg-zinc-900">
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="cornerColor" className="mb-1.5 block text-sm text-zinc-300">
                        Couleur des coins
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            id="cornerColor"
                            value={cornerColor}
                            onChange={(e) => setCornerColor(e.target.value)}
                            className="h-11 w-11 shrink-0 cursor-pointer rounded-lg border border-zinc-800 bg-transparent"
                        />
                        <input
                            type="text"
                            value={cornerColor}
                            onChange={(e) => setCornerColor(e.target.value)}
                            className="input flex-1 font-mono text-sm"
                            placeholder="#000000"
                        />
                    </div>
                </div>
            </div>

            {/* Background Color */}
            <div>
                <label htmlFor="lightColor" className="mb-1.5 block text-sm text-zinc-300">
                    Couleur de fond
                </label>
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        id="lightColor"
                        value={lightColor}
                        onChange={(e) => setLightColor(e.target.value)}
                        className="h-11 w-11 shrink-0 cursor-pointer rounded-lg border border-zinc-800 bg-transparent"
                    />
                    <input
                        type="text"
                        value={lightColor}
                        onChange={(e) => setLightColor(e.target.value)}
                        className="input flex-1 font-mono text-sm"
                        placeholder="#FFFFFF"
                    />
                </div>
            </div>
        </div>
    );
}
