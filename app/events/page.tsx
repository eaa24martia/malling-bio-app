"use client";

import BottomNav from "@/components/BottomNav";
import EventCard from "@/components/EventCard";
import RedHeader from "@/components/Header";

export default function EventsPage() {
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
            Arrangementer
          </h1>
             <div className="h-0.5 bg-[#192B5A] my-4"></div>
        </div>

    <section className="space-y-6 pb-20 mb-10">
        <section>
            <EventCard />
        </section>

         <section>
            <EventCard />
        </section>

          <section>
            <EventCard />
        </section>
    </section>

     {/* Bottom Navigation */}
            <BottomNav />

        
    </main>
  );
}