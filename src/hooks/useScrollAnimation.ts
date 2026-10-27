import { gsap } from 'gsap';
import { type RefObject, useEffect, useRef, useState } from 'react';

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
    // Callers pass inline callbacks; keep the latest without re-creating the observer each render
    const onVisibleRef = useRef(onVisible);
    onVisibleRef.current = onVisible;

    useEffect(() => {
        if (isVisible || !containerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    observer.disconnect();
                    setIsVisible(true);
                    onVisibleRef.current();
                }
            },
            { threshold, rootMargin },
        );
        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [containerRef, isVisible, threshold, rootMargin]);

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
