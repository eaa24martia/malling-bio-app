"use client";

// Importerer nødvendige hooks, komponenter og Firebase
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import RedHeader from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import DetailHeader from "@/components/DetailHeader";
import DetailDescription from "@/components/DetailDescription";
import DetailFoldElement from "@/components/DetailFoldElement";
import { useTheme } from "@/contexts/ThemeContext";

// Movie interface til typesikkerhed
interface Movie {
  id: string;
  title: string;
  originalTitle: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  posterUrl: string;
  backdropUrl?: string;
  trailerUrl?: string;
  genres: string[];
  runtimeMinutes: number;
  ageRating: string;
  ageRatingImageUrl?: string;
  languages: string[];
  featured: boolean;
  isUpcoming: boolean;
}

export default function MovieDetailPage() {
  // Henter id fra URL-parametre
  const params = useParams();
  // State til filmdata og loading
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { isHighContrast } = useTheme();

  // Henter filmdata når id ændrer sig
  useEffect(() => {
    loadMovie();
  }, [params.id]);

  // Funktion til at hente film fra Firestore
  const loadMovie = async () => {
    try {
      const movieRef = doc(db, "movies", params.id as string);
      const movieDoc = await getDoc(movieRef);
      if (movieDoc.exists()) {
        setMovie({
          id: movieDoc.id,
          ...movieDoc.data(),
        } as Movie);
      }
    } catch (error) {
      console.error("Error loading movie:", error);
    } finally {
      setLoading(false);
    }
  };

  // Viser loading-indikator mens film hentes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: isHighContrast ? '#000' : '#000' }}>
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  // Viser fejl hvis filmen ikke findes
  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: isHighContrast ? '#000' : '#000' }}>
        <p className="text-white">Movie not found</p>
      </div>
    );
  }

  // Hovedindhold for filmdetaljesiden
  return (
    <>
      {/* Fast baggrundslag */}
      <div 
        className="fixed inset-0 z-0"
        style={
          isHighContrast
            ? { background: '#000' }
            : {
                background: '#000000',
                backgroundSize: 'cover, cover',
                backgroundPosition: 'center, center',
                backgroundRepeat: 'no-repeat, no-repeat'
              }
        }
      />
      {/* Indholdslag */}
      <main className="relative z-10 min-h-screen flex flex-col">
        {/* Header med rød topbar */}
        <section className="relative z-10">
          <RedHeader />
        </section>
        {/* Filmheader med billede, titel mm. */}
        <section>
            <DetailHeader movie={movie} />
        </section>
        {/* Genre og titel */}
        <section className="text-center">
            <h2 className="text-[24px] font-bold mb-4 text-white">{movie.title}</h2>
            <div className="flex gap-2 mb-4 justify-center">
                {movie.genres.map((genre, index) => (
                  <div key={index} className="bg-[#B2182B] text-white px-3 py-1 rounded-full text-sm">
                    {genre}
                  </div>
                ))}
            </div>
        </section>
        {/* Lang beskrivelse */}
        <section className="px-4 mt-1">
            <DetailDescription movie={movie} />
        </section>
        {/* Fold-ud element med ekstra info */}
        <section className="flex-1">
            <DetailFoldElement movieId={movie.id} movieTitle={movie.title} moviePosterUrl={movie.posterUrl} />
        </section>
        {/* Bundnavigation */}
        <BottomNav />
      </main>
    </>
  );
}