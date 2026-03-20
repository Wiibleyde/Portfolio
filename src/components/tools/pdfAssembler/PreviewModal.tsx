'use client';

import Image from 'next/image';
import type { UploadedFile } from '@/hooks/usePdfFileManager';

interface PreviewModalState {
    isOpen: boolean;
    file: UploadedFile | null;
    currentPage: number;
    totalPages: number;
    pageImages: string[];
}

interface PreviewModalProps {
    modal: PreviewModalState;
    onClose: () => void;
    onNavigate: (direction: 'prev' | 'next') => void;
    onPageChange: (page: number) => void;
}

export function PreviewModal({ modal, onClose, onNavigate, onPageChange }: PreviewModalProps) {
    if (!modal.isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/80 p-4 backdrop-blur-sm"
            onClick={handleBackdropClick}
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
            role="presentation"
        >
            <div
                className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-linear-to-br from-white/10 via-white/8 to-white/5 shadow-2xl backdrop-blur-md"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                role="presentation"
            >
                {/* Modal Header */}
                <div className="flex shrink-0 items-center justify-between border-white/20 border-b p-6">
                    <div>
                        <h3 className="mb-1 font-bold text-white text-xl">{modal.file?.name}</h3>
                        <p className="text-gray-400 text-sm">
                            Page {modal.currentPage} sur {modal.totalPages}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl p-2 text-gray-400 transition-all duration-200 hover:bg-white/10 hover:text-white"
                        aria-label="Fermer"
                    >
                        <svg
                            aria-hidden="true"
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <div className="flex-1 overflow-auto p-6">
                        {modal.pageImages.length > 0 ? (
                            <div className="flex h-full w-full items-center justify-center">
                                <Image
                                    src={modal.pageImages[modal.currentPage - 1]}
                                    alt={`Page ${modal.currentPage} de ${modal.file?.name}`}
                                    width={800}
                                    height={1000}
                                    className="rounded-xl object-contain shadow-lg"
                                    style={{
                                        transform: `rotate(${modal.file?.rotation || 0}deg)`,
                                        transformOrigin: 'center center',
                                        maxWidth: 'none',
                                        maxHeight: 'none',
                                        width: 'auto',
                                        height: 'auto',
                                        minWidth: '100%',
                                        minHeight: '100%',
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center p-12">
                                <div className="mb-4 animate-spin">
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
                                <p className="text-gray-400">Chargement du document...</p>
                            </div>
                        )}
                    </div>

                    {/* Navigation Controls */}
                    {modal.totalPages > 1 && (
                        <div className="flex shrink-0 items-center justify-between border-white/20 border-t p-6">
                            <button
                                type="button"
                                onClick={() => onNavigate('prev')}
                                disabled={modal.currentPage === 1}
                                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-600"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                Précédent
                            </button>

                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 text-sm">Page</span>
                                <input
                                    type="number"
                                    min="1"
                                    max={modal.totalPages}
                                    value={modal.currentPage}
                                    onChange={(e) => {
                                        const page = Number.parseInt(e.target.value, 10);
                                        if (page >= 1 && page <= modal.totalPages) onPageChange(page);
                                    }}
                                    className="w-16 rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-center text-sm text-white"
                                />
                                <span className="text-gray-400 text-sm">/ {modal.totalPages}</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => onNavigate('next')}
                                disabled={modal.currentPage === modal.totalPages}
                                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-600"
                            >
                                Suivant
                                <svg
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
