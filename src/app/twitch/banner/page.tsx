import FaultyTerminal from '@/components/UI/FaultyTerminal';

export default function Banner() {
    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <FaultyTerminal
                scale={3}
                gridMul={[2, 1]}
                digitSize={1.2}
                timeScale={1}
                pause={false}
                scanlineIntensity={1}
                glitchAmount={1}
                flickerAmount={1}
                noiseAmp={1}
                chromaticAberration={0}
                dither={0}
                curvature={0}
                tint="#a7ef9e"
                mouseReact={false}
                pageLoadAnimation={false}
                brightness={0.5}
            />
            <div className="absolute mx-auto top-1/2 transform -translate-y-1/2">
                <p className="text-[8rem] font-bold text-white text-shadow-black text-shadow-lg">Wiibleyde</p>
            </div>
        </div>
    );
}
