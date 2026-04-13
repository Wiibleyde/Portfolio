import { gsap } from 'gsap';
import { type RefObject, useEffect, useState } from 'react';

interface UseScrollAnimationOptions {
    threshold?: number;
    rootMargin?: string;
}

/**
 * Triggers a GSAP animation when the observed element enters the viewport.
 * Returns isVisible so callers can conditionally set initial GSAP states.
 */
export function useScrollAnimation(
    containerRef: RefObject<Element | null>,
    onVisible: () => void,
    options: UseScrollAnimationOptions = {},
): boolean {
    const { threshold = 0.3, rootMargin = '0px 0px -100px 0px' } = options;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true);
                        onVisible();
                    }
                }
            },
            { threshold, rootMargin },
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [containerRef, isVisible, onVisible, threshold, rootMargin]);

    return isVisible;
}

/** Convenience: set initial hidden state for multiple refs, then reveal via GSAP on scroll. */
export function useRevealOnScroll(
    containerRef: RefObject<Element | null>,
    refs: RefObject<Element | null>[],
    options: UseScrollAnimationOptions = {},
): boolean {
    const isVisible = useScrollAnimation(
        containerRef,
        () => {
            const tl = gsap.timeline({ delay: 0.2 });
            for (const [i, ref] of refs.entries()) {
                tl.to(
                    ref.current,
                    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
                    i === 0 ? undefined : '-=0.4',
                );
            }
        },
        options,
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally runs only on mount
    useEffect(() => {
        for (const ref of refs) {
            if (ref.current) {
                gsap.set(ref.current, { opacity: 0, y: 50 });
            }
        }
    }, []);

    return isVisible;
}
