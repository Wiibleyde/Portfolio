"use client";

import { useEffect, useState } from "react";

export function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-6xl font-bold text-white text-shadow-black text-shadow-lg">
            {time.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            })}
        </div>
    );
}