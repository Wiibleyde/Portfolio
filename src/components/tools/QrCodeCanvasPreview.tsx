'use client';
import { ArrowRepeat, Download } from 'react-bootstrap-icons';

interface QrCodeCanvasPreviewProps {
    canvasId: string;
    hasGenerated: boolean;
    isGenerating: boolean;
    onDownload: () => void;
    emptyHint: string;
}

export function QrCodeCanvasPreview({
    canvasId,
    hasGenerated,
    isGenerating,
    onDownload,
    emptyHint,
}: QrCodeCanvasPreviewProps) {
    return (
        <div className="card p-6 md:p-8">
            <h2 className="mb-6 font-medium text-lg text-zinc-50">Aperçu</h2>
            <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                <canvas
                    id={canvasId}
                    width={500}
                    height={500}
                    className={`h-full w-full transition-opacity duration-300 ${hasGenerated ? 'opacity-100' : 'opacity-0'}`}
                />
                {!hasGenerated && !isGenerating && (
                    <p className="absolute inset-0 flex items-center justify-center p-8 text-center text-sm text-zinc-500">
                        {emptyHint}
                    </p>
                )}
                {isGenerating && (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/60">
                        <ArrowRepeat className="h-6 w-6 animate-spin text-zinc-300" aria-label="Génération en cours" />
                    </div>
                )}
            </div>
            {hasGenerated && (
                <div className="mt-6 flex justify-center">
                    <button type="button" onClick={onDownload} className="btn btn-primary">
                        <Download className="h-4 w-4" />
                        Télécharger
                    </button>
                </div>
            )}
        </div>
    );
}
