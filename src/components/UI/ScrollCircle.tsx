"use client"

import { useScroll } from "@/hooks/useScroll";
import { useEffect, useState } from "react";

export function ScrollCircle() {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const { scroll, scrollPercentage } = useScroll();

    useEffect(() => {
        if (scroll > 150) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [scroll]);

    return (
        <div className='fixed right-4 bottom-4'>
            <div className={`relative flex justify-center items-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div
                    className="w-10 h-10 rounded-full flex justify-center items-center"
                    style={{
                        background: `conic-gradient(#00E46C ${scrollPercentage}%, #173B2A ${scrollPercentage}% 100%)`,
                    }}
                >
                    <div className="w-8 h-8 dark:bg-black bg-gray-100 rounded-full flex justify-center items-center">
                        <span className="text-[#00E46C] text-xs font-bold">{scrollPercentage}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}