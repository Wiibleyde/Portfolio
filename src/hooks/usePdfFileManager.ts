'use client';

import { gsap } from 'gsap';
import { PDFDocument, type PDFImage, RotationTypes } from 'pdf-lib';
import { useCallback, useState } from 'react';

// PDF.js is loaded via CDN script tag, define minimal interface
interface PdfjsLib {
    getDocument(src: ArrayBuffer | string): { promise: Promise<PdfjsDocument> };
    GlobalWorkerOptions: { workerSrc: string };
}

interface PdfjsDocument {
    numPages: number;
    getPage(num: number): Promise<PdfjsPage>;
}

interface PdfjsPage {
    getViewport(params: { scale: number }): { width: number; height: number };
    render(params: { canvasContext: CanvasRenderingContext2D | null; viewport: { width: number; height: number } }): {
        promise: Promise<void>;
    };
}

declare global {
    interface Window {
        pdfjsLib: PdfjsLib;
    }
}

export interface UploadedFile {
    id: string;
    file: File;
    name: string;
    preview?: string;
    pageCount?: number;
    rotation?: number;
    type: 'pdf' | 'image';
}

export interface UsePdfFileManagerReturn {
    files: UploadedFile[];
    isAssembling: boolean;
    dragOver: boolean;
    draggedFileId: string | null;
    dragOverFileId: string | null;
    handleFileUpload: (uploadedFiles: FileList | null) => Promise<void>;
    handleDrop: (e: React.DragEvent) => void;
    handleDragOver: (e: React.DragEvent) => void;
    handleDragLeave: (e: React.DragEvent) => void;
    handleDragEnter: (e: React.DragEvent) => void;
    removeFile: (id: string) => void;
    moveFile: (fromIndex: number, toIndex: number) => void;
    rotateFile: (fileId: string, direction: 'left' | 'right') => void;
    handleFileDragStart: (e: React.DragEvent, fileId: string) => void;
    handleFileDragEnd: (e: React.DragEvent, fileId: string) => void;
    handleFileDragOver: (e: React.DragEvent, fileId: string) => void;
    handleFileDragLeave: (e: React.DragEvent) => void;
    handleFileDrop: (e: React.DragEvent, targetFileId: string) => void;
    clearFiles: () => void;
    assemblePDFs: () => Promise<void>;
}

async function waitForPdfJs(): Promise<void> {
    while (!window.pdfjsLib) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
}

async function renderPdfPageToCanvas(pdfDoc: PdfjsDocument, pageNum: number, scale: number): Promise<string> {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: context, viewport }).promise;
    return canvas.toDataURL('image/png');
}

async function generatePreview(file: File): Promise<{ preview: string; pageCount: number; type: 'pdf' | 'image' }> {
    if (file.type.startsWith('image/')) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve({ preview: e.target?.result as string, pageCount: 1, type: 'image' });
            reader.readAsDataURL(file);
        });
    }

    try {
        await waitForPdfJs();

        const [arrayBuffer1, arrayBuffer2] = await Promise.all([file.arrayBuffer(), file.arrayBuffer()]);

        const pdfJsDoc = await window.pdfjsLib.getDocument(arrayBuffer1).promise;
        const preview = await renderPdfPageToCanvas(pdfJsDoc, 1, 0.5);

        const pdfLibDoc = await PDFDocument.load(arrayBuffer2);
        return { preview, pageCount: pdfLibDoc.getPageCount(), type: 'pdf' };
    } catch {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            return { preview: '', pageCount: pdf.getPageCount(), type: 'pdf' };
        } catch {
            return { preview: '', pageCount: 0, type: 'pdf' };
        }
    }
}

export async function renderAllPages(file: UploadedFile): Promise<string[]> {
    if (file.type === 'image') {
        return file.preview ? [file.preview] : [];
    }

    try {
        await waitForPdfJs();
        const arrayBuffer = await file.file.arrayBuffer();
        const pdfDoc = await window.pdfjsLib.getDocument(arrayBuffer).promise;
        const pages: string[] = [];
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            pages.push(await renderPdfPageToCanvas(pdfDoc, pageNum, 1.5));
        }
        return pages;
    } catch {
        return [];
    }
}

