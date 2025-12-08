"use client";

export default function EventElement() {
  return (
    <div className="relative overflow-hidden rounded-[20px] shadow-lg bg-black max-w-md mx-4 sm:mx-auto">
        <img 
          src="https://www.biografinfo.dk/cm-webpic/malling1ny1.jpg" 
          alt="Skolebio event" 
          className="w-full h-[220px] sm:h-[250px] md:h-[280px] object-cover block" 
        />
        
        <div 
          className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent to-[#b2182a9b]"
        />
        
        <div className="absolute left-6 right-6 bottom-6 z-5 text-white drop-shadow-lg">
          <h3 className="m-0 text-3xl sm:text-4xl font-extrabold leading-none">
            Skolebio
          </h3>
          <p className="mt-2 text-base sm:text-lg opacity-95">
            Biografen rykker ind i skolen
          </p>
        </div>

        <div className="absolute right-4 top-4 z-5 bg-[#B2182B] text-white px-4 py-3 rounded-xl font-extrabold text-base leading-tight shadow-md">
          <span className="block">Forår</span>
          <span className="block">2026</span>
        </div>
    </div>
  );
}