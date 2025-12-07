"use client";

import RedHeader from "@/components/Header";
import PreviewCarousel from "@/components/PreviewCarousel";
import MovieSlider from "@/components/MovieSlider";
import UpcomingSlider from "@/components/UpcomingMovies";
import EventsSlider from "@/components/EventsSlider";

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
      <main className="relative z-10 pb-20">
        <section className="relative z-10">
          <RedHeader />
        </section>

        <header>
          <PreviewCarousel />
        </header>

        {/* Current Movies Section */}
        <section>
          <h2 className="text-white text-[16px] font-bold mb-2 drop-shadow-lg pl-4 pt-4">
            Aktuelle film
          </h2>
          <MovieSlider />
        </section>

        <div className="h-px bg-[#ffffff] my-6"></div>

        {/* Upcoming Movies Section */}
        <section>
          <h2 className="text-white text-[16px] font-bold mb-2 drop-shadow-lg pl-4 pt-0">
            Kommende film
          </h2>
          <UpcomingSlider />
        </section>

        <div className="h-px bg-[#ffffff] my-6 mb-4"></div>

        {/* Events Section */}
        <section className="mb-2.5">
          <h2 className="text-white text-[16px] font-bold mb-2 drop-shadow-lg pl-4 pt-0">
            Det sker i malling Bio
          </h2>
          <EventsSlider />
        </section>
      </main>
    </>
  );
}