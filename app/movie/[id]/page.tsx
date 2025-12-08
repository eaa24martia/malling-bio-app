"use client";

import RedHeader from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import DetailHeader from "@/components/DetailHeader";
import DetailDescription from "@/components/DetailDescription";
import DetailFoldElement from "@/components/DetailFoldElement";

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
      <main className="relative z-10 min-h-screen flex flex-col">
        <section className="relative z-10">
          <RedHeader />
        </section>

        <section>
            <DetailHeader />
        </section>

        <section className="text-center">
            <h2 className="text-[24px] font-bold mb-4 text-white">Wicked: Part II</h2>
            <div className="flex gap-2 mb-4 justify-center">
                <div className="bg-[#B2182B] text-white px-3 py-1 rounded-full text-sm">Fantasy</div>
                <div className="bg-[#B2182B] text-white px-3 py-1 rounded-full text-sm">Musical</div>
            </div>
        </section>

        <section className="px-4 mt-1">
            < DetailDescription />
        </section>

        <section className="flex-1">
            <DetailFoldElement />
        </section>

        {/* Bottom Navigation */}
        <BottomNav />
      </main>
    </>
  );
}