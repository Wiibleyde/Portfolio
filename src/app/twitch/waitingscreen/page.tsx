import Iridescence from "@/components/UI/Iridescence";

export default function WaitingScreen() {
    return (
        <div className="overflow-hidden w-dvh h-dvh relative bg-black">
            <div className="absolute inset-0">
                <Iridescence
                    color={[1, 1, 1]}
                    mouseReact={false}
                    amplitude={0.1}
                    speed={1.0}
                />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-4xl font-bold">Wiibleyde</div>
                <div className="text-white text-2xl font-bold">Starting soon...</div>
            </div>
        </div>
    );
}
