'use client';

interface QrCodeCanvasPreviewProps {
    canvasId: string;
    hasGenerated: boolean;
    isGenerating: boolean;
    onDownload: () => void;
    downloadFileName: string;
}

export function QrCodeCanvasPreview({
    canvasId,
    hasGenerated,
    isGenerating,
    onDownload,
    downloadFileName,
}: QrCodeCanvasPreviewProps) {
    return (
        <div className="flex flex-col items-center gap-6">
            {/* Canvas container */}
            <div className="relative rounded-2xl border border-white/20 bg-white/5 p-4">
                {!hasGenerated && !isGenerating && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white/5">
                        <svg
                            aria-hidden="true"
                            className="mb-3 h-12 w-12 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                            />
                        </svg>
                        <p className="text-center text-gray-500 text-sm">
                            Votre QR code
                            <br />
                            apparaîtra ici
                        </p>
                    </div>
                )}
                {isGenerating && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/40 backdrop-blur-sm">
                        <div className="mb-3 animate-spin">
                            <svg
                                aria-hidden="true"
                                className="h-8 w-8 text-blue-400"
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
                        </div>
                        <p className="text-blue-300 text-sm">Génération en cours...</p>
                    </div>
                )}
                <canvas
                    id={canvasId}
                    width={500}
                    height={500}
                    className={`rounded-xl transition-opacity duration-300 ${hasGenerated ? 'opacity-100' : 'opacity-0'}`}
                    style={{ maxWidth: '100%' }}
                />
            </div>

            {/* Download button */}
            {hasGenerated && (
                <button
                    type="button"
                    onClick={onDownload}
                    className="group relative flex transform items-center gap-3 rounded-2xl bg-linear-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-emerald-700 hover:shadow-green-500/25"
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
                    <span className="relative z-10">Télécharger ({downloadFileName})</span>
                </button>
            )}
        </div>
    );
}
