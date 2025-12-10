"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const profilePictures = [
  { id: 1, src: "/assets/kissy-profile.svg" },
  { id: 2, src: "/assets/scared-profile.svg" },
  { id: 3, src: "/assets/smarty-profile.svg" },
  { id: 4, src: "/assets/cute-profile.svg" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [profilePictureSrc, setProfilePictureSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.profilePictureId) {
              const savedPicture = profilePictures.find(
                (p) => p.id === userData.profilePictureId
              );
              if (savedPicture) {
                setProfilePictureSrc(savedPicture.src);
              } else {
                setProfilePictureSrc("/assets/profile.svg");
              }
            } else {
              setProfilePictureSrc("/assets/profile.svg");
            }
          } else {
            setProfilePictureSrc("/assets/profile.svg");
          }
        } catch (error) {
          console.error("Error loading profile picture:", error);
          setProfilePictureSrc("/assets/profile.svg");
        }
      } else {
        setProfilePictureSrc("/assets/profile.svg");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isActive = (path: string) => {
    if (path === '/home') {
      // Home is active for /home and /movie/[id] routes
      return pathname === '/home' || pathname?.startsWith('/movie/');
    }
    return pathname === path;
  };

  return (
    <section className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#ffffff] z-50 shadow-lg rounded-[50px]" style={{ width: '361px', height: '62px' }}>
      <div className="flex justify-between items-center h-full px-8">
        <Link href="/home" className={`flex flex-col items-center justify-center transition-opacity ${isActive('/home') ? 'opacity-100' : 'opacity-50'}`}>
          <img src="/assets/house.svg" alt="Home page" className="w-8 h-8" />
          <h2 className="text-[12px] font-medium" style={{ color: '#B2182B' }}>Hjem</h2>
        </Link>
        <Link href="/events" className={`flex flex-col items-center justify-center transition-opacity ${isActive('/events') ? 'opacity-100' : 'opacity-50'}`}>
          <img src="/assets/events.svg" alt="Events page" className="w-8 h-8" />
          <h2 className="text-[12px] font-medium" style={{ color: '#B2182B' }}>Arrangementer</h2>
        </Link>
        <Link href="/tickets" className={`flex flex-col items-center justify-center transition-opacity ${isActive('/tickets') ? 'opacity-100' : 'opacity-50'}`}>
          <img src="/assets/tickets.svg" alt="Tickets page" className="w-8 h-8" />
          <h2 className="text-[12px] font-medium" style={{ color: '#B2182B' }}>Billetter</h2>
        </Link>
        <Link href="/profile" className={`flex flex-col items-center justify-center transition-opacity ${isActive('/profile') ? 'opacity-100' : 'opacity-50'}`}>
          {!loading && profilePictureSrc && (
            <img src={profilePictureSrc} alt="Profile page" className="w-8 h-8 rounded-full" />
          )}
          <h2 className="text-[12px] font-medium" style={{ color: '#B2182B' }}>Profil</h2>
        </Link>
      </div>
    </section>
  );
}