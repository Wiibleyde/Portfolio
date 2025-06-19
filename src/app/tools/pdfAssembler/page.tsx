'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { gsap } from 'gsap';

interface UploadedFile {
    id: string;
    file: File;
    name: string;
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

    const handleFileUpload = useCallback((uploadedFiles: FileList | null) => {
        if (!uploadedFiles) return;

        const newFiles: UploadedFile[] = Array.from(uploadedFiles)
            .filter(file => file.type === 'application/pdf')
            .map(file => ({
                id: crypto.randomUUID(),
                file,
                name: file.name
            }));

        setFiles(prev => [...prev, ...newFiles]);

        // Animate new files
        setTimeout(() => {
            const newFileElements = document.querySelectorAll('.file-item:last-child');
            gsap.fromTo(newFileElements,
                { opacity: 0, x: -20, scale: 0.9 },
                { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
        }, 100);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
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
            ease: "power2.inOut"
        });

        handleFileUpload(e.dataTransfer.files);
    }, [handleFileUpload]);

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
                ease: "power2.in",
                onComplete: () => {
                    setFiles(prev => prev.filter(file => file.id !== id));
                }
            });
        } else {
            setFiles(prev => prev.filter(file => file.id !== id));
        }
    }, []);

    const moveFile = useCallback((fromIndex: number, toIndex: number) => {
        setFiles(prev => {
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
            ease: "power2.inOut"
        });
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
                repeat: 1
            });
        }

        try {
            const mergedPdf = await PDFDocument.create();

            for (const { file } of files) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                pages.forEach(page => mergedPdf.addPage(page));
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
                ease: "power2.inOut"
            });

        } catch (error) {
            console.error('Error assembling PDFs:', error);
            alert('Erreur lors de l\'assemblage des PDF');
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
                            ease: "power2.out"
                        })
                            .to(uploadRef.current, {
                                opacity: 1,
                                y: 0,
                                duration: 0.8,
                                ease: "power2.out"
                            }, "-=0.4");

                        if (files.length > 0) {
                            tl.to(fileListRef.current, {
                                opacity: 1,
                                y: 0,
                                duration: 0.8,
                                ease: "power2.out"
                            }, "-=0.6");
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
            y: 50
        });

        if (fileListRef.current) {
            gsap.set(fileListRef.current, {
                opacity: 0,
                y: 30
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
                ease: "power2.out"
            });

            // Animate individual file items
            const fileElements = document.querySelectorAll('.file-item');
            gsap.fromTo(fileElements,
                { opacity: 0, x: -20 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "power2.out"
                }
            );
        }
    }, [files.length, isVisible]);

    return (
        <div ref={containerRef} className="min-h-screen relative bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/30 py-12">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), 
                                     radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`
                }}></div>
            </div>

            <div className="relative z-10 px-6 max-w-4xl mx-auto">
                {/* Title Section */}
                <div ref={titleRef} className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Assembleur PDF
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-3"></div>
                    <p className="text-gray-300 text-lg">
                        Combinez plusieurs fichiers PDF en un seul document
                    </p>
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
                            <svg className="mx-auto h-16 w-16 text-blue-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Glissez-déposez vos fichiers PDF ici
                        </h3>
                        <p className="text-gray-300 mb-4">ou</p>
                        <label className="group relative inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-2xl cursor-pointer transition-all duration-300 shadow-xl hover:shadow-blue-500/25 transform hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                            <span className="relative z-10 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Sélectionner des fichiers
                            </span>
                            <input
                                type="file"
                                multiple
                                accept=".pdf,application/pdf"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e.target.files)}
                            />
                        </label>
                        <p className="text-sm text-gray-400 mt-3">
                            Sélectionnez plusieurs fichiers PDF à la fois
                        </p>
                    </div>
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div ref={fileListRef} className="mb-8">
                        <div className="bg-gradient-to-br from-white/10 via-white/8 to-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Fichiers à assembler ({files.length})
                            </h3>
                            <div className="space-y-3">
                                {files.map((file, index) => (
                                    <div
                                        key={file.id}
                                        data-file-id={file.id}
                                        className="file-item flex items-center justify-between bg-white/10 border border-white/20 p-4 rounded-2xl backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-xl border border-blue-400/30">
                                                <span className="text-sm font-bold text-blue-300">#{index + 1}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-white block">{file.name}</span>
                                                <span className="text-sm text-gray-400">
                                                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {index > 0 && (
                                                <button
                                                    onClick={() => moveFile(index, index - 1)}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                                                    title="Monter"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                    </svg>
                                                </button>
                                            )}
                                            {index < files.length - 1 && (
                                                <button
                                                    onClick={() => moveFile(index, index + 1)}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                                                    title="Descendre"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => removeFile(file.id)}
                                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                                                title="Supprimer"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
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
                                    ease: "power2.in",
                                    onComplete: () => setFiles([])
                                });
                            }}
                            className="group relative px-6 py-3 text-gray-300 border-2 border-white/30 rounded-2xl hover:border-white/50 hover:bg-white/5 transition-all duration-300 font-medium"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Effacer tout
                            </span>
                        </button>

                        <div className="success-animation">
                            <button
                                onClick={assemblePDFs}
                                disabled={isAssembling || files.length < 2}
                                className="assemble-button group relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-green-500/25 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>

                                {isAssembling ? (
                                    <>
                                        <svg className="w-5 h-5 relative z-10 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <span className="relative z-10">Assemblage...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="relative z-10">Assembler les PDF</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {files.length === 1 && (
                    <div className="text-center mt-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-400/30 rounded-xl text-amber-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.598 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            Ajoutez au moins un autre fichier PDF pour pouvoir les assembler.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}