'use client';
import { useState } from 'react';
import { QrCodeCanvasPreview } from '@/components/tools/QrCodeCanvasPreview';
import { QrCodeOptionsPanel } from '@/components/tools/QrCodeOptionsPanel';
import { ToolPageLayout } from '@/components/tools/ToolPageLayout';
import { useQrCodeOptions } from '@/hooks/useQrCodeOptions';
import { renderQrCodeToCanvas } from '@/lib/qrcode';

const CANVAS_ID = 'qrcodeCanvas';

export default function QrCodePage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [text, setText] = useState('');

    const qrOptions = useQrCodeOptions({
        dotType: 'dot',
        cornerType: 'circle',
        dotColor: '#000000',
        cornerColor: '#000000',
    });

    const handleGenerateQrCode = async () => {
        if (!text.trim()) return;
        setIsGenerating(true);
        try {
            const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement;
            await renderQrCodeToCanvas(canvas, text, qrOptions);
            setHasGenerated(true);
        } catch (error) {
            console.error('Error generating QR code:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadQrCode = () => {
        const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement;
        if (!canvas || !hasGenerated) return;
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <ToolPageLayout
            title="Générateur de QR code"
            description="Créez des QR codes personnalisés avec logo et couleurs."
        >
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
                <form
                    className="card space-y-5 p-6 md:p-8"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleGenerateQrCode();
                    }}
                >
                    <h2 className="font-medium text-lg text-zinc-50">Configuration</h2>
                    <div>
                        <label htmlFor="text" className="mb-1.5 block text-sm text-zinc-300">
                            Texte ou URL
                        </label>
                        <input
                            type="text"
                            id="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="input"
                            placeholder="https://example.com ou votre texte"
                        />
                    </div>

                    <QrCodeOptionsPanel options={qrOptions} />

                    <button type="submit" disabled={!text.trim() || isGenerating} className="btn btn-primary w-full">
                        {isGenerating ? 'Génération...' : 'Générer le QR code'}
                    </button>
                </form>

                <QrCodeCanvasPreview
                    canvasId={CANVAS_ID}
                    hasGenerated={hasGenerated}
                    isGenerating={isGenerating}
                    onDownload={handleDownloadQrCode}
                    emptyHint="Entrez du texte ou une URL pour générer votre QR code."
                />
            </div>
        </ToolPageLayout>
    );
}
