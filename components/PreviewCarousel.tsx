// components/WelcomeCarousel.tsx
"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Movie = {
  id: string;
  title: string;
  posterUrl: string;
  isPopular: boolean;
  popularOrder?: number;
};

export default function WelcomeCarousel() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    loadPopularMovies();
  }, []);

  const loadPopularMovies = async () => {
    try {
      const moviesRef = collection(db, "movies");
      const q = query(moviesRef, where("isPopular", "==", true));
      const snapshot = await getDocs(q);
      const moviesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Movie));
      
      // Sort by popularOrder
      const sortedMovies = moviesData.sort((a, b) => (a.popularOrder || 0) - (b.popularOrder || 0));
      setMovies(sortedMovies);
    } catch (error) {
      console.error("Error loading popular movies:", error);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    router.push(`/movie/${movie.id}`);
  };

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
          {movies.map((movie) => (
            <div key={movie.id} className="min-w-full mt-[79px]">
              <button
                onClick={() => handleMovieClick(movie)}
                className="w-full h-60 flex flex-col items-center justify-center p-4 relative cursor-pointer"
                style={{
                  backgroundImage: `url(${movie.posterUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="absolute inset-0 bg-[rgba(0,0,0,0.74)] shadow-lg"></div>

                <div className="relative z-10 flex items-center justify-between w-full px-6">
                  <div className="shrink-0">
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title} 
                      className="h-[200px] w-auto object-contain shadow-2xl rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1 ml-6 text-left">
                    <p className="text-white text-[20px] mb-1 drop-shadow-lg opacity-100">
                      Populært nu:
                    </p>
                    <h2 className="text-white text-[24px] font-bold mb-2 drop-shadow-lg">
                      {movie.title}
                    </h2>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
     
    </div>
  );
}