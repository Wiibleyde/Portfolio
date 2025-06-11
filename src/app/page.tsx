import { Hero } from "@/components/HomePage/Hero";
import { Presentation } from "@/components/HomePage/Presentation";
import { Timeline } from "@/components/HomePage/Timeline";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Background image */}
      <Hero />
      <Presentation />
      <Timeline />
    </div>
  );
}
