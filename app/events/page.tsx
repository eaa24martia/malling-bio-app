"use client";

import BottomNav from "@/components/BottomNav";
import EventCard from "@/components/EventCard";
import RedHeader from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";

export default function EventsPage() {
  const { isHighContrast } = useTheme();
  return (

    <main className="min-h-screen relative"
        style={
          isHighContrast
            ? { backgroundColor: '#000' }
            : {
                backgroundImage: `url('assets/background-1.svg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }
        }>

        <section className="relative z-10">
                  <RedHeader />
        </section>

        <div className="pt-20">
           <h1 className="font-bold text-center mb-0 mt-5" style={{ fontSize: '30px', color: isHighContrast ? '#fff' : '#192B5A' }}>
            Arrangementer
          </h1>
             <div className="h-0.5 my-4" style={{ backgroundColor: isHighContrast ? '#fff' : '#192B5A' }}></div>
        </div>

    <section className="space-y-6 pb-20 mb-10">
         <EventCard
    image="https://www.biografinfo.dk/cm-webpic/malling1ny1.jpg"
    alt="Skolebio event"
    title="Skolebio"
    description="Biografen rykker ind i skolen"
    season="Forår"
    year="2026"
  />

  <EventCard
    image="https://bornibyen.dk/entries/14937-de-5-cafeer-med-udsyn-til-barnevognen/og_image"
    alt="Babybio"
    title="Babybio"
    description="Hyggelige filmvisninger for dig og din baby"
    season="Jan."
    year="26"
  />

  <EventCard
    image="https://cdn.sanity.io/images/h56zgnhl/retnemt/5bae04e4d4444334d10355df085e8b864e372a8b-1920x1080.jpg"
    alt="Julefrokost"
    title="Julefrokost"
    description="Kom til Malling Bio's hyggelige julefrokost"
    season="Dec."
    year="18"
  />

    </section>

     {/* Bottom Navigation */}
            <BottomNav />

        
    </main>
  );
}