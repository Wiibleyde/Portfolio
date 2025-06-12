import { Hero } from "@/components/HomePage/Hero";
import { Presentation } from "@/components/HomePage/Presentation";
import { Timeline } from "@/components/HomePage/Timeline";
import { Footer } from "@/components/Footer";
import { Contact } from "@/components/HomePage/Contact";

export default function Home() {
  return (
    <div className="scroll-smooth snap-y snap-mandatory overflow-y-scroll h-screen">
      <Hero />
      <Presentation />
      <Timeline />
      <Contact />
      <Footer />
    </div>
  );
}