export function usePdfFileManager(): UsePdfFileManagerReturn {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isAssembling, setIsAssembling] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [draggedFileId, setDraggedFileId] = useState<string | null>(null);
    const [dragOverFileId, setDragOverFileId] = useState<string | null>(null);

    const handleFileUpload = useCallback(async (uploadedFiles: FileList | null) => {
        if (!uploadedFiles) return;

        const validFiles = Array.from(uploadedFiles).filter(
            (file) => file.type === 'application/pdf' || file.type.startsWith('image/'),
        );

        const loadingFiles: UploadedFile[] = validFiles.map((file) => ({
            id: crypto.randomUUID(),
            file,
            name: file.name,
            rotation: 0,
            type: file.type === 'application/pdf' ? 'pdf' : 'image',
        }));

        setFiles((prev) => [...prev, ...loadingFiles]);

        for (let i = 0; i < validFiles.length; i++) {
            const file = validFiles[i];
            const fileId = loadingFiles[i].id;
            try {
                const { preview, pageCount, type } = await generatePreview(file);
                setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, preview, pageCount, type } : f)));
            } catch (error) {
                console.error('Error processing file:', error);
            }
        }

        setTimeout(() => {
            const newFileElements = document.querySelectorAll('.file-item:last-child');
            gsap.fromTo(
                newFileElements,
                { opacity: 0, y: 20, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.1 },
            );
        }, 100);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOver(false);
            gsap.to(e.currentTarget, { scale: 1.02, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.inOut' });
            handleFileUpload(e.dataTransfer.files);
        },
        [handleFileUpload],
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false);
    }, []);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
    }, []);

    const removeFile = useCallback((id: string) => {
        const fileElement = document.querySelector(`[data-file-id="${id}"]`);
        if (fileElement) {
            gsap.to(fileElement, {
                opacity: 0,
                x: 20,
                scale: 0.8,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => setFiles((prev) => prev.filter((f) => f.id !== id)),
            });
        } else {
            setFiles((prev) => prev.filter((f) => f.id !== id));
        }
    }, []);

    const moveFile = useCallback((fromIndex: number, toIndex: number) => {
        setFiles((prev) => {
            const next = [...prev];
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            return next;
        });
        gsap.to(document.querySelectorAll('.file-item'), {
            y: -5,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            stagger: 0.05,
            ease: 'power2.inOut',
        });
    }, []);

    const rotateFile = useCallback((fileId: string, direction: 'left' | 'right') => {
        setFiles((prev) =>
            prev.map((file) => {
                if (file.id !== fileId) return file;
                const current = file.rotation || 0;
                const next = direction === 'right' ? (current + 90) % 360 : (current - 90 + 360) % 360;
                const el = document.querySelector(`[data-file-id="${fileId}"] .preview-image`);
                if (el) gsap.set(el, { rotation: next, duration: 0.3, ease: 'power2.out' });
                return { ...file, rotation: next };
            }),
        );
    }, []);

    const handleFileDragStart = useCallback((e: React.DragEvent, fileId: string) => {
        setDraggedFileId(fileId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', fileId);
        setTimeout(() => {
            const el = document.querySelector(`[data-file-id="${fileId}"]`);
            if (el) gsap.to(el, { opacity: 0.7, scale: 0.95, duration: 0.2, ease: 'power2.out' });
        }, 0);
    }, []);

    const handleFileDragEnd = useCallback((_e: React.DragEvent, fileId: string) => {
        setDraggedFileId(null);
        setDragOverFileId(null);
        const el = document.querySelector(`[data-file-id="${fileId}"]`);
        if (el) gsap.to(el, { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' });
    }, []);

    const handleFileDragOver = useCallback(
        (e: React.DragEvent, fileId: string) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (draggedFileId && draggedFileId !== fileId) setDragOverFileId(fileId);
        },
        [draggedFileId],
    );

    const handleFileDragLeave = useCallback((e: React.DragEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverFileId(null);
    }, []);

    const handleFileDrop = useCallback(
        (e: React.DragEvent, targetFileId: string) => {
            e.preventDefault();
            e.stopPropagation();
            const draggedId = e.dataTransfer.getData('text/plain');
            if (draggedId && draggedId !== targetFileId) {
                const from = files.findIndex((f) => f.id === draggedId);
                const to = files.findIndex((f) => f.id === targetFileId);
                if (from !== -1 && to !== -1) moveFile(from, to);
            }
            setDragOverFileId(null);
            setDraggedFileId(null);
        },
        [files, moveFile],
    );

    const clearFiles = useCallback(() => {
        gsap.to('.file-item', {
            opacity: 0,
            x: -50,
            duration: 0.3,
            stagger: 0.05,
            ease: 'power2.in',
            onComplete: () => setFiles([]),
        });
    }, []);

    const assemblePDFs = useCallback(async () => {
        if (files.length === 0) return;
        setIsAssembling(true);

        const button = document.querySelector('.assemble-button');
        if (button) gsap.to(button, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });

        try {
            const mergedPdf = await PDFDocument.create();

            for (const { file, rotation = 0, type } of files) {
                if (type === 'pdf') {
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await PDFDocument.load(arrayBuffer);
                    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                    for (const page of pages) {
                        if (rotation > 0) page.setRotation({ angle: rotation, type: RotationTypes.Degrees });
                        mergedPdf.addPage(page);
                    }
                } else {
                    const arrayBuffer = await file.arrayBuffer();
                    let image: PDFImage;

                    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                        image = await mergedPdf.embedJpg(arrayBuffer);
                    } else if (file.type === 'image/png') {
                        image = await mergedPdf.embedPng(arrayBuffer);
                    } else {
                        // Convert other image types to PNG via canvas
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const img = document.createElement('img') as HTMLImageElement;
                        await new Promise((resolve, reject) => {
                            img.onload = resolve;
                            img.onerror = reject;
                            img.src = URL.createObjectURL(file);
                        });
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx?.drawImage(img, 0, 0);
                        const pngBuffer = await new Promise<ArrayBuffer>((resolve) => {
                            canvas.toBlob((blob) => blob?.arrayBuffer().then(resolve), 'image/png');
                        });
                        image = await mergedPdf.embedPng(pngBuffer);
                        URL.revokeObjectURL(img.src);
                    }

                    const { width, height } = image.scale(1);
                    const page = mergedPdf.addPage([width, height]);

                    if (rotation > 0) {
                        const newW = rotation === 90 || rotation === 270 ? height : width;
                        const newH = rotation === 90 || rotation === 270 ? width : height;
                        page.setSize(newW, newH);
                        page.drawImage(image, {
                            x: (newW - width) / 2,
                            y: (newH - height) / 2,
                            width,
                            height,
                            rotate: { angle: rotation, type: RotationTypes.Degrees },
                        });
                    } else {
                        page.drawImage(image, { x: 0, y: 0, width, height });
                    }
                }
            }

            const pdfBytes = await mergedPdf.save();
            //@ts-expect-error Blob constructor accepts Uint8Array
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'assembled-document.pdf';
            link.click();
            URL.revokeObjectURL(url);

            gsap.to('.success-animation', { scale: 1.1, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.inOut' });
        } catch (error) {
            console.error('Error assembling PDFs:', error);
            alert("Erreur lors de l'assemblage des documents");
        } finally {
            setIsAssembling(false);
        }
    }, [files]);

    return {
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
        moveFile,
        rotateFile,
        handleFileDragStart,
        handleFileDragEnd,
        handleFileDragOver,
        handleFileDragLeave,
        handleFileDrop,
        clearFiles,
        assemblePDFs,
    };
}
