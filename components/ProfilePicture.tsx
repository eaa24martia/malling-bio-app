"use client";

// Importerer hooks og Firebase
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// Mulige profilbilleder
const profilePictures = [
  { id: 1, src: "/assets/kissy-profile.svg" },
  { id: 2, src: "/assets/scared-profile.svg" },
  { id: 3, src: "/assets/smarty-profile.svg" },
  { id: 4, src: "/assets/cute-profile.svg" },
];

export default function ProfilePicture() {
  // State til valgt billede, modal og bruger-id
  const [selectedPicture, setSelectedPicture] = useState(profilePictures[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Hent brugerens gemte profilbillede fra Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.profilePictureId) {
              const savedPicture = profilePictures.find(
                (p) => p.id === userData.profilePictureId
              );
              if (savedPicture) {
                setSelectedPicture(savedPicture);
              }
            }
          }
        } catch (error) {
          console.error("Error loading profile picture:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Håndter valg af profilbillede og gem til Firestore
  const handleSelectPicture = async (picture: typeof profilePictures[0]) => {
    setSelectedPicture(picture);
    setIsModalOpen(false);

    // Gem til Firebase
    if (userId) {
      try {
        await setDoc(
          doc(db, "users", userId),
          { profilePictureId: picture.id },
          { merge: true }
        );
      } catch (error) {
        console.error("Error saving profile picture:", error);
      }
    }
  };

  // UI rendering af profilbillede og modal
  return (
    <>
      <div className="flex flex-col items-center mt-5 gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="relative group"
        >
          <img
            src={selectedPicture.src}
            alt={`${selectedPicture.id} Profile Picture`}
            className="w-[200px] h-[200px] rounded-full shadow-lg transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white font-bold text-lg">Skift billede</span>
          </div>
        </button>
      </div>

      {/* Modal til valg af profilbillede */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-[20px] p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#192B5A]">
                Vælg profilbillede
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
                className="p-2 rounded-md"
              >
                <img src="/assets/close.svg" alt="Close" className="w-5 h-5" />
              </button>
            </div>

            {/* Profilbillede-valg */}
            <div className="grid grid-cols-2 gap-4">
              {profilePictures.map((picture) => (
                <button
                  key={picture.id}
                  onClick={() => handleSelectPicture(picture)}
                  className={`relative rounded-2xl p-4 transition-all ${
                    selectedPicture.id === picture.id
                      ? "ring-4 ring-[#B2182B] bg-[#B2182B]/10"
                      : "ring-2 ring-gray-200 hover:ring-[#B2182B] hover:bg-gray-50"
                  }`}
                >
                  <img
                    src={picture.src}
                    alt="Profile option"
                    className="w-full h-auto rounded-full"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}