import { Profile } from "@/types";
import ThemeToggle from "./ThemeToggle";

interface HeroProps {
  profile: Profile | null;
}

export default function Hero({ profile }: HeroProps) {
  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0c0c0c] via-[#1a1a2e] to-[#16213e] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1516321310764-9f3c2197810b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          animation: "float 20s ease-in-out infinite",
        }}
      />
      <ThemeToggle />
      <div className="relative z-10 text-center max-w-[800px] px-5 animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl font-bold mb-3 bg-gradient-to-r from-white to-[#667eea] bg-clip-text text-transparent">
          {profile?.name || "Qamar Abbas"}
        </h1>
        <p className="text-xl md:text-2xl mb-3 opacity-90">
          {profile?.title || "Generative AI | eCommerce"}
        </p>
        <p className="text-lg md:text-xl mb-5 opacity-80">
          <i className="fas fa-map-marker-alt mr-2"></i>
          {profile?.location || "Gilgit-Baltistan, Pakistan"}
        </p>
        <p className="text-lg mb-8 max-w-[600px] mx-auto">
          {profile?.short_bio ||
            "Motivated BBA graduate skilled in Digital Marketing, Generative AI, eCommerce. Helping businesses grow online."}
        </p>
        <div className="flex gap-5 justify-center flex-wrap">
          <a href="#work" className="btn btn-primary">
            <i className="fas fa-briefcase"></i> View Work
          </a>
          <a href="#contact" className="btn btn-secondary">
            <i className="fas fa-envelope"></i> Contact Me
          </a>
        </div>
      </div>
    </section>
  );
}
