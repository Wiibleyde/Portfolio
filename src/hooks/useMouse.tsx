"use client"
import { useEffect, useState } from "react";

export function useMouse({ element }: { element?: HTMLElement } = {}) {
    const handleMouseMove = (e: MouseEvent) => {
        return { x: e.clientX, y: e.clientY };
    }

    const [mouse, setMouse] = useState({ x: 500, y: 500 }); // Default value is weird...
    const [mouseOnWebsite, setMouseOnWebsite] = useState(false);
    const [onElement, setOnElement] = useState(false);

    useEffect(() => {
        window.addEventListener('mousemove', (e) => setMouse(handleMouseMove(e)));
        document.addEventListener('mouseenter', () => setMouseOnWebsite(true));
        document.addEventListener('mouseleave', () => setMouseOnWebsite(false));
        if (element) {
            element.addEventListener('mouseover', () => setOnElement(true));
            element.addEventListener('mouseout', () => setOnElement(false));
        }
        return () => {
            window.removeEventListener('mousemove', (e) => setMouse(handleMouseMove(e)));
            document.removeEventListener('mouseenter', () => setMouseOnWebsite(true));
            document.removeEventListener('mouseleave', () => setMouseOnWebsite(false));
        };
    }, [element]);

    return { mouse, onElement, mouseOnWebsite };
}