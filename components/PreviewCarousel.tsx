// components/WelcomeCarousel.tsx
"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

type Slide = {
  id: number;
  image: string;
  title: string;
  text: string;
};

const SLIDES: Slide[] = [
  {
    id: 0,
    image: "https://poster.ebillet.dk/Zootropolis2Ny-2025.large.jpg",
    title: "Zootropolis 2",
    text: "",
  },
  {
    id: 1,
    image: "https://poster.ebillet.dk/musenes-jul-2025.large.jpg",
    title: "Musenes Jul",
    text: "",
  },
  {
    id: 2,
    image: "https://poster.ebillet.dk/DenSidsteViking-Citat-2025.large.jpg",
    title: "Den Sidste Viking",
    text: "",
  },
  {
    id: 3,
    image: "https://poster.ebillet.dk/DyrenesMagiskeDK-2025.large.jpg",
    title: "Dyrenes Magiske Jul",
    text: "",
  },
  {
    id: 4,
    image: "https://poster.ebillet.dk/imstillhere2025pris.large.jpg",
    title: "I'm Still Here",
    text: "",
  },
];

export default function WelcomeCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    emblaApi.on("select", onSelect);
    onSelect();
    
    // Auto-scroll every 7 seconds
    const autoScroll = setInterval(() => {
      emblaApi.scrollNext();
    }, 7000);
    
    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(autoScroll);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = (index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  };

  return (
    <div className="w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {SLIDES.map((slide) => (
            <div key={slide.id} className="min-w-full mt-[79px]">
              <div 
                className="w-full h-60 flex flex-col items-center justify-center p-4 relative"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="absolute inset-0 bg-[rgba(0,0,0,0.74)] shadow-lg"></div>

                <div className="relative z-10 flex items-center justify-between w-full px-6">
                  <div className="shrink-0">
                    <img 
                      src={slide.image} 
                      alt={slide.title} 
                      className="h-[200px] w-auto object-contain shadow-2xl rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1 ml-6 text-left">
                    <p className="text-white text-[20px] mb-1 drop-shadow-lg opacity-100">
                      Populært nu:
                    </p>
                    <h2 className="text-white text-[24px] font-bold mb-2 drop-shadow-lg">
                      {slide.title}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
     
    </div>
  );
}