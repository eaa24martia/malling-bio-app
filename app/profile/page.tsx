"use client";

import BottomNav from "@/components/BottomNav";
import RedHeader from "@/components/Header";
import ProfilePicture from "@/components/ProfilePicture";

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
           <ProfilePicture />
        </div>

     {/* Bottom Navigation */}
            <BottomNav />

        
    </main>
  );
}