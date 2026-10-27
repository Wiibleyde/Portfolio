'use client';
import { FileEarmarkPlus } from 'react-bootstrap-icons';

interface UploadZoneProps {
    dragOver: boolean;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onFileSelect: (files: FileList | null) => void;
}

export function UploadZone({ dragOver, onDrop, onDragOver, onDragEnter, onDragLeave, onFileSelect }: UploadZoneProps) {
    return (
        <section
            aria-label="Zone de dépôt de fichiers PDF"
            className={`rounded-2xl border border-dashed p-10 text-center transition-colors ${
                dragOver ? 'border-accent bg-accent/5' : 'border-zinc-700 hover:border-zinc-500'
            }`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
        >
            <FileEarmarkPlus className="mx-auto h-8 w-8 text-zinc-500" aria-hidden="true" />
            <p className="mt-4 font-medium text-zinc-100">Glissez-déposez vos fichiers ici</p>
            <p className="mt-1 text-sm text-zinc-500">PDF, JPEG, PNG, WebP, GIF, BMP</p>
            <label className="btn btn-secondary mt-6 cursor-pointer">
                Sélectionner des fichiers
                <input
                    type="file"
                    multiple
                    accept=".pdf,application/pdf,image/*"
                    className="hidden"
                    onChange={(e) => onFileSelect(e.target.files)}
                />
            </label>
        </section>
    );
}
