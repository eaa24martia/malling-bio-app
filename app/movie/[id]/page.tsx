"use client";

import RedHeader from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import DetailHeader from "@/components/DetailHeader";

export default function MovieDetailPage() {
  return (
    <>
      {/* Fixed background layer */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: '#000000',
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

        <section>
            <DetailHeader />
        </section>

        {/* Bottom Navigation */}
        <BottomNav />
      </main>
    </>
  );
}