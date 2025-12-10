"use client";

import { useState } from "react";

interface Movie {
  shortDescription: string;
  longDescription: string;
}

interface DetailDescriptionProps {
  movie: Movie;
}

export default function DetailDescription({ movie }: DetailDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shortText = movie.shortDescription || movie.longDescription.substring(0, 150) + "...";
  const fullText = movie.longDescription;

  return (
    <section className="px-4 flex justify-center mb-10">
      <p className="text-white text-sm leading-relaxed text-center max-w-md">
        <span 
          className={isExpanded ? "cursor-pointer" : ""}
          onClick={() => isExpanded && setIsExpanded(false)}
        >
          {isExpanded ? fullText : shortText}
        </span>
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