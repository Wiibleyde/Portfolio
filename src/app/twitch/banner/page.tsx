import Iridescence from "@/components/UI/Iridescence";

export default function Banner() {
    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <Iridescence
                color={[0.5, 0.5, 0.8]}
                mouseReact={false}
                amplitude={0.1}
                speed={1.0}
            />
            <div className="absolute mx-auto top-1/2 transform -translate-y-1/2">
                <p className="text-[8rem] font-bold text-white">Wiibleyde</p>
            </div>
        </div>
    );
}
