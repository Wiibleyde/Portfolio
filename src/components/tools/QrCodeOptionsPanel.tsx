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
            <div className="form-field">
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
                {logo && <p className="mt-1 text-gray-400 text-xs">Logo chargé ✓</p>}
            </div>

            {/* Dot Type and Color */}
            <div className="form-field grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label htmlFor="dotType" className="mb-2 block font-medium text-gray-200 text-sm">
                        Type de point
                    </label>
                    <select
                        id="dotType"
                        value={dotType}
                        onChange={(e) => setDotType(e.target.value)}
                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white transition-colors focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    >
                        {DOT_TYPES.map((type) => (
                            <option key={type} value={type} className="bg-gray-800">
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="dotColor" className="mb-2 block font-medium text-gray-200 text-sm">
                        Couleur des points
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            id="dotColor"
                            value={dotColor}
                            onChange={(e) => setDotColor(e.target.value)}
                            className="h-12 w-12 cursor-pointer rounded-xl border border-white/20 bg-transparent"
                        />
                        <input
                            type="text"
                            value={dotColor}
                            onChange={(e) => setDotColor(e.target.value)}
                            className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-mono text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                            placeholder="#000000"
                        />
                    </div>
                </div>
            </div>

            {/* Corner Type and Color */}
            <div className="form-field grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label htmlFor="cornerType" className="mb-2 block font-medium text-gray-200 text-sm">
                        Type de coin
                    </label>
                    <select
                        id="cornerType"
                        value={cornerType}
                        onChange={(e) => setCornerType(e.target.value)}
                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white transition-colors focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    >
                        {CORNER_TYPES.map((type) => (
                            <option key={type} value={type} className="bg-gray-800">
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="cornerColor" className="mb-2 block font-medium text-gray-200 text-sm">
                        Couleur des coins
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            id="cornerColor"
                            value={cornerColor}
                            onChange={(e) => setCornerColor(e.target.value)}
                            className="h-12 w-12 cursor-pointer rounded-xl border border-white/20 bg-transparent"
                        />
                        <input
                            type="text"
                            value={cornerColor}
                            onChange={(e) => setCornerColor(e.target.value)}
                            className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-mono text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                            placeholder="#000000"
                        />
                    </div>
                </div>
            </div>

            {/* Background Color */}
            <div className="form-field">
                <label htmlFor="lightColor" className="mb-2 block font-medium text-gray-200 text-sm">
                    Couleur de fond
                </label>
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        id="lightColor"
                        value={lightColor}
                        onChange={(e) => setLightColor(e.target.value)}
                        className="h-12 w-12 cursor-pointer rounded-xl border border-white/20 bg-transparent"
                    />
                    <input
                        type="text"
                        value={lightColor}
                        onChange={(e) => setLightColor(e.target.value)}
                        className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-mono text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="#FFFFFF"
                    />
                </div>
            </div>
        </div>
    );
}
