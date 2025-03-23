"use client";
import Iridescence from "@/components/UI/Iridescence";
import ScrollVelocity from "@/components/UI/ScrollVelocity";
import { useState } from "react";

export default function WaitingScreen() {
    const [scrollVelocityTexts, setScrollVelocityTexts] = useState([
        'Wiibleyde Stream - ',
        'Écran de chargement - '
    ]);


    return (
        <div className="flex items-center justify-center h-screen">
            <Iridescence
                color={[0.2, 0.3, 0.5]}
                mouseReact={false}
                amplitude={0.1}
                speed={1.0}
            />
            <div className="absolute top-24">
                
            </div>
            <div className="absolute bottom-24">
                <ScrollVelocity
                    texts={scrollVelocityTexts}
                    velocity={130} 
                    className="text-white"
                />
            </div>
        </div>
    );
}
