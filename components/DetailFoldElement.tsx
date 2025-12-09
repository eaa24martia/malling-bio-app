"use client";

import { useState } from "react";
import CreateButton from "./CreateButton";
import Modal from "./Modal";

type Seat = { row: number; seat: number };

export default function DetailFoldElement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("05/12");
  const [selectedTime, setSelectedTime] = useState("");

  // Selected seats state
  const [selectedSeatsList, setSelectedSeatsList] = useState<Seat[]>([
    { row: 2, seat: 4 },
    { row: 2, seat: 5 },
  ]);

  // Sample dates and times data
  const dates = [
    { label: "I dag", value: "03/12" },
    { label: "Tors.", value: "04/12" },
    { label: "Fre.", value: "05/12" },
    { label: "Lør.", value: "06/12" },
    { label: "Søn.", value: "07/12" },
    { label: "Man.", value: "08/12" },
  ];

  const times = [
    { time: "12.30", language: "Eng. tale", availability: "available" }, // green
    { time: "14.00", language: "Eng. tale", availability: "medium" }, // yellow
    { time: "20.00", language: "Eng. tale", availability: "low" }, // red
  ];

  const getTimeColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-[#4CAF50]"; // green
      case "medium":
        return "bg-[#FFC107]"; // yellow
      case "low":
        return "bg-[#F44336]"; // red
      default:
        return "bg-gray-500";
    }
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
              <CreateButton onClick={() => setIsModalOpen(true)}>Se tider</CreateButton>
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
              {dates.map((date) => (
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
                src="https://image.tmdb.org/t/p/w500/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg"
                alt="Wicked: Part II"
                className="w-32 h-44 object-cover rounded-lg"
              />
            </div>

            {/* Times */}
            <div className="flex-1 overflow-hidden">
              <h4 className="text-white text-[20px] font-bold mb-4">Wicked: Part II</h4>
              <div className="flex gap-3 overflow-x-auto pb-2 -mr-4 pr-4">
                {times.map((timeSlot, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedTime(timeSlot.time);
                      setIsModalOpen(false);
                      setIsSeatModalOpen(true);
                    }}
                    className={`${getTimeColor(timeSlot.availability)} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity shrink-0 min-w-[110px]`}
                  >
                    <div className="text-xl">{timeSlot.time}</div>
                    <div className="text-xs opacity-90">{timeSlot.language}</div>
                  </button>
                ))}
              </div>
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
  {(() => {
    const takenSeats = new Set(["1-3", "4-6", "4-7"]);

    return seatRows.map((count, rowIndex) => {
      const rowNumber = rowIndex + 1;
      if (count === 0) return <div key={rowIndex} className="h-3" />;

      // Extra spacing before row 8
      const isRow8 = rowNumber === 8;
      const rowClass = isRow8 ? "flex items-center justify-end gap-1 mr-[31] mt-4" : "flex items-center justify-center gap-1";

      return (
        <div key={rowIndex} className={rowClass}>
          {[...Array(count)].map((_, seatIndex) => {
            const seatNumber = seatIndex + 1;
            const seatKey = `${rowNumber}-${seatNumber}`;
            const selected = isSeatSelected(rowNumber, seatNumber);
            const isTaken = takenSeats.has(seatKey);
            const isHandicap = rowNumber === 7 && (seatNumber === 11 || seatNumber === 12);

            let imgSrc = "/assets/seat-red.svg";
            if (isTaken) imgSrc = "/assets/seat-indigo.svg";
            else if (selected) imgSrc = "/assets/seat-white.svg";
            else if (isHandicap) imgSrc = "/assets/seat-handicap.svg";

            const onClick = () => {
              if (isTaken) return;
              toggleSeatSelection(rowNumber, seatNumber);
            };

            return (
              <div key={seatIndex} className="flex items-center justify-center">
                {/* Fixed slot so visual size is identical */}
                <button
                  type="button"
                  onClick={onClick}
                  aria-pressed={selected}
                  aria-label={`Række ${rowNumber} sæde ${seatNumber}`}
                  className={`w-5 h-5 flex items-center justify-center rounded-md transition`}
                >
                  <img src={imgSrc} alt="seat" className="w-4 h-4" />
                  {/* hvis handicapsædet er valgt: overlay wheelchair */}
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
                <div className="text-[15px] font-bold">200 kr.</div>
              </div>

              <CreateButton
                size="small"
                onClick={() => {
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