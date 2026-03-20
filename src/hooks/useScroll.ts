export const useScroll = ({ targetId }: { targetId: string }) => {
    const scrollToTarget = () => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.warn(`Element with ID ${targetId} not found.`);
        }
    };

    return {
        scrollToTarget,
    };
};
