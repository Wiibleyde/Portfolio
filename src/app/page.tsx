import { Footer } from '@/components/Footer';
import { Contact } from '@/components/HomePage/Contact';
import { Hero } from '@/components/HomePage/Hero';
import { Presentation } from '@/components/HomePage/Presentation';
import { Projects } from '@/components/HomePage/Projects';
import { Timeline } from '@/components/HomePage/Timeline';
import Noise from '@/components/reactbits/Noise';

export default function Home() {
    return (
        <>
            <main className="overflow-x-clip">
                <Hero />
                <Presentation />
                <Timeline />
                <Projects />
                <Contact />
            </main>
            <Footer />
            <Noise fixed opacity={0.05} fps={12} zIndex={40} />
        </>
    );
}
