"use client";

import RedHeader from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function HomePage() {
  return (
    <body>
      {/* Fixed background layer */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: `url('/assets/backgrounds-2.svg'), linear-gradient(135deg, #000000 0%, #4B0009 100%)`,
          backgroundSize: 'cover, cover',
          backgroundPosition: 'center, center',
          backgroundRepeat: 'no-repeat, no-repeat'
        }}
      />
      
      {/* Content layer */}
      <main className="relative z-10 pb-20">
        <section className="relative z-10">
          <RedHeader />
        </section>

        {/* Bottom Navigation */}
        <BottomNav />
      </main>
      </body>
  );
}