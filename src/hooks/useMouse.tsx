import { useEffect, useState } from "react";

export function useMouse() {
    const handleMouseMove = (e: MouseEvent) => {
        return { x: e.clientX, y: e.clientY };
    }

    const [mouse, setMouse] = useState({ x: 0, y: 101 }); // Default value is weird...

    useEffect(() => {
        window.addEventListener('mousemove', (e) => setMouse(handleMouseMove(e)));
        return () => window.removeEventListener('mousemove', (e) => setMouse(handleMouseMove(e)));
    }, []);

    return { mouse };
}