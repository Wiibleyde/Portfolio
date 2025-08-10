'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { PDFDocument, RotationTypes } from 'pdf-lib';
import { gsap } from 'gsap';
import Image from 'next/image';

// Add PDF.js import
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdfjsLib: any;
    }
}

interface UploadedFile {
    id: string;
    file: File;
    name: string;
    preview?: string;
    pageCount?: number;
    rotation?: number; // Add rotation property (0, 90, 180, 270)
    type: 'pdf' | 'image'; // Add file type
}

export default function PdfAssemblerPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const uploadRef = useRef<HTMLDivElement>(null);
    const fileListRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isAssembling, setIsAssembling] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [draggedFileId, setDraggedFileId] = useState<string | null>(null);
    const [dragOverFileId, setDragOverFileId] = useState<string | null>(null);
    const [previewModal, setPreviewModal] = useState<{
        isOpen: boolean;
        file: UploadedFile | null;
        currentPage: number;
        totalPages: number;
        pageImages: string[];
    }>({
        isOpen: false,
        file: null,
        currentPage: 1,
        totalPages: 0,
        pageImages: [],
    });

    // Load PDF.js dynamically
    useEffect(() => {
        const loadPdfJs = async () => {
            if (!window.pdfjsLib) {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
                script.onload = () => {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                };
                document.head.appendChild(script);
            }
        };
        loadPdfJs();
    }, []);

    // Enhanced preview generation function
    const generatePreview = useCallback(async (file: File): Promise<{ preview: string; pageCount: number; type: 'pdf' | 'image' }> => {
        try {
            // Check if it's an image file
            if (file.type.startsWith('image/')) {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        resolve({
                            preview: e.target?.result as string,
                            pageCount: 1, // Images are always 1 page
                            type: 'image'
                        });
                    };
                    reader.readAsDataURL(file);
                });
            }

            // Wait for PDF.js to load for PDF files
            while (!window.pdfjsLib) {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }

            // Create separate ArrayBuffers to avoid detachment issues
            const arrayBuffer1 = await file.arrayBuffer();
            const arrayBuffer2 = await file.arrayBuffer();

            // Load PDF with PDF.js for rendering
            const loadingTask = window.pdfjsLib.getDocument(arrayBuffer1);
            const pdfDoc = await loadingTask.promise;

            // Get first page
            const page = await pdfDoc.getPage(1);
            const viewport = page.getViewport({ scale: 0.5 }); // Scale down for thumbnail

            // Create canvas
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page to canvas
            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };

            await page.render(renderContext).promise;

            // Get page count using pdf-lib with separate ArrayBuffer
            const pdfLibDoc = await PDFDocument.load(arrayBuffer2);
            const pageCount = pdfLibDoc.getPageCount();

            return {
                preview: canvas.toDataURL('image/png'),
                pageCount: pageCount,
                type: 'pdf'
            };
        } catch (error) {
            console.error('Error generating preview:', error);

            // Fallback for PDFs: just get page count without preview
            if (!file.type.startsWith('image/')) {
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await PDFDocument.load(arrayBuffer);
                    return {
                        preview: '',
                        pageCount: pdf.getPageCount(),
                        type: 'pdf'
                    };
                } catch (fallbackError) {
                    console.error('Fallback error:', fallbackError);
                    return {
                        preview: '',
                        pageCount: 0,
                        type: 'pdf'
                    };
                }
            }

            return {
                preview: '',
                pageCount: 1,
                type: 'image'
            };
        }
    }, []);

    const handleFileUpload = useCallback(
        async (uploadedFiles: FileList | null) => {
            if (!uploadedFiles) return;

            // Accept both PDF and image files
            const validFiles = Array.from(uploadedFiles).filter((file) =>
                file.type === 'application/pdf' || file.type.startsWith('image/')
            );

            // Show loading state
            const loadingFiles: UploadedFile[] = validFiles.map((file) => ({
                id: crypto.randomUUID(),
                file,
                name: file.name,
                rotation: 0, // Initialize rotation to 0
                type: file.type === 'application/pdf' ? 'pdf' : 'image',
            }));

            setFiles((prev) => [...prev, ...loadingFiles]);

            // Generate previews asynchronously
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

            // Animate new files
            setTimeout(() => {
                const newFileElements = document.querySelectorAll('.file-item:last-child');
                gsap.fromTo(
                    newFileElements,
                    { opacity: 0, y: 20, scale: 0.9 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.1 }
                );
            }, 100);
        },
        [generatePreview]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOver(false);

            // Animation for drop
            const uploadZone = e.currentTarget;
            gsap.to(uploadZone, {
                scale: 1.02,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut',
            });

            handleFileUpload(e.dataTransfer.files);
        },
        [handleFileUpload]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setDragOver(false);
        }
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
                onComplete: () => {
                    setFiles((prev) => prev.filter((file) => file.id !== id));
                },
            });
        } else {
            setFiles((prev) => prev.filter((file) => file.id !== id));
        }
    }, []);

    const moveFile = useCallback((fromIndex: number, toIndex: number) => {
        setFiles((prev) => {
            const newFiles = [...prev];
            const [moved] = newFiles.splice(fromIndex, 1);
            newFiles.splice(toIndex, 0, moved);
            return newFiles;
        });

        // Animate the reorder
        const fileElements = document.querySelectorAll('.file-item');
        gsap.to(fileElements, {
            y: -5,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            stagger: 0.05,
            ease: 'power2.inOut',
        });
    }, []);

    const handleFileDragStart = useCallback((e: React.DragEvent, fileId: string) => {
        setDraggedFileId(fileId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', fileId);

        // Add visual feedback
        setTimeout(() => {
            const draggedElement = document.querySelector(`[data-file-id="${fileId}"]`);
            if (draggedElement) {
                gsap.to(draggedElement, {
                    opacity: 0.7,
                    scale: 0.95,
                    duration: 0.2,
                    ease: 'power2.out',
                });
            }
        }, 0);
    }, []);

    const handleFileDragEnd = useCallback((e: React.DragEvent, fileId: string) => {
        setDraggedFileId(null);
        setDragOverFileId(null);

        // Reset visual feedback
        const draggedElement = document.querySelector(`[data-file-id="${fileId}"]`);
        if (draggedElement) {
            gsap.to(draggedElement, {
                opacity: 1,
                scale: 1,
                duration: 0.2,
                ease: 'power2.out',
            });
        }
    }, []);

    const handleFileDragOver = useCallback(
        (e: React.DragEvent, fileId: string) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            if (draggedFileId && draggedFileId !== fileId) {
                setDragOverFileId(fileId);
            }
        },
        [draggedFileId]
    );

    const handleFileDragLeave = useCallback((e: React.DragEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setDragOverFileId(null);
        }
    }, []);

    const handleFileDrop = useCallback(
        (e: React.DragEvent, targetFileId: string) => {
            e.preventDefault();
            e.stopPropagation();

            const draggedId = e.dataTransfer.getData('text/plain');

            if (draggedId && draggedId !== targetFileId) {
                const draggedIndex = files.findIndex((f) => f.id === draggedId);
                const targetIndex = files.findIndex((f) => f.id === targetFileId);

                if (draggedIndex !== -1 && targetIndex !== -1) {
                    moveFile(draggedIndex, targetIndex);
                }
            }

            setDragOverFileId(null);
            setDraggedFileId(null);
        },
        [files, moveFile]
    );

    const rotateFile = useCallback((fileId: string, direction: 'left' | 'right') => {
        setFiles((prev) =>
            prev.map((file) => {
                if (file.id === fileId) {
                    const currentRotation = file.rotation || 0;
                    const newRotation =
                        direction === 'right' ? (currentRotation + 90) % 360 : (currentRotation - 90 + 360) % 360;

                    // Animate rotation by setting the absolute value instead of incrementing
                    const fileElement = document.querySelector(`[data-file-id="${fileId}"] .preview-image`);
                    if (fileElement) {
                        gsap.set(fileElement, {
                            rotation: newRotation,
                            duration: 0.3,
                            ease: 'power2.out',
                        });
                    }

                    return { ...file, rotation: newRotation };
                }
                return file;
            })
        );
    }, []);

    const assemblePDFs = useCallback(async () => {
        if (files.length === 0) return;

        setIsAssembling(true);

        // Animation du bouton pendant l'assemblage
        const button = document.querySelector('.assemble-button');
        if (button) {
            gsap.to(button, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
            });
        }

        try {
            const mergedPdf = await PDFDocument.create();

            for (const { file, rotation = 0, type } of files) {
                if (type === 'pdf') {
                    // Handle PDF files
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await PDFDocument.load(arrayBuffer);
                    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

                    pages.forEach((page) => {
                        // Apply rotation if needed
                        if (rotation > 0) {
                            page.setRotation({ angle: rotation, type: RotationTypes.Degrees });
                        }
                        mergedPdf.addPage(page);
                    });
                } else if (type === 'image') {
                    // Handle image files
                    const arrayBuffer = await file.arrayBuffer();

                    let image;
                    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                        image = await mergedPdf.embedJpg(arrayBuffer);
                    } else if (file.type === 'image/png') {
                        image = await mergedPdf.embedPng(arrayBuffer);
                    } else {
                        // For other image types, convert to PNG first
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

                        const pngArrayBuffer = await new Promise<ArrayBuffer>((resolve) => {
                            canvas.toBlob((blob) => {
                                blob?.arrayBuffer().then(resolve);
                            }, 'image/png');
                        });

                        image = await mergedPdf.embedPng(pngArrayBuffer);
                        URL.revokeObjectURL(img.src);
                    }

                    // Create a page with the image
                    const { width, height } = image.scale(1);
                    const page = mergedPdf.addPage([width, height]);

                    // Apply rotation if needed
                    if (rotation > 0) {
                        // Calculate new dimensions after rotation
                        let newWidth = width;
                        let newHeight = height;

                        if (rotation === 90 || rotation === 270) {
                            newWidth = height;
                            newHeight = width;
                        }

                        // Set new page size
                        page.setSize(newWidth, newHeight);

                        // Draw the image with rotation
                        page.drawImage(image, {
                            x: (newWidth - width) / 2,
                            y: (newHeight - height) / 2,
                            width: width,
                            height: height,
                            rotate: { angle: rotation, type: RotationTypes.Degrees },
                        });
                    } else {
                        // Draw the image without rotation
                        page.drawImage(image, {
                            x: 0,
                            y: 0,
                            width: width,
                            height: height,
                        });
                    }
                }
            }

            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'assembled-document.pdf';
            link.click();

            URL.revokeObjectURL(url);

            // Animation de succès
            gsap.to('.success-animation', {
                scale: 1.1,
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut',
            });
        } catch (error) {
            console.error('Error assembling PDFs:', error);
            alert("Erreur lors de l'assemblage des documents");
        } finally {
            setIsAssembling(false);
        }
    }, [files]);

    // Animation on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true);

                        const tl = gsap.timeline({ delay: 0.2 });

                        tl.to(titleRef.current, {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: 'power2.out',
                        }).to(
                            uploadRef.current,
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.8,
                                ease: 'power2.out',
                            },
                            '-=0.4'
                        );

                        if (files.length > 0) {
                            tl.to(
                                fileListRef.current,
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.8,
                                    ease: 'power2.out',
                                },
                                '-=0.6'
                            );
                        }
                    }
                });
            },
            { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [isVisible, files.length]);

    // Set initial state
    useEffect(() => {
        gsap.set([titleRef.current, uploadRef.current], {
            opacity: 0,
            y: 50,
        });

        if (fileListRef.current) {
            gsap.set(fileListRef.current, {
                opacity: 0,
                y: 30,
            });
        }
    }, []);

    // Animate file list when files change
    useEffect(() => {
        if (files.length > 0 && isVisible) {
            gsap.to(fileListRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
            });

            // Animate individual file items
            const fileElements = document.querySelectorAll('.file-item');
            gsap.fromTo(
                fileElements,
                { opacity: 0, x: -20 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out',
                }
            );
        }
    }, [files.length, isVisible]);

    // New function to render all pages of a PDF or display image
    const renderAllPages = useCallback(async (file: UploadedFile): Promise<string[]> => {
        try {
            if (file.type === 'image') {
                // For images, just return the preview
                return file.preview ? [file.preview] : [];
            }

            // For PDFs, render all pages
            while (!window.pdfjsLib) {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }

            const arrayBuffer = await file.file.arrayBuffer();
            const loadingTask = window.pdfjsLib.getDocument(arrayBuffer);
            const pdfDoc = await loadingTask.promise;
            const pageImages: string[] = [];

            for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
                const page = await pdfDoc.getPage(pageNum);
                const viewport = page.getViewport({ scale: 1.5 });

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };

                await page.render(renderContext).promise;
                pageImages.push(canvas.toDataURL('image/png'));
            }

            return pageImages;
        } catch (error) {
            console.error('Error rendering all pages:', error);
            return [];
        }
    }, []);

    // Function to open preview modal
    const openPreviewModal = useCallback(
        async (file: UploadedFile) => {
            // Lock body scroll
            document.body.style.overflow = 'hidden';

            setPreviewModal({
                isOpen: true,
                file,
                currentPage: 1,
                totalPages: file.pageCount || 0,
                pageImages: [],
            });

            // Render all pages or display image
            const pageImages = await renderAllPages(file);
            setPreviewModal((prev) => ({
                ...prev,
                pageImages,
                totalPages: pageImages.length,
            }));
        },
        [renderAllPages]
    );

    // Function to close preview modal
    const closePreviewModal = useCallback(() => {
        // Restore body scroll
        document.body.style.overflow = 'unset';

        setPreviewModal({
            isOpen: false,
            file: null,
            currentPage: 1,
            totalPages: 0,
            pageImages: [],
        });
    }, []);

    // Function to handle backdrop click
    const handleBackdropClick = useCallback(
        (e: React.MouseEvent) => {
            if (e.target === e.currentTarget) {
                closePreviewModal();
            }
        },
        [closePreviewModal]
    );

    // Function to navigate pages in modal
    const navigateModalPage = useCallback((direction: 'prev' | 'next') => {
        setPreviewModal((prev) => {
            if (direction === 'prev' && prev.currentPage > 1) {
                return { ...prev, currentPage: prev.currentPage - 1 };
            } else if (direction === 'next' && prev.currentPage < prev.totalPages) {
                return { ...prev, currentPage: prev.currentPage + 1 };
            }
            return prev;
        });
    }, []);

    // Cleanup effect to restore scroll on unmount
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="min-h-screen relative bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/30 py-12"
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), 
                                     radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`,
                    }}
                ></div>
            </div>

            {/* Preview Modal */}
            {previewModal.isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-hidden"
                    onClick={handleBackdropClick}
                >
                    <div
                        className="relative bg-gradient-to-br from-white/10 via-white/8 to-white/5 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl max-w-4xl max-h-[90vh] w-full flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/20 flex-shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{previewModal.file?.name}</h3>
                                <p className="text-gray-400 text-sm">
                                    Page {previewModal.currentPage} sur {previewModal.totalPages}
                                </p>
                            </div>
                            <button
                                onClick={closePreviewModal}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                            {/* PDF Viewer */}
                            <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                                <div className="min-h-full min-w-full p-6">
                                    {previewModal.pageImages.length > 0 ? (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="relative inline-block">
                                                <Image
                                                    src={previewModal.pageImages[previewModal.currentPage - 1]}
                                                    alt={`Page ${previewModal.currentPage} de ${previewModal.file?.name}`}
                                                    width={800}
                                                    height={1000}
                                                    className="object-contain rounded-xl shadow-lg"
                                                    style={{
                                                        transform: `rotate(${previewModal.file?.rotation || 0}deg)`,
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
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center p-12">
                                            <div className="animate-spin mb-4">
                                                <svg
                                                    className="w-8 h-8 text-blue-400"
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
                            </div>

                            {/* Navigation Controls */}
                            {previewModal.totalPages > 1 && (
                                <div className="flex items-center justify-between p-6 border-t border-white/20 flex-shrink-0">
                                    <button
                                        onClick={() => navigateModalPage('prev')}
                                        disabled={previewModal.currentPage === 1}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                            max={previewModal.totalPages}
                                            value={previewModal.currentPage}
                                            onChange={(e) => {
                                                const page = parseInt(e.target.value);
                                                if (page >= 1 && page <= previewModal.totalPages) {
                                                    setPreviewModal((prev) => ({ ...prev, currentPage: page }));
                                                }
                                            }}
                                            className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-center text-sm"
                                        />
                                        <span className="text-gray-400 text-sm">/ {previewModal.totalPages}</span>
                                    </div>

                                    <button
                                        onClick={() => navigateModalPage('next')}
                                        disabled={previewModal.currentPage === previewModal.totalPages}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200"
                                    >
                                        Suivant
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            )}

            <div className="relative z-10 px-6 max-w-5xl mx-auto">
                {/* Title Section */}
                <div ref={titleRef} className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Assembleur PDF</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-3"></div>
                    <p className="text-gray-300 text-lg">Combinez plusieurs fichiers PDF en un seul document</p>
                </div>

                {/* Upload Zone */}
                <div ref={uploadRef} className="mb-8">
                    <div
                        className={`relative bg-gradient-to-br from-white/10 via-white/8 to-white/5 backdrop-blur-md rounded-3xl border-2 border-dashed transition-all duration-300 p-8 text-center shadow-2xl ${dragOver
                            ? 'border-blue-400 bg-blue-500/10 shadow-blue-500/25'
                            : 'border-white/30 hover:border-white/50'
                            }`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                    >
                        <div className="mb-4">
                            <svg
                                className="mx-auto h-16 w-16 text-blue-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                            >
                                <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Glissez-déposez vos fichiers ici</h3>
                        <p className="text-gray-300 mb-4">PDFs et images (JPEG, PNG, WebP, etc.)</p>
                        <label className="group relative inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-2xl cursor-pointer transition-all duration-300 shadow-xl hover:shadow-blue-500/25 transform hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                            <span className="relative z-10 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                Sélectionner des fichiers
                            </span>
                            <input
                                type="file"
                                multiple
                                accept=".pdf,application/pdf,image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e.target.files)}
                            />
                        </label>
                        <p className="text-sm text-gray-400 mt-3">Formats supportés : PDF, JPEG, PNG, WebP, GIF, BMP</p>
                    </div>
                </div>

                {/* Enhanced File List with Card Layout */}
                {files.length > 0 && (
                    <div ref={fileListRef} className="mb-8">
                        <div className="bg-gradient-to-br from-white/10 via-white/8 to-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <svg
                                    className="w-6 h-6 text-green-400"
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
                                    {files.filter(f => f.type === 'pdf').length > 0 && (
                                        <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded-lg text-xs font-medium">
                                            {files.filter(f => f.type === 'pdf').length} PDF
                                        </span>
                                    )}
                                    {files.filter(f => f.type === 'image').length > 0 && (
                                        <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-lg text-xs font-medium">
                                            {files.filter(f => f.type === 'image').length} Image{files.filter(f => f.type === 'image').length > 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            </h3>
                            <div className="text-sm text-gray-400 mb-6 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                                    />
                                </svg>
                                Glissez-déposez les cartes pour réorganiser • Les images seront converties en PDF
                            </div>

                            {/* Card Grid Layout */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {files.map((file, index) => (
                                    <div
                                        key={file.id}
                                        data-file-id={file.id}
                                        draggable
                                        onDragStart={(e) => handleFileDragStart(e, file.id)}
                                        onDragEnd={(e) => handleFileDragEnd(e, file.id)}
                                        onDragOver={(e) => handleFileDragOver(e, file.id)}
                                        onDragLeave={(e) => handleFileDragLeave(e)}
                                        onDrop={(e) => handleFileDrop(e, file.id)}
                                        className={`file-item group relative cursor-move transition-all duration-300 transform hover:scale-[1.02] ${draggedFileId === file.id
                                            ? 'scale-95 opacity-60 rotate-2'
                                            : dragOverFileId === file.id
                                                ? 'scale-105 rotate-1'
                                                : ''
                                            }`}
                                    >
                                        {/* Card Container */}
                                        <div
                                            className={`relative bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-sm rounded-2xl border transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl ${draggedFileId === file.id
                                                ? 'border-blue-400/70 bg-blue-500/10 shadow-blue-500/25'
                                                : dragOverFileId === file.id
                                                    ? 'border-green-400/70 bg-green-500/10 shadow-green-500/25'
                                                    : 'border-white/20 hover:border-white/40 hover:bg-white/20'
                                                }`}
                                        >
                                            {/* Card Header with Order Number */}
                                            <div className="relative p-4 pb-2">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500/40 to-purple-500/40 rounded-xl border border-blue-400/50 text-sm font-bold text-blue-200 shadow-lg">
                                                            #{index + 1}
                                                        </div>
                                                        {/* File Type Badge */}
                                                        <div className={`px-2 py-1 rounded-lg text-xs font-medium ${file.type === 'pdf'
                                                            ? 'bg-red-500/20 text-red-300 border border-red-400/30'
                                                            : 'bg-green-500/20 text-green-300 border border-green-400/30'
                                                            }`}>
                                                            {file.type === 'pdf' ? 'PDF' : 'IMG'}
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        {/* Rotation Controls */}
                                                        {file.type === 'pdf' && (
                                                            <>
                                                                <button
                                                                    onClick={() => rotateFile(file.id, 'left')}
                                                                    className="p-1.5 text-gray-400 hover:text-blue-300 rounded-lg hover:bg-blue-500/20 transition-all duration-200"
                                                                    title="Rotation 90° gauche"
                                                                >
                                                                    <svg
                                                                        className="w-4 h-4"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => rotateFile(file.id, 'right')}
                                                                    className="p-1.5 text-gray-400 hover:text-blue-300 rounded-lg hover:bg-blue-500/20 transition-all duration-200"
                                                                    title="Rotation 90° droite"
                                                                >
                                                                    <svg
                                                                        className="w-4 h-4"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </>
                                                        )}
                                                        <div className="w-px h-4 bg-white/20 mx-1"></div>
                                                        <div
                                                            className="p-1.5 text-gray-400 hover:text-gray-300 rounded-lg hover:bg-white/10 transition-all duration-200"
                                                            title="Drag to reorder"
                                                        >
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M4 8h16M4 16h16"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFile(file.id)}
                                                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                                                            title="Supprimer"
                                                        >
                                                            <svg
                                                                className="w-4 h-4"
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
                                                </div>

                                                {/* Preview */}
                                                <div className="relative mb-4">
                                                    <div
                                                        className={`w-full aspect-[3/4] rounded-xl border-2 shadow-lg overflow-hidden mx-auto max-w-[120px] cursor-pointer hover:border-blue-400 transition-all duration-200 group ${file.type === 'pdf' ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-300'
                                                            }`}
                                                        onClick={() => openPreviewModal(file)}
                                                        title="Cliquer pour prévisualiser le document"
                                                    >
                                                        {file.preview ? (
                                                            <>
                                                                <Image
                                                                    src={file.preview}
                                                                    alt={`Aperçu de ${file.name}`}
                                                                    width={120}
                                                                    height={160}
                                                                    className={`preview-image w-full h-full object-contain transition-all duration-300 group-hover:scale-105 ${file.type === 'pdf' ? 'bg-white' : 'bg-gray-50'
                                                                        }`}
                                                                    style={{
                                                                        transform: `rotate(${file.rotation || 0}deg)`,
                                                                        transformOrigin: 'center center',
                                                                    }}
                                                                />
                                                                {/* Preview Overlay */}
                                                                <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                                                    <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
                                                                        <svg
                                                                            className="w-4 h-4"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                            />
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                                                                <div className="animate-spin mb-2">
                                                                    <svg
                                                                        className="w-6 h-6 text-slate-500"
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
                                                                <span className="text-xs text-slate-500 font-medium text-center px-2">
                                                                    Génération
                                                                    <br />
                                                                    aperçu...
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Page Count Badge */}
                                                    {file.pageCount && file.type === 'pdf' && (
                                                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-2.5 py-1 rounded-full shadow-lg border-2 border-white/20 font-semibold">
                                                            {file.pageCount}p
                                                        </div>
                                                    )}

                                                    {/* Rotation Indicator */}
                                                    {(file.rotation ?? 0) > 0 && (
                                                        <div className="absolute -top-2 -left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full shadow-lg border-2 border-white/20 font-semibold flex items-center gap-1">
                                                            <svg
                                                                className="w-3 h-3"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
                                                                />
                                                            </svg>
                                                            {file.rotation}°
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Card Footer with File Info */}
                                            <div className="px-4 pb-4">
                                                <div className="text-center">
                                                    <div className="flex items-center justify-center gap-1 mb-2">
                                                        <h4
                                                            className="font-semibold text-white text-sm truncate group-hover:text-blue-200 transition-colors flex-1"
                                                            title={file.name}
                                                        >
                                                            {file.name}
                                                        </h4>
                                                        {(file.rotation ?? 0) > 0 && (
                                                            <div className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-md border border-orange-400/30 font-medium">
                                                                {file.rotation}°
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <svg
                                                                className="w-3 h-3"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                                                                />
                                                            </svg>
                                                            {(file.file.size / 1024 / 1024).toFixed(1)} MB
                                                        </span>
                                                        {file.pageCount && (
                                                            <span className="flex items-center gap-1">
                                                                <svg
                                                                    className="w-3 h-3"
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
                                                                {file.pageCount} page{file.pageCount > 1 ? 's' : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Drop Indicator Overlay */}
                                            {dragOverFileId === file.id && (
                                                <div className="absolute inset-0 bg-green-500/20 border-2 border-green-400 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                                    <div className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg flex items-center gap-2">
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                                            />
                                                        </svg>
                                                        Déposer ici
                                                    </div>
                                                </div>
                                            )}

                                            {/* Loading Overlay */}
                                            {!file.preview && !file.pageCount && (
                                                <div className="absolute inset-0 bg-blue-500/10 rounded-2xl border border-blue-400/30 flex items-center justify-center backdrop-blur-sm">
                                                    <div className="text-center">
                                                        <div className="animate-pulse mb-2">
                                                            <svg
                                                                className="w-6 h-6 text-blue-400 mx-auto"
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
                                                        </div>
                                                        <div className="text-xs text-blue-400 font-medium">
                                                            Traitement...
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary Card */}
                            <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-2xl border border-blue-400/30 backdrop-blur-sm">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl">
                                            <svg
                                                className="w-6 h-6 text-blue-200"
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
                                            <h4 className="text-white font-semibold mb-1">Document final</h4>
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
                                            <div className="text-2xl font-bold text-blue-300">
                                                {files.reduce((sum, file) => sum + (file.pageCount || 0), 0)}
                                            </div>
                                            <div className="text-xs text-gray-400 uppercase tracking-wide">Pages</div>
                                        </div>
                                        <div className="w-px h-10 bg-white/20"></div>
                                        <div>
                                            <div className="text-2xl font-bold text-purple-300">
                                                {(
                                                    files.reduce((sum, file) => sum + file.file.size, 0) /
                                                    1024 /
                                                    1024
                                                ).toFixed(1)}
                                            </div>
                                            <div className="text-xs text-gray-400 uppercase tracking-wide">MB</div>
                                        </div>
                                        {files.filter(f => f.type === 'image').length > 0 && (
                                            <>
                                                <div className="w-px h-10 bg-white/20"></div>
                                                <div>
                                                    <div className="text-2xl font-bold text-green-300">
                                                        {files.filter(f => f.type === 'image').length}
                                                    </div>
                                                    <div className="text-xs text-gray-400 uppercase tracking-wide">
                                                        Images
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {files.some((f) => (f.rotation ?? 0) > 0) && (
                                            <>
                                                <div className="w-px h-10 bg-white/20"></div>
                                                <div>
                                                    <div className="text-2xl font-bold text-orange-300">
                                                        {files.filter((f) => (f.rotation ?? 0) > 0).length}
                                                    </div>
                                                    <div className="text-xs text-gray-400 uppercase tracking-wide">
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
                {files.length > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <button
                            onClick={() => {
                                gsap.to('.file-item', {
                                    opacity: 0,
                                    x: -50,
                                    duration: 0.3,
                                    stagger: 0.05,
                                    ease: 'power2.in',
                                    onComplete: () => setFiles([]),
                                });
                            }}
                            className="group relative px-6 py-3 text-gray-300 border-2 border-white/30 rounded-2xl hover:border-white/50 hover:bg-white/5 transition-all duration-300 font-medium"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                onClick={assemblePDFs}
                                disabled={isAssembling}
                                className="assemble-button group relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-green-500/25 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>

                                {isAssembling ? (
                                    <>
                                        <svg
                                            className="w-5 h-5 relative z-10 animate-spin"
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
                                            className="w-5 h-5 relative z-10"
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
                )}

                {files.length === 0 && (
                    <div className="text-center mt-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-400/30 rounded-xl text-amber-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.598 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                            Ajoutez au moins un autre fichier (PDF ou image) pour pouvoir les assembler.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
