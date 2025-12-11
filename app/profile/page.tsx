"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import BottomNav from "@/components/BottomNav";
import RedHeader from "@/components/Header";
import ProfilePicture from "@/components/ProfilePicture";
import SettingElement from "@/components/SettingElement";

export default function ProfilePage() {
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUserName(user.displayName || "Bruger");
        setUserEmail(user.email || "");
        setLoading(false);
      } else {
        // User is not signed in, redirect to login
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen relative flex items-center justify-center"
        style={{
          backgroundImage: `url('assets/background-1.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'var(--text)'
        }}>
        <div className="text-xl" style={{ color: 'var(--text)' }}>Indlæser...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative"
        style={{
          backgroundImage: `url('assets/background-1.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'var(--text)'
        }}>

        <section className="relative z-10">
                  <RedHeader />
        </section>

        <div className="pt-20">
            <h1 className="font-bold text-center mb-0 mt-5" style={{ fontSize: '30px', color: 'var(--text)' }}>
            Hej {userName}!
          </h1>
           <ProfilePicture />
        </div>

        <section>
            <SettingElement />
        </section>

     {/* Bottom Navigation */}
            <BottomNav />

        
    </main>
  );
}