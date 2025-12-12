// components/MovieSlider.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Movie = {
  id: string;
  title: string;
  posterUrl: string;
  slug: string;
};

export default function MovieSlider() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [emblaRef] = useEmblaCarousel({ 
    align: "start", 
    loop: false,
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    dragFree: true,
    duration: 25
  });

  // Load current movies from Firestore
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const moviesRef = collection(db, "movies");
        // Only fetch movies where isUpcoming is false
        const q = query(moviesRef, where("isUpcoming", "==", false));
        const snapshot = await getDocs(q);
        const moviesData = snapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          posterUrl: doc.data().posterUrl,
          slug: doc.data().slug,
        } as Movie));
        setMovies(moviesData);
      } catch (error) {
        console.error("Error loading movies:", error);
      }
    };

    loadMovies();
  }, []);

  const handleMovieClick = (movie: Movie) => {
    // Navigate to movie detail page using ID
    router.push(`/movie/${movie.id}`);
  };

  return (
    <div className="w-full px-2">
      {/* VIEWPORT */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* TRACK / CONTAINER */}
        <div className="flex gap-4">
          {movies.length === 0 ? (
            <div className="text-white/50 text-sm px-4">Ingen film tilgængelig</div>
          ) : (
            movies.map((movie) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}