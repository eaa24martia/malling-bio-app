"use client";

import RedHeader from "@/components/Header";
import PreviewCarousel from "@/components/PreviewCarousel";
import MovieSlider from "@/components/MovieSlider";

export default function HomePage() {
  return (
    <>
      {/* Fixed background layer */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: `url('/assets/backgrounds-2.svg'), linear-gradient(135deg, #000000 0%, #4B0009 100%)`,
          backgroundSize: 'cover, cover',
          backgroundPosition: 'center, center',
          backgroundRepeat: 'no-repeat, no-repeat'
        }}
      />
      
      {/* Content layer */}
      <main className="min-h-screen relative z-10">
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
    </>
  );
}