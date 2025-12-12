// components/MovieSlider.tsx
"use client";

// Importerer hooks, router, carousel og Firestore
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Movie-type til typesikkerhed
type Movie = {
  id: string;
  title: string;
  posterUrl: string;
  slug: string;
};

export default function MovieSlider() {
  // Initialiserer router og state til film
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  // Initialiserer carousel med Embla
  const [emblaRef] = useEmblaCarousel({ 
    align: "start", 
    loop: false,
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    dragFree: true,
    duration: 25
  });

  // Henter aktuelle film fra Firestore ved mount
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const moviesRef = collection(db, "movies");
        // Hent kun film hvor isUpcoming er false
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

  // Naviger til filmdetalje ved klik
  const handleMovieClick = (movie: Movie) => {
    router.push(`/movie/${movie.id}`);
  };

  // UI rendering af carousel med aktuelle film
  return (
    <div className="w-full px-2">
      {/* VIEWPORT til carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* TRACK / CONTAINER til filmkort */}
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