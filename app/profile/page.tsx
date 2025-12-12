"use client";

// Importerer nødvendige hooks og komponenter
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import BottomNav from "@/components/BottomNav";
import RedHeader from "@/components/Header";
import ProfilePicture from "@/components/ProfilePicture";
import SettingElement from "@/components/SettingElement";
import { useTheme } from "@/contexts/ThemeContext";

export default function ProfilePage() {
  // State til brugernavn, email og loading
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isHighContrast } = useTheme();

  // Tjekker om brugeren er logget ind, ellers redirect til login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Bruger er logget ind
        setUserName(user.displayName || "Bruger");
        setUserEmail(user.email || "");
        setLoading(false);
      } else {
        // Bruger er ikke logget ind, redirect til login
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Viser loading-indikator mens brugerdata hentes
  if (loading) {
    return (
      <main className="min-h-screen relative flex items-center justify-center"
        style={
          isHighContrast
            ? {
                backgroundColor: "#000",
                color: "var(--text)"
              }
            : {
                backgroundImage: `url('assets/background-1.svg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                color: 'var(--text)'
              }
        }>
        <div className="text-xl" style={{ color: 'var(--text)' }}>Indlæser...</div>
      </main>
    );
  }

  // Hovedindhold for profilsiden
  return (
    <main className="min-h-screen relative"
        style={
          isHighContrast
            ? {
                backgroundColor: "#000",
                color: "var(--text)"
              }
            : {
                backgroundImage: `url('assets/background-1.svg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                color: 'var(--text)'
              }
        }>

        {/* Header med rød topbar */}
        <section className="relative z-10">
                  <RedHeader />
        </section>

        {/* Velkomsthilsen og profilbillede */}
        <div className="pt-20">
            <h1 className="font-bold text-center mb-0 mt-5" style={{ fontSize: '30px', color: 'var(--text)' }}>
            Hej {userName}!
          </h1>
           <ProfilePicture />
        </div>

        {/* Indstillinger (modal, log ud, kontrast mm.) */}
        <section>
            <SettingElement />
        </section>

     {/* Bundnavigation */}
            <BottomNav />

        
    </main>
  );
}