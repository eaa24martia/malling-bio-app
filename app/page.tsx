// app/page.tsx
"use client";
import { useContext, useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import SplashScreen from "@/components/SplashScreen";
import RedLogo from "@/components/RedLogo";
import Carousel from "@/components/EmblaCarousel";
import CreateButton from "@/components/CreateButton";
import LoginButton from "@/components/LoginButton";

export default function HomePage() {
  const { isHighContrast } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Håndterer splash screen og mounting af komponenten
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Funktion til at gengive hovedindholdet (logo, carousel, knapper)
  const renderMainContent = () => (
    <section className="relative z-10">
      <div className="flex justify-center">
        <RedLogo/>
      </div>
      <div>
        <Carousel />
      </div>
      <div className="flex justify-center mt-10">
        <CreateButton href="/signup">Opret ny bruger</CreateButton>
      </div>
      <div className="flex justify-center mt-8">
        <LoginButton href="/login">Log ind</LoginButton>
      </div>
    </section>
  );

  // Baggrundsstil afhængig af kontrast-tilstand
  const mainBg = isHighContrast
    ? { background: "#000" }
    : {
        backgroundImage: `url('assets/background-1.svg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      };

  // Hvis komponenten ikke er mountet endnu
  if (!mounted) {
    return (
      <main className="h-screen relative overflow-hidden" style={mainBg}>
        {renderMainContent()}
      </main>
    );
  }

  // Vis splash screen hvis showSplash er sand
  if (showSplash) {
    return (
      <>
        <main className="h-screen relative overflow-hidden" style={mainBg}>
          {renderMainContent()}
        </main>
        <SplashScreen duration={4000} />
      </>
    );
  }

  // Standardvisning af forsiden
  return (
    <main className="h-screen relative overflow-hidden" style={mainBg}>
      {renderMainContent()}
    </main>
  );
}