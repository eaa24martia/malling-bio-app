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
    image: "https://ebillet.dk/poster//the-housemaidNy-2025.large.jpg",
    title: "The Housemaid",
  },
  {
    id: 1,
    image: "https://ebillet.dk/poster//dennyetriumfbue2025.large.jpg",
    title: "Den nye triumfbue",
  },
  {
    id: 2,
    image: "https://ebillet.dk/poster//SvampebobFirkant-2025.large.jpg",
    title: "Svampebob Filmen - Jagen på Firkant",
  },
  {
    id: 3,
    image: "https://ebillet.dk/poster//Anaconda-2025.large.jpg",
    title: "Anaconda",
  },
  {
    id: 4,
    image: "https://ebillet.dk/poster//nootherchoice-2025.large.jpg",
    title: "No Other Choice",
  },
  {
    id: 5,
    image: "https://ebillet.dk/poster//begyndelser2025.large.jpg",
    title: "Begyndelser",
  },
];

export default function UpcomingSlider() {
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