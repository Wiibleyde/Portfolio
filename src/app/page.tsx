import { Hero } from "@/components/HomePage/Hero";
import { Presentation } from "@/components/HomePage/Presentation";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Background image */}
      <Hero />
      <Presentation />
    </div>
  );
}
