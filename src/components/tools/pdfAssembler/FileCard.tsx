'use client';

import Image from 'next/image';
import { ArrowClockwise, ArrowCounterclockwise, ArrowRepeat, GripVertical, X } from 'react-bootstrap-icons';
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

const ICON_BUTTON = 'rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-100';

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
    const rotation = file.rotation ?? 0;

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
            className={`file-item card relative cursor-move p-3 transition-colors ${
                isDragOver ? 'border-accent' : isDragged ? 'opacity-50' : 'hover:border-zinc-700'
            }`}
        >
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
                    <GripVertical className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span className="tag">{file.type === 'pdf' ? 'PDF' : 'IMG'}</span>
                </div>
                <div className="flex items-center">
                    {file.type === 'pdf' && (
                        <>
                            <button
                                type="button"
                                onClick={() => onRotate(file.id, 'left')}
                                className={ICON_BUTTON}
                                title="Rotation 90° gauche"
                                aria-label="Rotation 90° gauche"
                            >
                                <ArrowCounterclockwise className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onRotate(file.id, 'right')}
                                className={ICON_BUTTON}
                                title="Rotation 90° droite"
                                aria-label="Rotation 90° droite"
                            >
                                <ArrowClockwise className="h-4 w-4" />
                            </button>
                        </>
                    )}
                    <button
                        type="button"
                        onClick={() => onRemove(file.id)}
                        className={`${ICON_BUTTON} hover:text-red-400`}
                        title="Supprimer"
                        aria-label={`Supprimer ${file.name}`}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <button
                type="button"
                className="relative block aspect-3/4 w-full cursor-pointer overflow-hidden rounded-lg border border-zinc-800 bg-white"
                onClick={() => onPreview(file)}
                title="Cliquer pour prévisualiser le document"
            >
                {file.preview ? (
                    <Image
                        src={file.preview}
                        alt={`Aperçu de ${file.name}`}
                        width={240}
                        height={320}
                        className="preview-image h-full w-full object-contain"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    />
                ) : (
                    <span className="flex h-full w-full items-center justify-center bg-zinc-900">
                        <ArrowRepeat
                            className="h-5 w-5 animate-spin text-zinc-500"
                            aria-label="Génération de l'aperçu"
                        />
                    </span>
                )}
            </button>

            <p className="mt-3 truncate text-sm text-zinc-200" title={file.name}>
                {file.name}
            </p>
            <p className="mt-1 font-mono text-xs text-zinc-500">
                {(file.file.size / 1024 / 1024).toFixed(1)} MB
                {file.pageCount ? ` · ${file.pageCount} page${file.pageCount > 1 ? 's' : ''}` : ''}
                {rotation > 0 ? ` · ${rotation}°` : ''}
            </p>
        </div>
    );
}
