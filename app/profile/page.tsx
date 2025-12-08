"use client";

import BottomNav from "@/components/BottomNav";
import RedHeader from "@/components/Header";
import ProfilePicture from "@/components/ProfilePicture";
import SettingElement from "@/components/SettingElement";

export default function ProfilePage() {
  return (

    <main className="min-h-screen relative"
        style={{
          backgroundImage: `url('assets/background-1.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>

        <section className="relative z-10">
                  <RedHeader />
        </section>

        <div className="pt-20">
            <h1 className="font-bold text-center text-[#192B5A] mb-0 mt-5" style={{ fontSize: '30px' }}>
            Hej Navn!
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