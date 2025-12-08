"use client";

import EventCard from "@/components/EventCard";
import RedHeader from "@/components/Header";

export default function EventsPage() {
  return (

    <main className="h-screen relative overflow-hidden"
        style={{
          backgroundImage: `url('assets/background-1.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>

        <section className="relative z-10">
                  <RedHeader />
        </section>

        <div>
           <h1 className="font-bold text-center text-[#192B5A] mb-0 mt-25" style={{ fontSize: '30px' }}>
            Arrangementer
          </h1>
             <div className="h-0.5 bg-[#192B5A] my-4"></div>
        </div>

        <section>
            <EventCard />
        </section>
    </main>
  );
}