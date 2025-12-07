"use client";

import { useEffect } from "react";
import RedHeader from "@/components/Header";
import PreviewCarousel from "@/components/PreviewCarousel";
import MovieSlider from "@/components/MovieSlider";

export default function HomePage() {
  useEffect(() => {
    // Disable scrolling on this page
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <main 
      className="h-screen relative overflow-hidden"
      style={{
        background: `url('/assets/backgrounds-2.svg'), linear-gradient(135deg, #000000 0%, #4B0009 100%)`,
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat'
      }}
    >
      <section className="relative z-10">
        <RedHeader />
      </section>

      <header>
        <PreviewCarousel />
      </header>

      <section>
        <h2 className="text-white text-[16px] font-bold mb-2 drop-shadow-lg">
          Aktuelle film
        </h2>
        <MovieSlider />
      </section>
    </main>
  );
}