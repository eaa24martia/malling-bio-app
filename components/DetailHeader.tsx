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


         <div className="absolute inset-0 flex items-end justify-center pb-8 z-20">
           <div className="relative">
             <img 
               src="https://poster.ebillet.dk/WickedPartII-2025.large.jpg" 
               alt="Movie Poster" 
               className="w-[178px] h-[266px] object-cover rounded-lg shadow-lg"
             />
             <img 
               src="https://billet.mallingbio.dk/images/censur/censur-11.png" 
               alt="Age limit" 
               className="absolute bottom-2 right-2 w-8 h-8"
             />
           </div>
         </div>
    </section>
  );
}       