'use client';

import Image from 'next/image';
import type { UploadedFile } from '@/hooks/usePdfFileManager';

interface FileCardProps {
    file: UploadedFile;
    index: number;
    isDragged: boolean;
    isDragOver: boolean;
    onRemove: (id: string) => void;
    onRotate: (id: string, direction: 'left' | 'right') => void;
    onPreview: (file: UploadedFile) => void;
    onDragStart: (e: React.DragEvent, id: string) => void;
    onDragEnd: (e: React.DragEvent, id: string) => void;
    onDragOver: (e: React.DragEvent, id: string) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent, id: string) => void;
}

export function FileCard({
    file,
    index,
    isDragged,
    isDragOver,
    onRemove,
    onRotate,
    onPreview,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop,
}: FileCardProps) {
    return (
        // biome-ignore lint/a11y/noStaticElementInteractions: Draggable file card; keyboard reordering is handled via buttons within the card
        <div
            data-file-id={file.id}
            draggable
            onDragStart={(e) => onDragStart(e, file.id)}
            onDragEnd={(e) => onDragEnd(e, file.id)}
            onDragOver={(e) => onDragOver(e, file.id)}
            onDragLeave={(e) => onDragLeave(e)}
            onDrop={(e) => onDrop(e, file.id)}
            className={`file-item group relative transform cursor-move transition-all duration-300 hover:scale-[1.02] ${
                isDragged ? 'rotate-2 scale-95 opacity-60' : isDragOver ? 'rotate-1 scale-105' : ''
            }`}
        >
            <div
                className={`relative overflow-hidden rounded-2xl border bg-linear-to-br from-white/15 via-white/10 to-white/5 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl ${
                    isDragged
                        ? 'border-blue-400/70 bg-blue-500/10 shadow-blue-500/25'
                        : isDragOver
                          ? 'border-green-400/70 bg-green-500/10 shadow-green-500/25'
                          : 'border-white/20 hover:border-white/40 hover:bg-white/20'
                }`}
            >
                {/* Card Header */}
                <div className="relative p-4 pb-2">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-400/50 bg-linear-to-br from-blue-500/40 to-purple-500/40 font-bold text-blue-200 text-sm shadow-lg">
                                #{index + 1}
                            </div>
                            <div
                                className={`rounded-lg px-2 py-1 font-medium text-xs ${
                                    file.type === 'pdf'
                                        ? 'border border-red-400/30 bg-red-500/20 text-red-300'
                                        : 'border border-green-400/30 bg-green-500/20 text-green-300'
                                }`}
                            >
                                {file.type === 'pdf' ? 'PDF' : 'IMG'}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            {file.type === 'pdf' && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => onRotate(file.id, 'left')}
                                        className="rounded-lg p-1.5 text-gray-400 transition-all duration-200 hover:bg-blue-500/20 hover:text-blue-300"
                                        title="Rotation 90° gauche"
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
                                                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onRotate(file.id, 'right')}
                                        className="rounded-lg p-1.5 text-gray-400 transition-all duration-200 hover:bg-blue-500/20 hover:text-blue-300"
                                        title="Rotation 90° droite"
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
                                                d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
                                            />
                                        </svg>
                                    </button>
                                </>
                            )}
                            <div className="mx-1 h-4 w-px bg-white/20" />
                            <div
                                className="rounded-lg p-1.5 text-gray-400 transition-all duration-200 hover:bg-white/10 hover:text-gray-300"
                                title="Drag to reorder"
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
                                        d="M4 8h16M4 16h16"
                                    />
                                </svg>
                            </div>
                            <button
                                type="button"
                                onClick={() => onRemove(file.id)}
                                className="rounded-lg p-1.5 text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300"
                                title="Supprimer"
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
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="relative mb-4">
                        <button
                            type="button"
                            className={`group mx-auto block aspect-3/4 w-full max-w-30 cursor-pointer overflow-hidden rounded-xl border-2 shadow-lg transition-all duration-200 hover:border-blue-400 ${
                                file.type === 'pdf' ? 'border-gray-200 bg-white' : 'border-gray-300 bg-gray-100'
                            }`}
                            onClick={() => onPreview(file)}
                            title="Cliquer pour prévisualiser le document"
                        >
                            {file.preview ? (
                                <>
                                    <Image
                                        src={file.preview}
                                        alt={`Aperçu de ${file.name}`}
                                        width={120}
                                        height={160}
                                        className={`preview-image h-full w-full object-contain transition-all duration-300 group-hover:scale-105 ${
                                            file.type === 'pdf' ? 'bg-white' : 'bg-gray-50'
                                        }`}
                                        style={{
                                            transform: `rotate(${file.rotation || 0}deg)`,
                                            transformOrigin: 'center center',
                                        }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                        <div className="rounded-full bg-blue-600 p-2 text-white shadow-lg">
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
                                <div className="flex h-full w-full flex-col items-center justify-center bg-linear-to-br from-slate-100 to-slate-200">
                                    <div className="mb-2 animate-spin">
                                        <svg
                                            aria-hidden="true"
                                            className="h-6 w-6 text-slate-500"
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
                                    <span className="px-2 text-center font-medium text-slate-500 text-xs">
                                        Génération
                                        <br />
                                        aperçu...
                                    </span>
                                </div>
                            )}
                        </button>

                        {/* Page Count Badge */}
                        {file.pageCount && file.type === 'pdf' && (
                            <div className="-top-2 -right-2 absolute rounded-full border-2 border-white/20 bg-linear-to-r from-blue-600 to-purple-600 px-2.5 py-1 font-semibold text-white text-xs shadow-lg">
                                {file.pageCount}p
                            </div>
                        )}

                        {/* Rotation Indicator */}
                        {(file.rotation ?? 0) > 0 && (
                            <div className="-top-2 -left-2 absolute flex items-center gap-1 rounded-full border-2 border-white/20 bg-linear-to-r from-orange-500 to-red-500 px-2 py-1 font-semibold text-white text-xs shadow-lg">
                                <svg
                                    aria-hidden="true"
                                    className="h-3 w-3"
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

                {/* Card Footer */}
                <div className="px-4 pb-4">
                    <div className="text-center">
                        <div className="mb-2 flex items-center justify-center gap-1">
                            <h4
                                className="flex-1 truncate font-semibold text-sm text-white transition-colors group-hover:text-blue-200"
                                title={file.name}
                            >
                                {file.name}
                            </h4>
                            {(file.rotation ?? 0) > 0 && (
                                <div className="rounded-md border border-orange-400/30 bg-orange-500/20 px-2 py-0.5 font-medium text-orange-300 text-xs">
                                    {file.rotation}°
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-center gap-3 text-gray-400 text-xs">
                            <span className="flex items-center gap-1">
                                <svg
                                    aria-hidden="true"
                                    className="h-3 w-3"
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
                                        aria-hidden="true"
                                        className="h-3 w-3"
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

                {/* Drop Indicator */}
                {isDragOver && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-green-400 bg-green-500/20 backdrop-blur-sm">
                        <div className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 font-semibold text-sm text-white shadow-lg">
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
                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                />
                            </svg>
                            Déposer ici
                        </div>
                    </div>
                )}

                {/* Loading Overlay */}
                {!file.preview && !file.pageCount && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/10 backdrop-blur-sm">
                        <div className="text-center">
                            <div className="mb-2 animate-pulse">
                                <svg
                                    aria-hidden="true"
                                    className="mx-auto h-6 w-6 text-blue-400"
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
                            <div className="font-medium text-blue-400 text-xs">Traitement...</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
