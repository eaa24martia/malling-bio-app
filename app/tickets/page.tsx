"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import BottomNav from "@/components/BottomNav";
import RedHeader from "@/components/Header";
import TicketCard from "@/components/TicketContainer";
import Modal from "@/components/Modal";

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
        style={{
          backgroundImage: `url('assets/background-1.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>

        <section className="relative z-10">
          <RedHeader />
        </section>

        <div className="pt-20">
           <h1 className="font-bold text-center text-[#192B5A] mb-0 mt-5" style={{ fontSize: '30px' }}>
            Billetter
          </h1>
          <div className="h-0.5 bg-[#192B5A] my-4"></div>
        </div>

        <section className="space-y-6 pb-20 mb-10 px-4">
          {loading ? (
            <div className="text-center text-[#192B5A] py-10">
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
            <div className="text-center text-[#192B5A] py-10">
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
          <div className="relative min-h-full bg-[#410c1082] px-4 md:px-6 pb-20">
            {selectedTicket && (
              <div className="text-center py-8">
                 {/* QR Code */}
                <div className="bg-white rounded-lg p-4 mb-4 flex flex-col items-center mx-auto max-w-[200px]">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(selectedTicket.id)}`}
                    alt={`QR code for ticket ${selectedTicket.id}`}
                    className="w-40 h-40 object-contain"
                  />
                  <div className="text-center text-[#192B5A] text-xs mt-2 font-mono">
                    {selectedTicket.id.toUpperCase().slice(0, 12)}
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-white text-2xl font-bold mb-3">{selectedTicket.movieTitle}</div>
                  <div className="text-white/90 text-base mb-2">
                    {getDayLabel(selectedTicket.datetime)} {formatDate(selectedTicket.datetime)} kl. {formatTime(selectedTicket.datetime)}
                  </div>
                  <div className="text-white/80 text-sm mb-1">
                    {selectedTicket.auditorium} • {selectedTicket.language}
                  </div>
                </div>

                <div className="bg-[#F5E6D3] rounded-lg p-6 mb-6">
                  <h3 className="text-[#B2182B] font-bold text-lg mb-4">Dine sæder:</h3>
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {selectedTicket.seats.map((seat, i) => (
                      <div key={i} className="bg-[#B2182B] text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Række {seat.row}, Sæde {seat.seat}
                      </div>
                    ))}
                  </div>
                  <div className="border-t-2 border-[#B2182B]/20 pt-4 mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#192B5A] text-sm">Antal billetter:</span>
                      <span className="text-[#192B5A] font-bold">{selectedTicket.totalSeats}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#192B5A] text-sm">Pris per billet:</span>
                      <span className="text-[#192B5A] font-bold">{selectedTicket.pricePerSeat} kr.</span>
                    </div>
                    <div className="flex justify-between items-center text-lg pt-2 border-t border-[#B2182B]/30">
                      <span className="text-[#B2182B] font-bold">Total:</span>
                      <span className="text-[#B2182B] font-bold">{selectedTicket.totalPrice} kr.</span>
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