// DetailDescription-komponent: Viser kort/lang beskrivelse af film med "Se mere"-funktion
"use client";

import { useState } from "react";

// Movie-type med beskrivelsesfelter
interface Movie {
  shortDescription: string;
  longDescription: string;
}

// Props for DetailDescription-komponenten
interface DetailDescriptionProps {
  movie: Movie;
}

export default function DetailDescription({ movie }: DetailDescriptionProps) {
  // State til at styre om beskrivelsen er foldet ud
  const [isExpanded, setIsExpanded] = useState(false);

  // Viser kort tekst hvis tilgængelig, ellers de første 150 tegn af lang tekst
  const shortText = movie.shortDescription || movie.longDescription.substring(0, 150) + "...";
  const fullText = movie.longDescription;

  return (
    <section className="px-4 flex justify-center mb-10">
      <p className="text-white text-sm leading-relaxed text-center max-w-md">
        {/* Klik på tekst for at folde sammen hvis udvidet */}
        <span 
          className={isExpanded ? "cursor-pointer" : ""}
          onClick={() => isExpanded && setIsExpanded(false)}
        >
          {isExpanded ? fullText : shortText}
        </span>
        {/* "Se mere"-knap hvis tekst kan foldes ud */}
        {!isExpanded && fullText !== shortText && (
          <button 
            onClick={() => setIsExpanded(true)}
            className="text-[#C40023] ml-2 hover:text-red-400 transition-colors"
          >
            Se mere
          </button>
        )}
      </p>
    </section>
  );
}