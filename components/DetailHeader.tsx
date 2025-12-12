// DetailHeader-komponent: Viser filmens header med baggrund, poster, trailer-knap og censur-badge
"use client";

import CreateButton from "./CreateButton";

// Movie-type med relevante felter
interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  backdropUrl?: string;
  trailerUrl?: string;
  ageRating: string;
  ageRatingImageUrl?: string;
}

// Props for DetailHeader-komponenten
interface DetailHeaderProps {
  movie: Movie;
}

export default function DetailHeader({ movie }: DetailHeaderProps) {
  // Brug backdrop hvis tilgængelig, ellers poster
  const backdropUrl = movie.backdropUrl || movie.posterUrl;
  // Brug custom censur-billede hvis tilgængelig, ellers fallback til standard-URL
  const ageRatingImage = movie.ageRatingImageUrl || `https://billet.mallingbio.dk/images/censur/censur-${movie.ageRating}.png`;

  return (
    // Sektion med baggrundsbillede og overlay
    <section className="relative w-full h-90 md:h-80 overflow-hidden mt-10">
        <img 
          src={backdropUrl} 
          alt="" 
          className="w-full h-full object-cover object-top"
        />
        {/* Gradient-overlay for læsbarhed */}
         <div className="absolute inset-0 bg-linear-to-b from-[#00000024] to-[#000000] pointer-events-none"></div>

         {/* Trailer-knap hvis trailer findes */}
         {movie.trailerUrl && (
           <div className="absolute top-30 left-[-9%] z-7 scale-75">
             <a
               href={movie.trailerUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="inline-block bg-[#B2182B] text-white font-bold px-8 py-3 rounded-full text-lg text-center shadow-[0_8px_0_0_#7C1C1A] active:translate-y-1 active:shadow-[0_4px_0_0_#7C1C1A]"
             >
               <div className="flex items-center gap-4 whitespace-nowrap">
                 Se trailer 
                 <img src="/assets/play.svg" alt="" className="w-6 h-6" />
               </div>
             </a>
           </div>
         )}

         {/* Poster og censur-badge */}
         <div className="absolute inset-0 flex items-end justify-center pb-8 z-5">
           <div className="relative">
             <img 
               src={movie.posterUrl} 
               alt={movie.title} 
               className="w-[178px] h-[266px] object-cover rounded-lg shadow-lg"
             />
             <img 
               src={ageRatingImage} 
               alt={`Age ${movie.ageRating}`} 
               className="absolute bottom-2 right-2 w-8 h-8"
             />
           </div>
         </div>
    </section>
  );
}