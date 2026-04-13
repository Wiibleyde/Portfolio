'use client';

import { gsap } from 'gsap';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FileCard } from '@/components/tools/pdfAssembler/FileCard';
import { PreviewModal } from '@/components/tools/pdfAssembler/PreviewModal';
import { UploadZone } from '@/components/tools/pdfAssembler/UploadZone';
import { ToolPageLayout } from '@/components/tools/ToolPageLayout';
import type { UploadedFile } from '@/hooks/usePdfFileManager';
import { renderAllPages, usePdfFileManager } from '@/hooks/usePdfFileManager';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface PreviewModalState {
    isOpen: boolean;
    file: UploadedFile | null;
    currentPage: number;
    totalPages: number;
    pageImages: string[];
}

const INITIAL_MODAL: PreviewModalState = { isOpen: false, file: null, currentPage: 1, totalPages: 0, pageImages: [] };

export default function PdfAssemblerPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const uploadRef = useRef<HTMLDivElement>(null);
    const fileListRef = useRef<HTMLDivElement>(null);
    const [previewModal, setPreviewModal] = useState<PreviewModalState>(INITIAL_MODAL);

    const {
        files,
        isAssembling,
        dragOver,
        draggedFileId,
        dragOverFileId,
        handleFileUpload,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        handleDragEnter,
        removeFile,
        rotateFile,
        handleFileDragStart,
        handleFileDragEnd,
        handleFileDragOver,
        handleFileDragLeave,
        handleFileDrop,
        clearFiles,
        assemblePDFs,
    } = usePdfFileManager();

    // Load PDF.js dynamically
    useEffect(() => {
        if (!window.pdfjsLib) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            };
            document.head.appendChild(script);
        }
    }, []);

    useScrollAnimation(containerRef, () => {
        const tl = gsap.timeline({ delay: 0.2 });
        tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }).to(
            uploadRef.current,
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            '-=0.4',
        );
        if (files.length > 0) {
            tl.to(fileListRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6');
        }
    });

    useEffect(() => {
        gsap.set([titleRef.current, uploadRef.current], { opacity: 0, y: 50 });
        if (fileListRef.current) gsap.set(fileListRef.current, { opacity: 0, y: 30 });
    }, []);

    useEffect(() => {
        if (files.length > 0) {
            gsap.to(fileListRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
            gsap.fromTo(
                '.file-item',
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
            );
        }
    }, [files.length]);

    const openPreviewModal = useCallback(async (file: UploadedFile) => {
        document.body.style.overflow = 'hidden';
        setPreviewModal({ isOpen: true, file, currentPage: 1, totalPages: file.pageCount || 0, pageImages: [] });
        const pageImages = await renderAllPages(file);
        setPreviewModal((prev) => ({ ...prev, pageImages, totalPages: pageImages.length }));
    }, []);

    const closePreviewModal = useCallback(() => {
        document.body.style.overflow = 'unset';
        setPreviewModal(INITIAL_MODAL);
    }, []);

    const navigateModalPage = useCallback((direction: 'prev' | 'next') => {
        setPreviewModal((prev) => {
            if (direction === 'prev' && prev.currentPage > 1) return { ...prev, currentPage: prev.currentPage - 1 };
            if (direction === 'next' && prev.currentPage < prev.totalPages)
                return { ...prev, currentPage: prev.currentPage + 1 };
            return prev;
        });
    }, []);

    // Restore scroll on unmount
    useEffect(
        () => () => {
            document.body.style.overflow = 'unset';
        },
        [],
    );

    return (
        <ToolPageLayout>
            <PreviewModal
                modal={previewModal}
                onClose={closePreviewModal}
                onNavigate={navigateModalPage}
                onPageChange={(page) => setPreviewModal((prev) => ({ ...prev, currentPage: page }))}
            />

            <div className="mx-auto max-w-5xl px-6">
                {/* Title */}
                <div ref={titleRef} className="mb-8 text-center">
                    <h2 className="mb-3 font-bold text-3xl text-white md:text-4xl">Assembleur PDF</h2>
                    <div className="mx-auto mb-3 h-1 w-20 rounded-full bg-linear-to-r from-blue-500 to-purple-600" />
                    <p className="text-gray-300 text-lg">Combinez plusieurs fichiers PDF en un seul document</p>
                </div>

                {/* Upload Zone */}
                <div ref={uploadRef} className="mb-8">
                    <UploadZone
                        dragOver={dragOver}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onFileSelect={handleFileUpload}
                    />
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div ref={fileListRef} className="mb-8">
                        <div className="rounded-3xl border border-white/20 bg-linear-to-br from-white/10 via-white/8 to-white/5 p-6 shadow-2xl backdrop-blur-md md:p-8">
                            <h3 className="mb-6 flex items-center gap-2 font-bold text-white text-xl">
                                <svg
                                    aria-hidden="true"
                                    className="h-6 w-6 text-green-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                Documents à assembler ({files.length})
                                <div className="ml-2 flex gap-1">
                                    {files.filter((f) => f.type === 'pdf').length > 0 && (
                                        <span className="rounded-lg bg-red-500/20 px-2 py-1 font-medium text-red-300 text-xs">
                                            {files.filter((f) => f.type === 'pdf').length} PDF
                                        </span>
                                    )}
                                    {files.filter((f) => f.type === 'image').length > 0 && (
                                        <span className="rounded-lg bg-green-500/20 px-2 py-1 font-medium text-green-300 text-xs">
                                            {files.filter((f) => f.type === 'image').length} Image
                                            {files.filter((f) => f.type === 'image').length > 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            </h3>
                            <div className="mb-6 flex items-center gap-2 text-gray-400 text-sm">
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
                                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                                    />
                                </svg>
                                Glissez-déposez les cartes pour réorganiser • Les images seront converties en PDF
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {files.map((file, index) => (
                                    <FileCard
                                        key={file.id}
                                        file={file}
                                        index={index}
                                        isDragged={draggedFileId === file.id}
                                        isDragOver={dragOverFileId === file.id}
                                        onRemove={removeFile}
                                        onRotate={rotateFile}
                                        onPreview={openPreviewModal}
                                        onDragStart={handleFileDragStart}
                                        onDragEnd={handleFileDragEnd}
                                        onDragOver={handleFileDragOver}
                                        onDragLeave={handleFileDragLeave}
                                        onDrop={handleFileDrop}
                                    />
                                ))}
                            </div>

                            {/* Summary */}
                            <div className="mt-8 rounded-2xl border border-blue-400/30 bg-linear-to-r from-blue-500/15 to-purple-500/15 p-6 backdrop-blur-sm">
                                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-linear-to-br from-blue-500/30 to-purple-500/30 p-3">
                                            <svg
                                                aria-hidden="true"
                                                className="h-6 w-6 text-blue-200"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="mb-1 font-semibold text-white">Document final</h4>
                                            <p className="text-gray-400 text-sm">
                                                Prêt à être assemblé
                                                {files.some((f) => (f.rotation ?? 0) > 0) && (
                                                    <span className="text-orange-300"> • Rotations appliquées</span>
                                                )}
                                                {files.some((f) => f.type === 'image') && (
                                                    <span className="text-green-300"> • Images incluses</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-center">
                                        <div>
                                            <div className="font-bold text-2xl text-blue-300">
                                                {files.reduce((sum, f) => sum + (f.pageCount || 0), 0)}
                                            </div>
                                            <div className="text-gray-400 text-xs uppercase tracking-wide">Pages</div>
                                        </div>
                                        <div className="h-10 w-px bg-white/20" />
                                        <div>
                                            <div className="font-bold text-2xl text-purple-300">
                                                {(files.reduce((sum, f) => sum + f.file.size, 0) / 1024 / 1024).toFixed(
                                                    1,
                                                )}
                                            </div>
                                            <div className="text-gray-400 text-xs uppercase tracking-wide">MB</div>
                                        </div>
                                        {files.some((f) => (f.rotation ?? 0) > 0) && (
                                            <>
                                                <div className="h-10 w-px bg-white/20" />
                                                <div>
                                                    <div className="font-bold text-2xl text-orange-300">
                                                        {files.filter((f) => (f.rotation ?? 0) > 0).length}
                                                    </div>
                                                    <div className="text-gray-400 text-xs uppercase tracking-wide">
                                                        Rotations
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                {files.length > 0 ? (
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <button
                            type="button"
                            onClick={clearFiles}
                            className="group relative rounded-2xl border-2 border-white/30 px-6 py-3 font-medium text-gray-300 transition-all duration-300 hover:border-white/50 hover:bg-white/5"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <svg
                                    aria-hidden="true"
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                                Effacer tout
                            </span>
                        </button>
                        <div className="success-animation">
                            <button
                                type="button"
                                onClick={assemblePDFs}
                                disabled={isAssembling}
                                className="assemble-button group relative flex transform items-center gap-3 rounded-2xl bg-linear-to-r from-green-600 to-emerald-600 px-8 py-3 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-emerald-700 hover:shadow-green-500/25 disabled:scale-100 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700"
                            >
                                <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-green-400 to-emerald-400 opacity-0 blur transition-opacity duration-300 group-hover:opacity-30" />
                                {isAssembling ? (
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
                                        <span className="relative z-10">Assemblage...</span>
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
                                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        <span className="relative z-10">Assembler les PDF</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-6 text-center">
                        <div className="inline-flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-500/20 px-4 py-2 text-amber-300">
                            <svg
                                aria-hidden="true"
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.598 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                            Ajoutez au moins un fichier (PDF ou image) pour pouvoir les assembler.
                        </div>
                    </div>
                )}
            </div>
        </ToolPageLayout>
    );
}
