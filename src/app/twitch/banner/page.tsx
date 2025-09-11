"use client";
import Iridescence from '@/components/UI/Iridescence';
import Balatro from '@/components/UI/LetterGlitch';
import LetterGlitch from '@/components/UI/LetterGlitch';

export default function Banner() {
    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <Balatro
                isRotate={false}
                mouseInteraction={true}
                pixelFilter={900}
            />
            <div className="absolute mx-auto top-1/2 transform -translate-y-1/2">
                <p className="text-[8rem] font-bold text-white">Wiibleyde</p>
            </div>
        </div>
    );
}
