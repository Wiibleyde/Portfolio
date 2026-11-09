import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

// native smooth scrolling is too fast to follow over long distances, so the duration grows with the distance
const MIN_DURATION = 0.9;
const MAX_DURATION = 1.6;
const PIXELS_PER_SECOND = 2500;

export const useScroll = ({ targetId }: { targetId: string }) => {
    const scrollToTarget = () => {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) {
            console.warn(`Element with ID ${targetId} not found.`);
            return;
        }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            targetElement.scrollIntoView({ behavior: 'instant' });
            return;
        }
        const distance = Math.abs(targetElement.getBoundingClientRect().top);
        gsap.to(window, {
            // any manual scroll by the user interrupts the animation
            scrollTo: { y: targetElement, autoKill: true },
            duration: gsap.utils.clamp(MIN_DURATION, MAX_DURATION, distance / PIXELS_PER_SECOND),
            ease: 'power2.inOut',
            overwrite: true,
        });
    };

    return {
        scrollToTarget,
    };
};
