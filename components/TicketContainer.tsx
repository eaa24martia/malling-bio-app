"use client";

// Importerer tema-hook
import { useTheme } from "@/contexts/ThemeContext";

// Sæde-type
type Seat = { row: number; seat: number };

// Ticket interface til typesikkerhed
interface Ticket {
  id: string;
  userId: string;
  userEmail: string;
  movieId: string;
  movieTitle: string;
  moviePosterUrl: string;
  showtimeId: string;
  datetime: Date;
  auditorium: string;
  language: string;
  pricePerSeat: number;
  seats: Seat[];
  totalPrice: number;
  totalSeats: number;
  purchaseDate: Date;
  status: "active" | "used" | "cancelled";
}

// Props til TicketCard
interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  // Henter high-contrast state fra tema-context
  const { isHighContrast } = useTheme();

  // Formaterer dato til dd/mm
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  };

  // Formaterer tid til hh.mm
  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}.${minutes}`;
  };

  // Returnerer dansk label for dag (I dag, I morgen, eller ugedag)
  const getDayLabel = (date: Date) => {
    const days = ['Søn.', 'Man.', 'Tirs.', 'Ons.', 'Tors.', 'Fre.', 'Lør.'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate.getTime() === today.getTime()) return 'I dag';
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (checkDate.getTime() === tomorrow.getTime()) return 'I morgen';
    
    return days[date.getDay()];
  };

  // Samlet formattering af dato og tid
  const formatDateTime = (date: Date) => {
    return `${formatTime(date)}, ${getDayLabel(date)} ${formatDate(date)}`;
  };

  // UI rendering af billetkort
  return (
    <div className="relative overflow-hidden rounded-[20px] shadow-lg max-w-2xl mx-auto h-40 sm:h-[180px]"
         style={{
           backgroundImage: `url(${ticket.moviePosterUrl})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
         }}>
      {/* Gradient overlay for læsbarhed */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isHighContrast
            ? 'linear-gradient(to bottom, #000000cc, #000000ee)'
            : 'linear-gradient(to bottom, #b2182a9b, #0000008e)'
        }}
      />
      
      <div className="relative z-5 flex items-center justify-between h-full p-4">
        {/* Billetinfo */}
        <div className="flex-1 text-white">
          <h2 className="text-[24px] font-extrabold leading-tight mb-2">
            {ticket.movieTitle}
          </h2>
          <p className="text-[16px] sm:text-base mb-2 opacity-95">
            {formatDateTime(ticket.datetime)}
          </p>
          
          <p className="text-lg sm:text-xl font-bold">
            {ticket.totalSeats} {ticket.totalSeats === 1 ? 'billet' : 'billetter'}
          </p>
        </div>

        {/* Filmplakat */}
        <div className="shrink-0 ml-3">
          <img 
            src={ticket.moviePosterUrl}
            alt={`${ticket.movieTitle} poster`}
            className="w-[100px] h-[130px] sm:w-[110px] sm:h-[145px] object-cover rounded-xl shadow-xl" 
          />
        </div>
      </div>
    </div>
  );
}