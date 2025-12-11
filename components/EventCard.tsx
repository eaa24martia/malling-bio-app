"use client";

import { useTheme } from "@/contexts/ThemeContext";

interface EventCardProps {
  image: string;
  alt: string;
  title: string;
  description: string;
  season: string;
  year: string;
}

export default function EventCard({
  image,
  alt,
  title,
  description,
  season,
  year
}: EventCardProps) {
  const { isHighContrast } = useTheme();
  return (
    <div className="relative overflow-hidden rounded-[20px] shadow-lg bg-black max-w-md mx-4 sm:mx-auto">
      <img 
        src={image}
        alt={alt}
        className="w-full h-[220px] sm:h-[250px] md:h-[280px] object-cover block" 
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #b2182a9b, #0000008e)'
        }}
      />
      <div className="absolute left-6 right-6 bottom-6 z-5 text-white drop-shadow-lg">
        <h3 className="m-0 text-3xl sm:text-4xl font-extrabold leading-none">
          {title}
        </h3>
        <p className="mt-2 text-base sm:text-lg opacity-95">
          {description}
        </p>
      </div>
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