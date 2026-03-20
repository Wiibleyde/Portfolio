'use client';

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
        <div
            className={`relative rounded-3xl border-2 border-dashed bg-linear-to-br from-white/10 via-white/8 to-white/5 p-8 text-center shadow-2xl backdrop-blur-md transition-all duration-300 ${
                dragOver ? 'border-blue-400 bg-blue-500/10 shadow-blue-500/25' : 'border-white/30 hover:border-white/50'
            }`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
        >
            <div className="mb-4">
                <svg
                    aria-hidden="true"
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
            <h3 className="mb-2 font-semibold text-white text-xl">Glissez-déposez vos fichiers ici</h3>
            <p className="mb-4 text-gray-300">PDFs et images (JPEG, PNG, WebP, etc.)</p>
            <label className="group relative inline-block transform cursor-pointer rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-500/25">
                <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-400 to-purple-400 opacity-0 blur transition-opacity duration-300 group-hover:opacity-30" />
                <span className="relative z-10 flex items-center gap-2">
                    <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Sélectionner des fichiers
                </span>
                <input
                    type="file"
                    multiple
                    accept=".pdf,application/pdf,image/*"
                    className="hidden"
                    onChange={(e) => onFileSelect(e.target.files)}
                />
            </label>
            <p className="mt-3 text-gray-400 text-sm">Formats supportés : PDF, JPEG, PNG, WebP, GIF, BMP</p>
        </div>
    );
}
