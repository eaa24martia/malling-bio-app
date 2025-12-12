// DetailFoldElement-komponent: Håndterer visning og booking af forestillinger, sædevalg, betaling og billetbekræftelse
"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import CreateButton from "./CreateButton";
import Modal from "./Modal";
import PaymentContainer from "./PaymentContainer";
import { useTheme } from "@/contexts/ThemeContext";

// Typer for sæder og forestillinger
type Seat = { row: number; seat: number };

interface Showtime {
  id: string;
  movieId: string;
  datetime: Date;
  auditorium: string;
  language: string;
  price: number;
  totalSeats: number;
  seatsAvailable: number;
  seatMap: SeatStatus[] | SeatStatus[][]; // Support both flat and 2D arrays
  seatMapRows?: number;
  seatMapCols?: number;
  status: "on_sale" | "cancelled";
}

interface SeatStatus {
  row: number;
  seat: number;
  status: "available" | "taken" | "handicap";
}

interface DetailFoldElementProps {
  movieId: string;
  movieTitle: string;
  moviePosterUrl: string;
}

export default function DetailFoldElement({ movieId, movieTitle, moviePosterUrl }: DetailFoldElementProps) {
  // Henter high-contrast state fra tema-context
  const { isHighContrast } = useTheme();
  // State til forestillinger, valg, modaler og sæder
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTicketConfirmationOpen, setIsTicketConfirmationOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  // Valgte sæder
  const [selectedSeatsList, setSelectedSeatsList] = useState<Seat[]>([]);

  // Hent forestillinger fra Firestore ved load/ændring af film
  useEffect(() => {
    loadShowtimes();
  }, [movieId]);

  // Loader forestillinger for filmen
  const loadShowtimes = async () => {
    try {
      const showtimesRef = collection(db, "showtimes");
      const q = query(
        showtimesRef, 
        where("movieId", "==", movieId),
        where("status", "==", "on_sale")
      );
      const snapshot = await getDocs(q);
      const showtimesData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          datetime: data.datetime?.toDate(),
        } as Showtime;
      });
      setShowtimes(showtimesData.sort((a, b) => a.datetime.getTime() - b.datetime.getTime()));
      
      // Set initial selected date to first showtime date
      if (showtimesData.length > 0) {
        const firstDate = formatDate(showtimesData[0].datetime);
        setSelectedDate(firstDate);
      }
    } catch (error) {
      console.error("Error loading showtimes:", error);
    }
  };

  // Formaterer dato og tid til visning
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

  // Returnerer unikke datoer for forestillinger
  const getDayLabel = (date: Date) => {
    const days = ['Søn.', 'Man.', 'Tirs.', 'Ons.', 'Tors.', 'Fre.', 'Lør.'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate.getTime() === today.getTime()) return 'I dag';
    return days[date.getDay()];
  };

  const getUniqueDates = () => {
    const dateSet = new Set<string>();
    return showtimes.filter(st => {
      const dateStr = formatDate(st.datetime);
      if (dateSet.has(dateStr)) return false;
      dateSet.add(dateStr);
      return true;
    }).map(st => ({
      label: getDayLabel(st.datetime),
      value: formatDate(st.datetime),
      date: st.datetime
    }));
  };

  // Returnerer forestillinger for valgt dato
  const getShowtimesForDate = (dateStr: string) => {
    return showtimes.filter(st => formatDate(st.datetime) === dateStr);
  };

  // Returnerer farve for tilgængelighed (grøn/gul/rød)
  const getAvailabilityColor = (showtime: Showtime) => {
    const percentAvailable = (showtime.seatsAvailable / showtime.totalSeats) * 100;
    if (percentAvailable > 50) return "bg-[#4CAF50]"; // green
    if (percentAvailable > 20) return "bg-[#FFC107]"; // yellow
    return "bg-[#F44336]"; // red
  };

  // Håndter valg af forestilling og loader sædekort
  const handleSelectShowtime = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setIsModalOpen(false);
    setSelectedSeatsList([]); // Reset selected seats
    // Reload showtime data to get latest seat availability
    loadCurrentSeatMap(showtime.id);
  };

  // Loader sædekort for valgt forestilling
  const loadCurrentSeatMap = async (showtimeId: string) => {
    try {
      const showtimeRef = doc(db, "showtimes", showtimeId);
      const showtimeDoc = await getDoc(showtimeRef);
      
      if (showtimeDoc.exists()) {
        const data = showtimeDoc.data();
        const updatedShowtime = {
          id: showtimeDoc.id,
          ...data,
          datetime: data.datetime?.toDate(),
        } as Showtime;
        setSelectedShowtime(updatedShowtime);
        setIsSeatModalOpen(true);
      }
    } catch (error) {
      console.error("Error loading seat map:", error);
      setIsSeatModalOpen(true); // Open modal anyway with cached data
    }
  };

  // Konverterer sædekort til 2D-array hvis nødvendigt
  const convertToSeatMap = (showtime: Showtime): SeatStatus[][] => {
    const seatMap = showtime.seatMap;
    
    // If already 2D array, return as is
    if (Array.isArray(seatMap) && seatMap.length > 0 && Array.isArray(seatMap[0])) {
      return seatMap as SeatStatus[][];
    }
    
    // Convert flat array to 2D array
    const flatSeats = seatMap as SeatStatus[];
    const rows = showtime.seatMapRows || 8;
    const cols = showtime.seatMapCols || 12;
    const result: SeatStatus[][] = [];
    
    for (let i = 0; i < rows; i++) {
      const rowSeats = flatSeats.slice(i * cols, (i + 1) * cols);
      result.push(rowSeats);
    }
    
    return result;
  };

  /* ----- Helper: toggle seat in selectedSeatsList ----- */
  const toggleSeatSelection = (row: number, seat: number) => {
    setSelectedSeatsList((prev) => {
      const exists = prev.some((s) => s.row === row && s.seat === seat);
      if (exists) return prev.filter((s) => !(s.row === row && s.seat === seat));
      return [...prev, { row, seat }];
    });
  };

  // Tjek om sæde er valgt
  const isSeatSelected = (row: number, seat: number) =>
    selectedSeatsList.some((s) => s.row === row && s.seat === seat);

  // Håndterer betaling og opretter billet i Firestore
  const handlePaymentSuccess = async () => {
    try {
      const user = auth.currentUser;
      if (!user || !selectedShowtime) {
        console.error("No user or showtime selected");
        return;
      }

      // Opretter billetdata
      const ticketData = {
        userId: user.uid,
        userEmail: user.email,
        movieId: movieId,
        movieTitle: movieTitle,
        moviePosterUrl: moviePosterUrl,
        showtimeId: selectedShowtime.id,
        datetime: selectedShowtime.datetime,
        auditorium: selectedShowtime.auditorium,
        language: selectedShowtime.language,
        pricePerSeat: selectedShowtime.price,
        seats: selectedSeatsList,
        totalPrice: selectedSeatsList.length * selectedShowtime.price,
        totalSeats: selectedSeatsList.length,
        purchaseDate: serverTimestamp(),
        status: "active", // active, used, cancelled
      };

      // Gem billet til Firestore
      const ticketsRef = collection(db, "tickets");
      await addDoc(ticketsRef, ticketData);

      // Opdater sædekort for at markere sæder som optaget
      await updateSeatMapWithTakenSeats(selectedShowtime.id, selectedSeatsList);

      console.log("Ticket saved successfully!");

      // Luk betalingsmodal og vis bekræftelse
      setIsPaymentModalOpen(false);
      setIsTicketConfirmationOpen(true);
    } catch (error) {
      console.error("Error saving ticket:", error);
      alert("Der opstod en fejl ved gem af billetten. Prøv venligst igen.");
    }
  };

  // Opdaterer sædekort i Firestore efter køb
  const updateSeatMapWithTakenSeats = async (showtimeId: string, seats: Seat[]) => {
    try {
      const showtimeRef = doc(db, "showtimes", showtimeId);
      const showtimeDoc = await getDoc(showtimeRef);
      
      if (!showtimeDoc.exists()) {
        console.error("Showtime not found");
        return;
      }

      const showtimeData = showtimeDoc.data();
      let seatMap = showtimeData.seatMap;

      // Check if seatMap is 2D array or flat array
      const is2D = Array.isArray(seatMap) && seatMap.length > 0 && Array.isArray(seatMap[0]);

      if (is2D) {
        // Handle 2D array
        seatMap = seatMap.map((row: SeatStatus[]) => 
          row.map((seatData: SeatStatus) => {
            const isTaken = seats.some(s => s.row === seatData.row && s.seat === seatData.seat);
            if (isTaken) {
              return { ...seatData, status: "taken" as const };
            }
            return seatData;
          })
        );
      } else {
        // Handle flat array
        seatMap = (seatMap as SeatStatus[]).map((seatData: SeatStatus) => {
          const isTaken = seats.some(s => s.row === seatData.row && s.seat === seatData.seat);
          if (isTaken) {
            return { ...seatData, status: "taken" as const };
          }
          return seatData;
        });
      }

      // Calculate new seatsAvailable count
      const flatSeatMap = is2D ? (seatMap as SeatStatus[][]).flat() : (seatMap as SeatStatus[]);
      const seatsAvailable = flatSeatMap.filter(s => s.status === "available").length;

      // Update Firestore
      await updateDoc(showtimeRef, {
        seatMap: seatMap,
        seatsAvailable: seatsAvailable
      });

      console.log("Seat map updated successfully");
    } catch (error) {
      console.error("Error updating seat map:", error);
    }
  };

  // Komponent til visning af valgte sæder
  function SeatCard({ row, seat, onRemove }: { row: number; seat: number; onRemove?: () => void }) {
    return (
      <div className="flex items-center gap-2 bg-[#B2182B] rounded-lg px-3 py-2 relative">
        <span className="text-white text-sm font-medium">Række {row}</span>
        <span className="text-white/60 text-xs">•</span>
        <span className="text-white text-sm font-medium">Sæde {seat}</span>

        {/* fjern-knap */}
        {onRemove && (
          <button
            onClick={onRemove}
            className="ml-2 w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition text-xs"
            aria-label={`Fjern række ${row} sæde ${seat}`}
          >
            ✕
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Baggrund og call-to-action for at se tider */}
      <div
        className="w-full min-h-[360px] pb-20 rounded-[30px] relative overflow-hidden"
        style={
          isHighContrast
            ? {
                background: 'linear-gradient(to top, #000000, #000000)',
                backgroundSize: 'cover, cover',
                backgroundPosition: 'center, center',
                backgroundRepeat: 'no-repeat, no-repeat',
                backgroundBlendMode: 'multiply',
              }
            : {
                background: 'linear-gradient(to top, #400B10, #B2182B), url(/assets/backgrounds-3.svg)',
                backgroundSize: 'cover, cover',
                backgroundPosition: 'center, center',
                backgroundRepeat: 'no-repeat, no-repeat',
                backgroundBlendMode: 'multiply',
              }
        }
      >
        <section className="absolute inset-0 flex items-center justify-center mt-[-70]">
          <div className="relative">
            <img src="/assets/ticket-element.svg" alt="" className="w-75 h-auto" />
            <div className="absolute inset-0 flex items-center justify-center mt-[-10]">
              {showtimes.length > 0 ? (
                <CreateButton onClick={() => setIsModalOpen(true)}>Se tider</CreateButton>
              ) : (
                <div className="text-white text-center">
                  <p className="text-sm">Ingen forestillinger tilgængelige</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Modal til valg af forestillingstidspunkt */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Se tider" size="md">
        <div className="relative min-h-full px-4 md:px-6 pb-4" style={{ background: isHighContrast ? '#000' : '#410c1082' }}>
          {/* Dato Selector */}
          <section className="pt-6 pb-4">
            <h3 className="text-white text-sm font-semibold mb-3">Datoer</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {getUniqueDates().map((date) => (
                <button
                  key={date.value}
                  onClick={() => setSelectedDate(date.value)}
                  className={`shrink-0 flex flex-col items-center justify-center px-4 py-2 rounded-lg min-w-[70px] transition-colors ${
                    selectedDate === date.value ? "bg-[#B2182B] text-white" : "bg-[#5A1419] text-white/70"
                  }`}
                >
                  <span className="text-xs">{date.label}</span>
                  <span className="text-sm font-bold">{date.value}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-white mb-6" />

          {/* Film Info & Tider */}
          <section className="flex gap-4">
            {/* Film Plakat */}
            <div className="shrink-0">
              <img
                src={moviePosterUrl}
                alt={movieTitle}
                className="w-32 h-44 object-cover rounded-lg"
              />
            </div>

            {/* Tider */}
            <div className="flex-1 overflow-hidden">
              <h4 className="text-white text-[20px] font-bold mb-4">{movieTitle}</h4>
              <div className="flex gap-3 overflow-x-auto pb-2 -mr-4 pr-4">
                {getShowtimesForDate(selectedDate).map((showtime) => (
                  <button
                    key={showtime.id}
                    onClick={() => handleSelectShowtime(showtime)}
                    className={`${getAvailabilityColor(showtime)} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity shrink-0 min-w-[110px]`}
                  >
                    <div className="text-xl">{formatTime(showtime.datetime)}</div>
                    <div className="text-xs opacity-90">{showtime.language}</div>
                  </button>
                ))}
              </div>
              {getShowtimesForDate(selectedDate).length === 0 && (
                <p className="text-white/70 text-sm">Ingen forestillinger denne dag</p>
              )}
            </div>
          </section>
        </div>
      </Modal>

      {/* Modal til sædevalg */}
      <Modal 
        isOpen={isSeatModalOpen} 
        onClose={() => setIsSeatModalOpen(false)} 
        title="Sædevælger" 
        size="md"
        onBack={() => {
          setIsSeatModalOpen(false);
          setIsModalOpen(true);
        }}
      >
        <div className="relative px-0 pb-0 flex flex-col" style={{ height: 'calc(92vh - 55px)', background: isHighContrast ? '#000' : '#0e0607c0' }}>
          {/* Kategori legend — non-interactive */}
          <section className="pt-2 pb-0 px-4 bg-[#670612]">
  <div className="flex items-center justify-between pb-2">

    {/* Ledige */}
    <div className="flex items-center gap-1.5 text-white text-xs">
      <img src="/assets/seat-red.svg" alt="Ledige" className="w-5 h-5" />
      Ledige
    </div>

    {/* Dine sæder */}
    <div className="flex items-center gap-1.5 text-white text-xs">
      <img src="/assets/seat-white.svg" alt="Dine sæder" className="w-5 h-5" />
      Dine sæder
    </div>

    {/* Optaget */}
    <div className="flex items-center gap-1.5 text-white text-xs">
      <img src="/assets/seat-indigo.svg" alt="Optaget" className="w-5 h-5" />
      Optaget
    </div>

    {/* Handicap */}
    <div className="flex items-center gap-1.5 text-white text-xs">
      <img src="/assets/seat-handicap.svg" alt="Handicap" className="w-5 h-5" />
      Handicap
    </div>

  </div>
</section>

          {/* Skærm */}
          <section className="mb-1 mt-6">
            <img src="/assets/screen.svg" alt="screen" className="w-48 object-cover justify-center mx-auto" />
          </section>

        {/* Seat Grid — fixed slot size so rows look identical */}
<section className="space-y-1 px-4 mb-3 flex-1 overflow-y-auto mt-4">
  {selectedShowtime && (() => {
    const seatMap = convertToSeatMap(selectedShowtime);
    const isSal1 = selectedShowtime.auditorium === "Sal 1";

    return seatMap.map((rowSeats, rowIndex) => {
      const rowNumber = rowIndex + 1;

      // === SAL 1 LAYOUT ===
      if (isSal1) {
        // --- Row 3 spacer: empty row for screen spacing --- 
        if (rowIndex === 2) {
          return <div key={rowIndex} className="h-8" />; // spacer instead of row 3
        }

        // --- Row 8 (index 7): only 4 handicap seats on the right ---
        if (rowIndex === 7) {
          const last4 = rowSeats.slice(-4); // last 4 seats
          return (
            <div key={rowIndex} className="flex items-center justify-center gap-1 mt-6">
              {/* Empty space for first 8 seats to align with other rows */}
              {Array(8).fill(null).map((_, i) => (
                <div key={`empty-${i}`} className="w-5 h-5" />
              ))}
              {/* Last 4 handicap seats */}
              {last4.map((seatData, seatIndex) => {
                const { row, seat, status } = seatData;
                const selected = isSeatSelected(row, seat);
                const isTaken = status === "taken";
                const isHandicap = status === "handicap";

                let imgSrc = "/assets/seat-red.svg";
                if (isTaken) imgSrc = "/assets/seat-indigo.svg";
                else if (selected) imgSrc = "/assets/seat-white.svg";
                else if (isHandicap) imgSrc = "/assets/seat-handicap.svg";

                const onClick = () => {
                  if (isTaken) return;
                  toggleSeatSelection(row, seat);
                };

                return (
                  <div key={seatIndex} className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={onClick}
                      aria-pressed={selected}
                      aria-label={`Række ${row} sæde ${seat}`}
                      className="w-5 h-5 flex items-center justify-center rounded-md transition"
                    >
                      <img src={imgSrc} alt="seat" className="w-4 h-4" />
                      {isHandicap && selected && (
                        <span className="absolute flex items-center justify-center pointer-events-none">
                          <img src="/assets/seat-handicap.svg" alt="handicap" className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
              <span className="text-white text-[10px] ml-1">{rowNumber}</span>
            </div>
          );
        }

        // --- Default rendering for rows 1, 2, 4, 5, 6, 7 (all 12 seats) ---
        return (
          <div key={rowIndex} className="flex items-center justify-center gap-1">
            {rowSeats.map((seatData, seatIndex) => {
              const { row, seat, status } = seatData;
              const selected = isSeatSelected(row, seat);
              const isTaken = status === "taken";
              const isHandicap = status === "handicap";

              let imgSrc = "/assets/seat-red.svg";
              if (isTaken) imgSrc = "/assets/seat-indigo.svg";
              else if (selected) imgSrc = "/assets/seat-white.svg";
              else if (isHandicap) imgSrc = "/assets/seat-handicap.svg";

              const onClick = () => {
                if (isTaken) return;
                toggleSeatSelection(row, seat);
              };

              return (
                <div key={seatIndex} className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={onClick}
                    aria-pressed={selected}
                    aria-label={`Række ${row} sæde ${seat}`}
                    className="w-5 h-5 flex items-center justify-center rounded-md transition"
                  >
                    <img src={imgSrc} alt="seat" className="w-4 h-4" />
                    {isHandicap && selected && (
                      <span className="absolute flex items-center justify-center pointer-events-none">
                        <img src="/assets/seat-handicap.svg" alt="handicap" className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
            <span className="text-white text-[10px] ml-1">{rowNumber}</span>
          </div>
        );
      }

      if (rowIndex >= 6) {
        return null;
      }

      if (rowIndex === 5) {
        return (
          <div key={`spacer-${rowIndex}`}>
            <div className="h-6" />
            <div className="flex items-center justify-center gap-1">
              {rowSeats.slice(0, 6).map((seatData, seatIndex) => {
                const { row, seat, status } = seatData;
                const selected = isSeatSelected(row, seat);
                const isTaken = status === "taken";
                const isHandicap = status === "handicap";

                let imgSrc = "/assets/seat-red.svg";
                if (isTaken) imgSrc = "/assets/seat-indigo.svg";
                else if (selected) imgSrc = "/assets/seat-white.svg";
                else if (isHandicap) imgSrc = "/assets/seat-handicap.svg";

                const onClick = () => {
                  if (isTaken) return;
                  toggleSeatSelection(row, seat);
                };

                return (
                  <div key={seatIndex} className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={onClick}
                      aria-pressed={selected}
                      aria-label={`Række ${row} sæde ${seat}`}
                      className="w-5 h-5 flex items-center justify-center rounded-md transition"
                    >
                      <img src={imgSrc} alt="seat" className="w-4 h-4" />
                      {isHandicap && selected && (
                        <span className="absolute flex items-center justify-center pointer-events-none">
                          <img src="/assets/seat-handicap.svg" alt="handicap" className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
              <span className="text-white text-[10px] ml-1">{rowNumber}</span>
            </div>
          </div>
        );
      }

      // --- Rows 1-3: show only first 5 seats + empty space to align with 6-seat rows ---
      if (rowIndex <= 2) {
        return (
          <div key={rowIndex} className="flex items-center justify-center gap-1">
            {rowSeats.slice(0, 5).map((seatData, seatIndex) => {
              const { row, seat, status } = seatData;
              const selected = isSeatSelected(row, seat);
              const isTaken = status === "taken";
              const isHandicap = status === "handicap";

              let imgSrc = "/assets/seat-red.svg";
              if (isTaken) imgSrc = "/assets/seat-indigo.svg";
              else if (selected) imgSrc = "/assets/seat-white.svg";
              else if (isHandicap) imgSrc = "/assets/seat-handicap.svg";

              const onClick = () => {
                if (isTaken) return;
                toggleSeatSelection(row, seat);
              };

              return (
                <div key={seatIndex} className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={onClick}
                    aria-pressed={selected}
                    aria-label={`Række ${row} sæde ${seat}`}
                    className="w-5 h-5 flex items-center justify-center rounded-md transition"
                  >
                    <img src={imgSrc} alt="seat" className="w-4 h-4" />
                    {isHandicap && selected && (
                      <span className="absolute flex items-center justify-center pointer-events-none">
                        <img src="/assets/seat-handicap.svg" alt="handicap" className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
            {/* Empty placeholder to align with 6-seat rows */}
            <div className="w-5 h-5" />
            <span className="text-white text-[10px] ml-1">{rowNumber}</span>
          </div>
        );
      }

      // --- Rows 4-5: show first 6 seats ---
      return (
        <div key={rowIndex} className="flex items-center justify-center gap-1">
          {rowSeats.slice(0, 6).map((seatData, seatIndex) => {
            const { row, seat, status } = seatData;
            const selected = isSeatSelected(row, seat);
            const isTaken = status === "taken";
            const isHandicap = status === "handicap";

            let imgSrc = "/assets/seat-red.svg";
            if (isTaken) imgSrc = "/assets/seat-indigo.svg";
            else if (selected) imgSrc = "/assets/seat-white.svg";
            else if (isHandicap) imgSrc = "/assets/seat-handicap.svg";

            const onClick = () => {
              if (isTaken) return;
              toggleSeatSelection(row, seat);
            };

            return (
              <div key={seatIndex} className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={onClick}
                  aria-pressed={selected}
                  aria-label={`Række ${row} sæde ${seat}`}
                  className="w-5 h-5 flex items-center justify-center rounded-md transition"
                >
                  <img src={imgSrc} alt="seat" className="w-4 h-4" />
                  {isHandicap && selected && (
                    <span className="absolute flex items-center justify-center pointer-events-none">
                      <img src="/assets/seat-handicap.svg" alt="handicap" className="w-3 h-3" />
                    </span>
                  )}
                </button>
              </div>
            );
          })}
          <span className="text-white text-[10px] ml-1">{rowNumber}</span>
        </div>
      );
    });
  })()}
</section>

          {/* Valgte Sæder Resumé */}
          <section className="bg-linear-to-b from-[#5A1419] to-[#b2182a] rounded-t-2xl p-3 pt-4 mt-auto">
            <h3 className="text-white text-sm font-bold mb-2 text-center">Valgte sæder</h3>

            <div className="h-0.5 bg-white/80 mb-3 mx-4 rounded" />

            <div className="flex gap-2 px-2 mb-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
              {selectedSeatsList.length === 0 ? (
                <div className="text-white/80 text-sm mx-auto">Ingen sæder valgt</div>
              ) : (
                selectedSeatsList.map((s, i) => (
                  <div key={i} className="shrink-0">
                    <SeatCard
                      row={s.row}
                      seat={s.seat}
                      onRemove={() =>
                        setSelectedSeatsList((prev) => prev.filter((x) => !(x.row === s.row && x.seat === s.seat)))
                      }
                    />
                  </div>
                ))
              )}
            </div>

            {/* Footer with price and buttons */}
            <div className="flex items-center justify-between gap-1 bg-[#F5E6D3] -mx-3 -mb-3 px-4 py-3">
              <div className="bg-[#B2182B] text-[#F5E6D3] px-3 py-1.5 rounded-full font-bold text-xs">
                {selectedSeatsList.length} billetter
              </div>

              <div className="text-[#B2182B] flex-center flex-row">
                <div className="text-[12px]">Inkl. gebyr</div>
                <div className="text-[15px] font-bold">
                  {selectedShowtime ? selectedSeatsList.length * selectedShowtime.price : 0} kr.
                </div>
              </div>

              <CreateButton
                size="small"
                onClick={() => {
                  if (selectedSeatsList.length === 0) {
                    alert("Vælg venligst mindst ét sæde");
                    return;
                  }
                  setIsSeatModalOpen(false);
                  setIsPaymentModalOpen(true);
                }}
              >
                Betaling
              </CreateButton>
            </div>
          </section>
        </div>
      </Modal>

      {/* Modal til betaling */}
      <Modal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        title="Betaling" 
        size="md"
        onBack={() => {
          setIsPaymentModalOpen(false);
          setIsSeatModalOpen(true);
        }}
      >
        <div className="relative min-h-full px-4 md:px-6 pb-4" style={{ background: isHighContrast ? '#000' : '#410c1082' }}>
          <PaymentContainer 
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
      </Modal>

      {/* Modal til billetbekræftelse */}
      <Modal isOpen={isTicketConfirmationOpen} onClose={() => setIsTicketConfirmationOpen(false)} title="Din billet" size="md">
        <div className="relative min-h-full px-4 md:px-6 pb-4" style={{ background: isHighContrast ? '#000' : '#410c1082' }}>
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="text-white text-xl font-bold mb-2">{movieTitle}</div>
              {selectedShowtime && (
                <>
                  <div className="text-white/80 text-[16px] mb-1">
                    {getDayLabel(selectedShowtime.datetime)} {formatDate(selectedShowtime.datetime)} - {formatTime(selectedShowtime.datetime)}
                  </div>
                  <div className="text-white/80 text-[16px] mb-1">
                    {selectedShowtime.auditorium} • {selectedShowtime.language}
                  </div>
                </>
              )}
            </div>

            <div className="bg-[#F5E6D3] rounded-lg p-4 mb-6">
              <h3 className="text-[#B2182B] font-bold mb-3">Dine sæder:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedSeatsList.map((s, i) => (
                  <div key={i} className="bg-[#B2182B] text-white px-3 py-1 rounded-full text-sm">
                    Række {s.row}, Sæde {s.seat}
                  </div>
                ))}
              </div>
              {selectedShowtime && (
                <div className="mt-4 text-[#B2182B] font-bold text-lg">
                  Total: {selectedSeatsList.length * selectedShowtime.price} kr.
                </div>
              )}
            </div>

            <div className="text-white/70 text-sm mb-6">
              Billetten kan findes under "Billetter" eller "Mine billetter" under din profil.
            </div>

            <CreateButton onClick={() => setIsTicketConfirmationOpen(false)}>
              Færdig
            </CreateButton>
          </div>
        </div>
      </Modal>
    </>
  );
}