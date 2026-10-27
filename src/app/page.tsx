import { Footer } from '@/components/Footer';
import { Contact } from '@/components/HomePage/Contact';
import { Hero } from '@/components/HomePage/Hero';
import { Presentation } from '@/components/HomePage/Presentation';
import { Projects } from '@/components/HomePage/Projects';
import { Timeline } from '@/components/HomePage/Timeline';
import { Landing } from '@/components/Landing';

export default function Home() {
    return (
        <>
            <Landing />
            <div className="h-dvh snap-y overflow-x-hidden overflow-y-scroll scroll-smooth md:snap-mandatory">
                <Hero />
                <Presentation />
                <Timeline />
                <Projects />
                <Contact />
                <Footer />
            </div>
        </>
    );
}
