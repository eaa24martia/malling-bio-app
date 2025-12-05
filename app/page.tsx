// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen duration={4000} />;

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">Velkommen til Malling Bio</h1>
      {/* resten af din forside */}
    </main>
  );
}