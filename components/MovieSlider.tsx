// components/MovieSlider.tsx
"use client";

import useEmblaCarousel from "embla-carousel-react";

type Slide = {
  id: number;
  image: string;
  title: string;
};

const SLIDES: Slide[] = [
  {
    id: 0,
    image: "https://poster.ebillet.dk/Zootropolis2Ny-2025.large.jpg",
    title: "Zootropolis 2",
  },
  {
    id: 1,
    image: "https://poster.ebillet.dk/IngenKaereMor-2025.large.jpg",
    title: "Ingen Kære Mor",
  },
  {
    id: 2,
    image: "https://poster.ebillet.dk/musenes-jul-2025.large.jpg",
    title: "Musenes Jul",
  },
  {
    id: 3,
    image: "https://poster.ebillet.dk/DenSidsteViking-Citat-2025.large.jpg",
    title: "Den Sidste Viking",
  },
  {
    id: 4,
    image: "https://poster.ebillet.dk/nurnberg-2025.large.jpg",
    title: "Nürnberg",
  },
  {
    id: 5,
    image: "https://poster.ebillet.dk/imstillhere2025pris.large.jpg",
    title: "I'm Still Here",
  },
  {
    id: 6,
    image: "https://poster.ebillet.dk/detnyeaar2025.large.jpg",
    title: "Det Nye År",
  },
  {
    id: 7,
    image: "https://poster.ebillet.dk/APrivateLife-DK-2025.large.jpg",
    title: "A Private Life",
  },
  {
    id: 8,
    image: "https://poster.ebillet.dk/mira2025.large.jpg",
    title: "Mira",
  },
];

export default function MovieSlider() {
  const [emblaRef] = useEmblaCarousel({ 
    align: "start", 
    loop: false,
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    dragFree: true,
    duration: 25
  });

  return (
    <div className="w-full px-2">
      {/* VIEWPORT */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* TRACK / CONTAINER */}
        <div className="flex gap-4">
          {SLIDES.map((slide) => (
            <div key={slide.id} className="flex-none">
              {/* MOVIE POSTER CARD */}
              <div className="h-[150px] w-[104px] rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}