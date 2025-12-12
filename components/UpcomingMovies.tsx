"use client";

// Importerer nødvendige hooks, router, carousel og Firestore
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Movie-type til typesikkerhed
type Movie = {
  id: string;
  title: string;
  posterUrl: string;
  isUpcoming: boolean;
};

export default function UpcomingSlider() {
  // State til kommende film
  const [movies, setMovies] = useState<Movie[]>([]);
  const router = useRouter();
  // Initialiserer carousel med Embla
  const [emblaRef] = useEmblaCarousel({ 
    align: "start", 
    loop: false,
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    dragFree: true,
    duration: 25
  });

  // Henter kommende film ved mount
  useEffect(() => {
    loadUpcomingMovies();
  }, []);

  // Funktion til at hente kommende film fra Firestore
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

  // UI rendering af carousel med kommende film
  return (
    <div className="w-full px-2">
      {/* VIEWPORT til carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* TRACK / CONTAINER til filmkort */}
        <div className="flex gap-4">
          {movies.map((movie) => (
            <div key={movie.id} className="flex-none">
              {/* MOVIE POSTER CARD */}
              <div
                className="h-[150px] w-[104px] rounded-lg overflow-hidden shadow-lg"
              >
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title} 
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