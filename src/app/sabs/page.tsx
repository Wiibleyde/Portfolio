import { Contact } from "@/components/SABS/Contact";
import { Footer } from "@/components/SABS/Footer";
import { Hero } from "@/components/SABS/Hero";
import { Presentation } from "@/components/SABS/Presentation";

export default function SabsPage() {
    return (
        <div className="scroll-smooth snap-y snap-mandatory overflow-y-scroll h-screen">
            <Hero />
            <Presentation />
            <Contact />
            <Footer />
        </div>
    );
}