"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CreateButton from "./CreateButton";
import Modal from "./Modal";

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
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  // Selected seats state
  const [selectedSeatsList, setSelectedSeatsList] = useState<Seat[]>([]);

  useEffect(() => {
    loadShowtimes();
  }, [movieId]);

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

  const getShowtimesForDate = (dateStr: string) => {
    return showtimes.filter(st => formatDate(st.datetime) === dateStr);
  };

  const getAvailabilityColor = (showtime: Showtime) => {
    const percentAvailable = (showtime.seatsAvailable / showtime.totalSeats) * 100;
    if (percentAvailable > 50) return "bg-[#4CAF50]"; // green
    if (percentAvailable > 20) return "bg-[#FFC107]"; // yellow
    return "bg-[#F44336]"; // red
  };

  const handleSelectShowtime = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setIsModalOpen(false);
    setIsSeatModalOpen(true);
    setSelectedSeatsList([]); // Reset selected seats
  };

  // Convert flat seat array to 2D array
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

  const isSeatSelected = (row: number, seat: number) =>
    selectedSeatsList.some((s) => s.row === row && s.seat === seat);

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

  /* ----- Seat grid helper data ----- */
  // For simplicity: we'll define rows as arrays with seat counts and some example "special" seats.
  // You can replace these with real availability data later.
  const seatRows: number[] = [12, 12, 0, 12, 12, 12, 12, 4]; // row 3 is empty (screen spacing)

  return (
    <>
      <div
        className="w-full min-h-[360px] pb-20 rounded-[30px] relative overflow-hidden"
        style={{
          background: 'linear-gradient(to top, #400B10, #B2182B), url(/assets/backgrounds-3.svg)',
          backgroundSize: 'cover, cover',
          backgroundPosition: 'center, center',
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundBlendMode: 'multiply',
        }}
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

      {/* Times Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Se tider" size="md">
        <div className="relative min-h-full bg-[#410c1082] px-4 md:px-6 pb-4">
          {/* Date Selector */}
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

          {/* Movie Info & Times */}
          <section className="flex gap-4">
            {/* Movie Poster */}
            <div className="shrink-0">
              <img
                src={moviePosterUrl}
                alt={movieTitle}
                className="w-32 h-44 object-cover rounded-lg"
              />
            </div>

            {/* Times */}
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

      {/* Seat Selection Modal */}
      <Modal isOpen={isSeatModalOpen} onClose={() => setIsSeatModalOpen(false)} title="Sædevælger" size="md">
        <div className="relative bg-[#0e0607c0] px-0 pb-0 flex flex-col" style={{ height: 'calc(92vh - 55px)' }}>
          {/* Category legend — non-interactive */}
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

          {/* Screen */}
          <section className="mb-1 mt-6">
            <img src="/assets/screen.svg" alt="screen" className="w-48 object-cover justify-center mx-auto" />
          </section>

        {/* Seat Grid — fixed slot size so rows look identical */}
<section className="space-y-1 px-4 mb-3 flex-1 overflow-y-auto mt-4">
  {selectedShowtime && (() => {
    const seatMap = convertToSeatMap(selectedShowtime);

    return seatMap.map((rowSeats, rowIndex) => {
      const rowNumber = rowIndex + 1;

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
    });
  })()}
</section>

          {/* Selected Seats Summary */}
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
                  window.location.href = "/payment";
                }}
              >
                Betaling
              </CreateButton>
            </div>
          </section>
        </div>
      </Modal>
    </>
  );
}