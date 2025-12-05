// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen duration={4000} />;

  return (
    <main 
      className="min-h-screen p-6 relative"
      style={{
        backgroundImage: `url('/background-1.svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="relative z-10">
        {/* resten af din forside */}
      </div>
    </main>
  );
}