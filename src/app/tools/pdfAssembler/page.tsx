'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowRepeat, Download } from 'react-bootstrap-icons';
import { FileCard } from '@/components/tools/pdfAssembler/FileCard';
import { PreviewModal } from '@/components/tools/pdfAssembler/PreviewModal';
import { UploadZone } from '@/components/tools/pdfAssembler/UploadZone';
import { ToolPageLayout } from '@/components/tools/ToolPageLayout';
import type { UploadedFile } from '@/hooks/usePdfFileManager';
import { renderAllPages, usePdfFileManager } from '@/hooks/usePdfFileManager';

interface PreviewModalState {
    isOpen: boolean;
    file: UploadedFile | null;
    currentPage: number;
    totalPages: number;
    pageImages: string[];
}

const INITIAL_MODAL: PreviewModalState = { isOpen: false, file: null, currentPage: 1, totalPages: 0, pageImages: [] };

export default function PdfAssemblerPage() {
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

    const pageCount = files.reduce((sum, f) => sum + (f.pageCount || 0), 0);
    const totalSizeMb = (files.reduce((sum, f) => sum + f.file.size, 0) / 1024 / 1024).toFixed(1);

    return (
        <ToolPageLayout
            title="Assembleur PDF"
            description="Combinez plusieurs PDF et images en un seul document. Tout se passe dans votre navigateur : aucun fichier n'est envoyé."
        >
            <PreviewModal
                modal={previewModal}
                onClose={closePreviewModal}
                onNavigate={navigateModalPage}
                onPageChange={(page) => setPreviewModal((prev) => ({ ...prev, currentPage: page }))}
            />

            <UploadZone
                dragOver={dragOver}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onFileSelect={handleFileUpload}
            />

            {files.length > 0 && (
                <section className="mt-10">
                    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                        <h2 className="font-medium text-lg text-zinc-50">Documents ({files.length})</h2>
                        <p className="text-sm text-zinc-500">Glissez les cartes pour changer l&apos;ordre</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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

                    <div className="card mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-mono text-sm text-zinc-400">
                            {pageCount} page{pageCount > 1 ? 's' : ''} · {totalSizeMb} MB
                        </p>
                        <div className="flex gap-3">
                            <button type="button" onClick={clearFiles} className="btn btn-secondary">
                                Tout effacer
                            </button>
                            <span className="success-animation">
                                <button
                                    type="button"
                                    onClick={assemblePDFs}
                                    disabled={isAssembling}
                                    className="assemble-button btn btn-primary"
                                >
                                    {isAssembling ? (
                                        <ArrowRepeat className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Download className="h-4 w-4" />
                                    )}
                                    {isAssembling ? 'Assemblage...' : 'Assembler et télécharger'}
                                </button>
                            </span>
                        </div>
                    </div>
                </section>
            )}
        </ToolPageLayout>
    );
}
