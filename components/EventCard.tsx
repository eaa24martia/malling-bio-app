// EventCard-komponent: Viser et eventkort med billede, titel, beskrivelse, sæson og årstal
"use client";

import { useTheme } from "@/contexts/ThemeContext";

// Props for EventCard-komponenten
interface EventCardProps {
  image: string;      // Billede-URL for eventet
  alt: string;        // Alternativ tekst til billedet
  title: string;      // Titel på eventet
  description: string;// Beskrivelse af eventet
  season: string;     // Sæson (fx Forår, Efterår)
  year: string;       // Årstal
}

export default function EventCard({
  image,
  alt,
  title,
  description,
  season,
  year
}: EventCardProps) {
  // Henter high-contrast state fra tema-context (kan bruges til farver)
  const { isHighContrast } = useTheme();
  return (
    // Ydre container for kortet
    <div className="relative overflow-hidden rounded-[20px] shadow-lg bg-black max-w-md mx-4 sm:mx-auto">
      {/* Event-billede */}
      <img 
        src={image}
        alt={alt}
        className="w-full h-[220px] sm:h-[250px] md:h-[280px] object-cover block" 
      />
      {/* Gradient-overlay for bedre læsbarhed */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #b2182a9b, #0000008e)'
        }}
      />
      {/* Tekstindhold: titel og beskrivelse */}
      <div className="absolute left-6 right-6 bottom-6 z-5 text-white drop-shadow-lg">
        <h3 className="m-0 text-3xl sm:text-4xl font-extrabold leading-none">
          {title}
        </h3>
        <p className="mt-2 text-base sm:text-lg opacity-95">
          {description}
        </p>
      </div>
      {/* Sæson og årstal badge */}
      <div className="absolute right-4 top-4 z-5 px-4 py-3 rounded-xl font-extrabold text-base leading-tight shadow-md"
        style={{
          background: 'var(--accent)',
          color: 'var(--accent-contrast)'
        }}
      >
        <span className="block">{season}</span>
        <span className="block">{year}</span>
      </div>
    </div>
  );
}