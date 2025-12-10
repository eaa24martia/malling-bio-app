
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Movie = {
  id: string;
  title: string;
  posterUrl: string;
  isUpcoming: boolean;
};

export default function UpcomingSlider() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const router = useRouter();
  const [emblaRef] = useEmblaCarousel({ 
    align: "start", 
    loop: false,
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    dragFree: true,
    duration: 25
  });

  useEffect(() => {
    loadUpcomingMovies();
  }, []);

  const loadUpcomingMovies = async () => {
    try {
      const moviesRef = collection(db, "movies");
      const q = query(moviesRef, where("isUpcoming", "==", true));
      const snapshot = await getDocs(q);
      const moviesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Movie));
      setMovies(moviesData);
    } catch (error) {
      console.error("Error loading upcoming movies:", error);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    router.push(`/movie/${movie.id}`);
  };

  return (
    <div className="w-full px-2">
      {/* VIEWPORT */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* TRACK / CONTAINER */}
        <div className="flex gap-4">
          {movies.map((movie) => (
            <div key={movie.id} className="flex-none">
              {/* MOVIE POSTER CARD */}
              <button
                onClick={() => handleMovieClick(movie)}
                className="h-[150px] w-[104px] rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer"
              >
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title} 
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}