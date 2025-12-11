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
    image="https://external-cph2-1.xx.fbcdn.net/emg1/v/t13/18249289209127382969?url=http%3A%2F%2Fmallingbio.dk%2Fmedia%2F1099%2F465790983_9687367834622838_4135184098306194493_n.jpg%3Fcenter%3D0.576072821846554%2C0.50166666666666671%26amp%3Bmode%3Dcrop%26amp%3Bwidth%3D1200%26amp%3Bheight%3D630%26amp%3Brnd%3D134037450400000000&fb_obo=1&utld=mallingbio.dk&stp=c0.5000x0.5000f_dst-jpg_flffffff_p1000x522_q75_tt6&_nc_gid=OxDm7qaXEFnNNeQ1N5-L2Q&_nc_oc=AdkBMEtof-Oth1D1zoTZgxhgDNz3o9WFzc_iB0VVHjUKbura1tPQMg-4wr66wgR3xjo&ccb=13-1&oh=06_Q3-6AW9QSFbYtHB8x4h_IJxDe9VKLvsFxTAWBefyQdcKJtsI&oe=693B54B7&_nc_sid=c97757"
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