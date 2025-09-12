import Balatro from '@/components/UI/LetterGlitch';

export default function Profile() {
    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <Balatro
                isRotate={false}
                mouseInteraction={false}
                pixelFilter={900}
            />            
            <div className="absolute mx-auto top-1/2 transform -translate-y-1/2">
                <p className="text-[10rem] font-bold text-white text-shadow-black text-shadow-lg">W</p>
            </div>
        </div>
    );
}
