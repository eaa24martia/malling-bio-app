"use client";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";

export default function SplashScreen({ duration = 3000 }: { duration?: number }) {
  const [animationData, setAnimationData] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadAnimation() {
      try {
        const res = await fetch("/assets/splash-screen.json");
        if (!res.ok) throw new Error("Failed to fetch splash-screen.json");
        const json = await res.json();
        if (mounted) setAnimationData(json);
      } catch (err) {
        // Vis fejl i console for nem debugging
        console.error("Could not load splash animation:", err);
      }
    }
    loadAnimation();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-#FFF3E7 z-50">
      <Lottie 
        animationData={animationData} 
        loop={false} 
        autoplay={true} 
        style={{ width: '100vw', height: '100vh' }} 
      />
    </div>
  );
}