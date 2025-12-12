"use client";

// Importerer nødvendige hooks og komponenter
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useTheme } from "@/contexts/ThemeContext";
import RedHeader from "@/components/Header";
import PreviewCarousel from "@/components/PreviewCarousel";
import MovieSlider from "@/components/MovieSlider";
import UpcomingSlider from "@/components/UpcomingMovies";
import EventsSlider from "@/components/EventsSlider";
import BottomNav from "@/components/BottomNav";

export default function HomePage() {
  // State til brugernavn og loading
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isHighContrast } = useTheme();

  // Tjekker om brugeren er logget ind, ellers redirect til login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || "Bruger");
        setLoading(false);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Viser loading-indikator mens brugerdata hentes
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center"
        style={
          isHighContrast
            ? { background: '#000' }
            : {
                background: `url('/assets/backgrounds-2.svg'), linear-gradient(135deg, #000000 0%, #4B0009 100%)`,
                backgroundSize: 'cover, cover',
                backgroundPosition: 'center, center'
              }
        }>
        <div className="text-white text-xl">Indlæser...</div>
      </div>
    );
  }

  return (
    <>
      {/* Fast baggrundslag */}
      <div 
        className="fixed inset-0 z-0"
        style={
          isHighContrast
            ? { background: '#000' }
            : {
                background: `url('/assets/backgrounds-2.svg'), linear-gradient(135deg, #000000 0%, #4B0009 100%)`,
                backgroundSize: 'cover, cover',
                backgroundPosition: 'center, center',
                backgroundRepeat: 'no-repeat, no-repeat'
              }
        }
      />
      
      {/* Indholdslag */}
      <main className="relative z-10 pb-20">
        {/* Header med rød topbar */}
        <section className="relative z-10">
          <RedHeader />
        </section>

        {/* Hero/preview carousel */}
        <header>
          <PreviewCarousel />
        </header>

        {/* Aktuelle film sektion */}
        <section>
          <h2 className="text-white text-[16px] font-bold mb-2 drop-shadow-lg pl-4 pt-4">
            Aktuelle film
          </h2>
          <MovieSlider />
        </section>

        <div className="h-px bg-[#ffffff] my-6"></div>

        {/* Kommende film sektion */}
        <section>
          <h2 className="text-white text-[16px] font-bold mb-2 drop-shadow-lg pl-4 pt-0">
            Kommende film
          </h2>
          <UpcomingSlider />
        </section>

        <div className="h-px bg-[#ffffff] my-6 mb-4"></div>

        {/* Events sektion */}
        <section className="mb-2.5">
          <h2 className="text-white text-[16px] font-bold mb-2 drop-shadow-lg pl-4 pt-0">
            Det sker i Malling Bio
          </h2>
          <EventsSlider />
        </section>

        {/* Bundnavigation */}
        <BottomNav />
      </main>
    </>
  );
}