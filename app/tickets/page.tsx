"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import BottomNav from "@/components/BottomNav";
import RedHeader from "@/components/Header";
import TicketCard from "@/components/TicketContainer";
import Modal from "@/components/Modal";
import { useTheme } from "@/contexts/ThemeContext";

type Seat = { row: number; seat: number };

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

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isHighContrast } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadUserTickets(user.uid);
      } else {
        setTickets([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserTickets = async (userId: string) => {
    try {
      const ticketsRef = collection(db, "tickets");
      const q = query(
        ticketsRef,
        where("userId", "==", userId),
        where("status", "==", "active"),
        orderBy("purchaseDate", "desc")
      );
      const snapshot = await getDocs(q);
      const ticketsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          datetime: data.datetime?.toDate ? data.datetime.toDate() : new Date(data.datetime),
          purchaseDate: data.purchaseDate?.toDate ? data.purchaseDate.toDate() : new Date(),
        } as Ticket;
      });
      setTickets(ticketsData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading tickets:", error);
      setLoading(false);
    }
  };

  const isExpired = (datetime: Date) => {
    const now = new Date();
    return datetime < now;
  };

  const handleTicketClick = (ticket: Ticket) => {
    if (!isExpired(ticket.datetime)) {
      setSelectedTicket(ticket);
      setIsModalOpen(true);
    }
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}.${minutes}`;
  };

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

  return (
    <main className="min-h-screen relative"
      style={
        isHighContrast
          ? {
              backgroundColor: "#000",
              color: "var(--text)"
            }
          : {
              backgroundImage: `url('assets/background-1.svg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }
      }>

      <section className="relative z-10">
        <RedHeader />
      </section>

      <div className="pt-20">
        <h1 className="font-bold text-center mb-0 mt-5" style={{ fontSize: '30px', color: isHighContrast ? 'var(--text)' : '#192B5A' }}>
          Billetter
        </h1>
        <div className="h-0.5 my-4 w-full" style={{ backgroundColor: isHighContrast ? 'var(--border)' : '#192B5A' }}></div>
      </div>

      <section className="space-y-6 pb-20 mb-10 px-4">
        {loading ? (
          <div className="text-center py-10" style={{ color: isHighContrast ? 'var(--text)' : '#192B5A' }}>
            <p>Indlæser billetter...</p>
          </div>
        ) : tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div 
              key={ticket.id} 
              onClick={() => handleTicketClick(ticket)}
              className={`${isExpired(ticket.datetime) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02] transition-transform'}`}
            >
              <TicketCard ticket={ticket} />
            </div>
          ))
        ) : (
          <div className="text-center py-10" style={{ color: isHighContrast ? 'var(--text)' : '#192B5A' }}>
            <p className="text-lg font-semibold">Ingen billetter fundet</p>
            <p className="text-sm mt-2">Dine købte billetter vil vises her</p>
          </div>
        )}
      </section>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Ticket Detail Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Din billet" 
        size="md"
      >
        <div className="relative min-h-full px-4 md:px-6 pb-20" style={{ background: isHighContrast ? 'var(--surface)' : '#410c1082' }}>
          {selectedTicket && (
            <div className="text-center py-8">
              {/* QR Code */}
              <div className="bg-white rounded-lg p-4 mb-4 flex flex-col items-center mx-auto max-w-[200px]" style={{ background: isHighContrast ? 'var(--surface)' : '#fff' }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(selectedTicket.id)}`}
                  alt={`QR code for ticket ${selectedTicket.id}`}
                  className="w-40 h-40 object-contain"
                />
                <div className="text-center text-xs mt-2 font-mono" style={{ color: isHighContrast ? 'var(--text)' : '#192B5A' }}>
                  {selectedTicket.id.toUpperCase().slice(0, 12)}
                </div>
              </div>
              <div className="mb-6">
                <div className="text-2xl font-bold mb-3" style={{ color: isHighContrast ? 'var(--text)' : '#fff' }}>
                  {selectedTicket.movieTitle}
                </div>
                <div className="text-base mb-2" style={{ color: isHighContrast ? 'var(--text)' : 'rgba(255,255,255,0.9)' }}>
                  {getDayLabel(selectedTicket.datetime)} {formatDate(selectedTicket.datetime)} kl. {formatTime(selectedTicket.datetime)}
                </div>
                <div className="text-sm mb-1" style={{ color: isHighContrast ? 'var(--text)' : 'rgba(255,255,255,0.8)' }}>
                  {selectedTicket.auditorium} • {selectedTicket.language}
                </div>
              </div>
              <div className="rounded-lg p-6 mb-20" style={{ background: isHighContrast ? 'var(--surface)' : '#F5E6D3' }}>
                <h3 className="font-bold text-lg mb-4" style={{ color: isHighContrast ? 'var(--accent)' : '#B2182B' }}>
                  Dine sæder:
                </h3>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {selectedTicket.seats.map((seat, i) => (
                    <div key={i} className="px-4 py-2 rounded-full text-sm font-semibold" style={{ background: isHighContrast ? 'var(--accent)' : '#B2182B', color: isHighContrast ? 'var(--accent-contrast)' : '#fff' }}>
                      Række {seat.row}, Sæde {seat.seat}
                    </div>
                  ))}
                </div>
                <div className="border-t-2 pt-4 mt-4" style={{ borderColor: isHighContrast ? 'var(--border)' : 'rgba(178,24,43,0.2)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm" style={{ color: isHighContrast ? 'var(--text)' : '#192B5A' }}>Antal billetter:</span>
                    <span className="font-bold" style={{ color: isHighContrast ? 'var(--text)' : '#192B5A' }}>{selectedTicket.totalSeats}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm" style={{ color: isHighContrast ? 'var(--text)' : '#192B5A' }}>Pris per billet:</span>
                    <span className="font-bold" style={{ color: isHighContrast ? 'var(--text)' : '#192B5A' }}>{selectedTicket.pricePerSeat} kr.</span>
                  </div>
                  <div className="flex justify-between items-center text-lg pt-2 border-t" style={{ borderColor: isHighContrast ? 'var(--border)' : 'rgba(178,24,43,0.3)' }}>
                    <span className="font-bold" style={{ color: isHighContrast ? 'var(--accent)' : '#B2182B' }}>Total:</span>
                    <span className="font-bold" style={{ color: isHighContrast ? 'var(--accent)' : '#B2182B' }}>{selectedTicket.totalPrice} kr.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </main>
  );
}