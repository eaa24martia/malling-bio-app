"use client";

import { useState } from "react";

export default function DetailDescription() {
  const [isExpanded, setIsExpanded] = useState(false);

  const shortText = "Wicked: Part II afslutter den episke Broadway-filmatisering med Elphaba og Glinda som nu må konfrontere konsekvenserne af deres valg...";
  const fullText = "Wicked: Part II afslutter den episke Broadway-filmatisering med Elphaba og Glinda som nu må konfrontere konsekvenserne af deres valg. Efterhånden som de to veninder navigerer gennem de komplekse udfordringer i deres nye roller, må de også håndtere de personlige og politiske konsekvenser af deres tidligere beslutninger. Filmen udforsker temaer om venskab, magt og de valg der definerer os.";

  return (
    <section className="px-4 flex justify-center mb-10">
      <p className="text-white text-sm leading-relaxed text-center max-w-md">
        <span 
          className={isExpanded ? "cursor-pointer" : ""}
          onClick={() => isExpanded && setIsExpanded(false)}
        >
          {isExpanded ? fullText : shortText}
        </span>
        {!isExpanded && (
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