'use client';

import Image from 'next/image';
import { ArrowRepeat, ChevronLeft, ChevronRight, X } from 'react-bootstrap-icons';
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
            role="dialog"
            aria-modal="true"
            aria-label="Prévisualisation du PDF"
        >
            <div className="relative flex max-h-[90dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
                <div className="flex shrink-0 items-center justify-between gap-4 border-zinc-800 border-b px-5 py-4">
                    <div className="min-w-0">
                        <h3 className="truncate font-medium text-zinc-100">{modal.file?.name}</h3>
                        <p className="font-mono text-xs text-zinc-500">
                            Page {modal.currentPage} sur {modal.totalPages}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-secondary px-2.5 py-1.5"
                        aria-label="Fermer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <div className="flex-1 overflow-auto bg-zinc-900 p-6">
                        {modal.pageImages.length > 0 ? (
                            <div className="flex h-full w-full items-center justify-center">
                                <Image
                                    src={modal.pageImages[modal.currentPage - 1]}
                                    alt={`Page ${modal.currentPage} de ${modal.file?.name}`}
                                    width={800}
                                    height={1000}
                                    className="rounded-md object-contain"
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
                            <div className="flex h-full w-full items-center justify-center gap-3 p-12 text-sm text-zinc-500">
                                <ArrowRepeat className="h-5 w-5 animate-spin" aria-hidden="true" />
                                Chargement du document...
                            </div>
                        )}
                    </div>

                    {modal.totalPages > 1 && (
                        <div className="flex shrink-0 items-center justify-between gap-3 border-zinc-800 border-t px-5 py-4">
                            <button
                                type="button"
                                onClick={() => onNavigate('prev')}
                                disabled={modal.currentPage === 1}
                                className="btn btn-secondary"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Précédent
                            </button>

                            <div className="flex items-center gap-2 text-sm text-zinc-500">
                                <span>Page</span>
                                <input
                                    type="number"
                                    min="1"
                                    max={modal.totalPages}
                                    value={modal.currentPage}
                                    onChange={(e) => {
                                        const page = Number.parseInt(e.target.value, 10);
                                        if (page >= 1 && page <= modal.totalPages) onPageChange(page);
                                    }}
                                    className="input w-16 px-2 py-1 text-center text-sm"
                                    aria-label="Numéro de page"
                                />
                                <span>/ {modal.totalPages}</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => onNavigate('next')}
                                disabled={modal.currentPage === modal.totalPages}
                                className="btn btn-secondary"
                            >
                                Suivant
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
