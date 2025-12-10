"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { signOutUser } from "@/lib/auth";
import CreateButton from "./CreateButton";
import Modal from "./Modal";

export default function SettingElement() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || "");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOutUser();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div 
      className="w-full min-h-[560px] mt-20 rounded-t-[30px] relative overflow-hidden"
      style={{
        background: 'linear-gradient(to top, #400B10, #B2182B), url(/assets/backgrounds-3.svg)',
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundBlendMode: 'multiply'
      }}
    >
      <div className="pt-5">
        {/* Mine billetter button */}
        <button 
          className="w-full transition-colors p-4 flex items-center justify-between group"
        >
          <h3 className="text-white text-[20px] font-bold">Mine billetter</h3>
          <img src="assets/white-arrow-right.svg" alt="" className="w-10 h-10" />
        </button>

        {/* Divider */}
        <div className="h-px bg-white my-6 mb-4"></div>

        {/* Høj kontrast-tilstand toggle */}
        <div className="w-full p-4 flex items-center justify-between">
          <h3 className="text-white text-[20px] font-bold">Høj kontrast-tilstand</h3>
          <button
            onClick={() => setIsHighContrast(!isHighContrast)}
            className={`relative w-20 h-10 rounded-full transition-colors ${
              isHighContrast ? 'bg-[#B2182B]' : 'bg-gray-400'
            }`}
            aria-label="Toggle high contrast mode"
          >
            <span
              className={`absolute top-1 left-1 w-8 h-8 bg-gray-200 rounded-full shadow-md transition-transform ${
                isHighContrast ? 'translate-x-10' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-white my-6 mb-4"></div>

        {/* Om Malling Bio button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full p-4 flex items-center justify-between group"
        >
          <h3 className="text-white text-[20px] font-bold">Om Malling Bio</h3>
          <img src="assets/white-arrow-right.svg" alt="" className="w-10 h-10" />
        </button>
      </div>


        <div className="h-px bg-white my-6 mb-4"></div>
      <div className="flex justify-center mt-8 pb-8">
        <CreateButton onClick={handleLogout}>Log ud</CreateButton>
      </div>

      {/* Om Malling Bio Modal */}
     <Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Om Malling Bio"
  size="md"
>
  <div className="relative min-h-full bg-[#410C10]">
    {/* IMAGE HERO */}
    <section className="relative w-full h-64 md:h-72">
      <img
        src="https://www.biografinfo.dk/cm-webpic/malling1ny1.jpg"
        alt=""
        className="w-full h-full object-cover object-top"
      />

      {/* Gradient fade into background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #410C10)'
        }}
      />
    </section>

    {/* TEXT CONTENT */}
    <div className="px-6 py-10 pb-50 text-center text-white space-y-8 max-w-prose mx-auto">
      <p>
        Malling Bio er en lille, lokal biograf med stor betydning for byen. I generationer har den været
        et naturligt samlingspunkt for familier, venner og filmelskere i Malling og oplandet. Her kommer
        man ikke kun for at se film – man kommer for stemningen, fællesskabet og nærheden.
      </p>

      <p>
        Biografen drives med kærlighed til film og til lokalmiljøet. Programmet spænder fra store
        premierer til mindre, håndplukkede titler, som vi ved, at vores gæster sætter pris på. Det hele
        foregår i en afslappet og hyggelig atmosfære, hvor der er plads til både spontane biografture og
        planlagte aftener.
      </p>

      <p>
        Vi arbejder for at gøre biografoplevelsen enkel og overskuelig – både når du vælger dine sæder,
        køber billetter og sætter dig til rette i salen. Malling Bio skal være et varmt og velkomment sted,
        hvor du føler dig hjemme, uanset om du kommer alene eller i selskab.
      </p>

      <p>
        For os handler biograf ikke kun om film på lærredet. Det handler om at skabe gode stunder, støtte
        det lokale kulturliv og føre en Malling-tradition videre.
      </p>
    </div>
  </div>
</Modal>
    </div>
  );
}