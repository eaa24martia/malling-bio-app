// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import RedLogo from "@/components/RedLogo";
import Carousel from "@/components/EmblaCarousel";
import CreateButton from "@/components/CreateButton";
import LoginButton from "@/components/LoginButton";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    document.body.style.overflow = 'hidden';
    
    const timer = setTimeout(() => setShowSplash(false), 4000);
    
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!mounted) {
    return (
      <main 
        className="h-screen relative overflow-hidden"
        style={{
          backgroundImage: `url('assets/background-1.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
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
      </main>
    );
  }

  if (showSplash) {
    return (
      <>
        <main 
          className="h-screen relative overflow-hidden"
          style={{
            backgroundImage: `url('assets/background-1.svg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
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
        </main>
        <SplashScreen duration={4000} />
      </>
    );
  }

  return (
    <main 
      className="h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url('assets/background-1.svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
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
    </main>
  );
}