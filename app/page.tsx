// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import RedLogo from "@/components/RedLogo";
import Carousel from "@/components/EmblaCarousel";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen duration={4000} />;

  return (
    <main 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('assets/background-1.svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <section className="relative z-10">
        <div className="flex justify-center">
          <RedLogo/>
        </div>
        
        <div>
          <Carousel />
        </div>
      </section>
    </main>
  );
}