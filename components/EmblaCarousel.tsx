// components/WelcomeCarousel.tsx
// WelcomeCarousel-komponent: Viser en introduktionsslider med Embla-carousel og dot-navigation
"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

// Type for hvert slide i karusellen
type Slide = {
  id: number;
  image: string; // public path, e.g. "/carousel/seat.svg"
  title: string;
  text: string;
};

// Data til slides i karusellen
const SLIDES: Slide[] = [
  {
    id: 0,
    image: "assets/slide-1.svg",
    title: "Velkommen til Malling Bio",
    text: "Oplev film, vælg sæder og gem dine billetter – alt samlet ét sted",
  },
  {
    id: 1,
    image: "assets/slide-2.svg",
    title: "Find aktuelle film",
    text: "Udforsk de film, der vises lige nu hos Malling Bio",
  },
  {
    id: 2,
    image: "assets/slide-3.svg",
    title: "Vælg dine sæder",
    text: "Find den perfekte plads i salen - hurtigt og nemt",
  },
  {
    id: 3,
    image: "assets/slide-4.svg",
    title: "Billetter lige ved hånden",
    text: "Gem din billet i appen og scan den direkte ved døren",
  },
];

export default function WelcomeCarousel() {
  // Embla-carousel hook: emblaRef til DOM, emblaApi til styring
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: false });
  // State til at holde styr på valgt slide
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Callback til at opdatere valgt slide ved skift
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Opsætning af event listeners på Embla-carousel
  useEffect(() => {
    if (!emblaApi) return;
    
    emblaApi.on("select", onSelect);
    onSelect();
    
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Funktion til at skifte til bestemt slide
  const scrollTo = (index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* VIEWPORT for karusellen */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* TRACK / CONTAINER for slides */}
        <div className="flex">
          {SLIDES.map((slide) => (
            <div key={slide.id} className="min-w-full px-6">
              {/* Kort for hvert slide */}
              <div className="mx-auto max-w-lg bg-[#F2C9BC] rounded-2xl pl-6 pr-6 pt-2 h-[325px] w-[320px] flex flex-col">
                <div className="flex justify-center mb-6">
                  <img src={slide.image} alt={slide.title} className="w-70 h-auto" />
                </div>

                <h2 className="text-center text-[20px] font-bold text-[#192B53] mb-1">
                  {slide.title}
                </h2>

                <p className="text-center text-[14px] text-[#192B53] leading-relaxed">
                  {slide.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DOTS til navigation mellem slides */}
      <div className="flex justify-center items-center gap-4 mt-6">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`w-4 h-4 rounded-full transition-all ${selectedIndex === idx ? "bg-[#971B1E] scale-80" : "bg-[#F2C9BC] scale-70"}`}
          />
        ))}
      </div>
    </div>
  );
}