"use client";


export default function DetailHeader() {
  return (
    <section className="relative w-full h-90 md:h-80 overflow-hidden mt-10">
        <img 
          src="https://poster.ebillet.dk/WickedPartII-2025.large.jpg" 
          alt="" 
          className="w-full h-full object-cover object-top"
        />
         <div className="absolute inset-0 bg-linear-to-b from-[#00000024] to-[#000000] pointer-events-none"></div>
    </section>
  );
}       