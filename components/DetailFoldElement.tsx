"use client";

import { useState } from "react";
import CreateButton from "./CreateButton";
import Modal from "./Modal";

export default function DetailFoldElement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("05/12");
  const [selectedTime, setSelectedTime] = useState("");

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

  return (
    <>
      <div 
        className="w-full min-h-[360px] pb-20 rounded-[30px] relative overflow-hidden"
        style={{
          background: 'linear-gradient(to top, #400B10, #B2182B), url(/assets/backgrounds-3.svg)',
          backgroundSize: 'cover, cover',
          backgroundPosition: 'center, center',
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundBlendMode: 'multiply'
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
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Se tider"
        size="md"
      >
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
                    selectedDate === date.value
                      ? "bg-[#B2182B] text-white"
                      : "bg-[#5A1419] text-white/70"
                  }`}
                >
                  <span className="text-xs">{date.label}</span>
                  <span className="text-sm font-bold">{date.value}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-white mb-6"></div>

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
      <Modal
        isOpen={isSeatModalOpen}
        onClose={() => setIsSeatModalOpen(false)}
        title="Sædevælger"
        size="md"
      >
        <div className="relative min-h-full bg-[#410c1082] px-4 md:px-6 pb-8">
          {/* Category Tabs */}
          <section className="pt-6 pb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button className="shrink-0 px-4 py-2 rounded-lg bg-[#B2182B] text-white text-sm flex items-center gap-2">
                <span className="inline-block w-4 h-4 bg-[#B2182B] rounded"></span>
                Ledige
              </button>
              <button className="shrink-0 px-4 py-2 rounded-lg bg-[#5A1419] text-white/70 text-sm flex items-center gap-2">
                <span className="inline-block w-4 h-4 bg-gray-400 rounded"></span>
                Dine sæder
              </button>
              <button className="shrink-0 px-4 py-2 rounded-lg bg-[#5A1419] text-white/70 text-sm flex items-center gap-2">
                <span className="inline-block w-4 h-4 bg-[#4A90E2] rounded"></span>
                Optaget
              </button>
              <button className="shrink-0 px-4 py-2 rounded-lg bg-[#5A1419] text-white/70 text-sm flex items-center gap-2">
                <span className="inline-block w-4 h-4 bg-[#4A90E2] rounded"></span>
                Handicap
              </button>
            </div>
          </section>

          {/* Screen */}
          <section className="mb-6">
            <img 
                src="/assets/screen.svg" 
                alt="screen" 
                className="w-full object-cover"
                />
          </section>

          {/* Seat Grid */}
          <section className="space-y-3 mb-8">
            {/* Row 1 */}
            <div className="flex items-center justify-center gap-2">
              {[...Array(12)].map((_, i) => (
                <button key={i} className="w-6 h-6 bg-[#B2182B] rounded-sm hover:opacity-80 transition-opacity"></button>
              ))}
              <span className="text-white text-sm ml-2">1</span>
            </div>

            {/* Row 2 */}
            <div className="flex items-center justify-center gap-2">
              {[...Array(12)].map((_, i) => (
                <button key={i} className={`w-6 h-6 rounded-sm hover:opacity-80 transition-opacity ${i === 2 || i === 3 || i === 4 ? 'bg-white' : 'bg-[#B2182B]'}`}></button>
              ))}
              <span className="text-white text-sm ml-2">2</span>
            </div>

            {/* Row 3 - Empty row */}
            <div className="h-6"></div>

            {/* Row 4 */}
            <div className="flex items-center justify-center gap-2">
              {[...Array(12)].map((_, i) => (
                <button key={i} className={`w-6 h-6 rounded-sm hover:opacity-80 transition-opacity ${i >= 2 && i <= 8 ? 'bg-[#4A90E2]' : 'bg-[#B2182B]'}`}></button>
              ))}
              <span className="text-white text-sm ml-2">4</span>
            </div>

            {/* Row 5 */}
            <div className="flex items-center justify-center gap-2">
              {[...Array(12)].map((_, i) => (
                <button key={i} className={`w-6 h-6 rounded-sm hover:opacity-80 transition-opacity ${i >= 6 && i <= 8 ? 'bg-[#4A90E2]' : 'bg-[#B2182B]'}`}></button>
              ))}
              <span className="text-white text-sm ml-2">5</span>
            </div>

            {/* Row 6 */}
            <div className="flex items-center justify-center gap-2">
              {[...Array(12)].map((_, i) => (
                <button key={i} className="w-6 h-6 bg-[#B2182B] rounded-sm hover:opacity-80 transition-opacity"></button>
              ))}
              <span className="text-white text-sm ml-2">6</span>
            </div>

            {/* Row 7 */}
            <div className="flex items-center justify-center gap-2">
              {[...Array(10)].map((_, i) => (
                <button key={i} className="w-6 h-6 bg-[#B2182B] rounded-sm hover:opacity-80 transition-opacity"></button>
              ))}
              <button className="w-6 h-6 bg-[#4A90E2] rounded-sm flex items-center justify-center">
                <span className="text-white text-xs">♿</span>
              </button>
              <button className="w-6 h-6 bg-[#4A90E2] rounded-sm flex items-center justify-center">
                <span className="text-white text-xs">♿</span>
              </button>
              <span className="text-white text-sm ml-2">7</span>
            </div>

            {/* Row 8 */}
            <div className="flex items-center justify-center gap-2">
              {[...Array(4)].map((_, i) => (
                <button key={i} className="w-6 h-6 bg-[#B2182B] rounded-sm hover:opacity-80 transition-opacity"></button>
              ))}
              <span className="text-white text-sm ml-2">8</span>
            </div>
          </section>

          {/* Selected Seats Summary */}
          <section className="bg-[#5A1419] rounded-2xl p-4">
            <h3 className="text-white text-lg font-bold mb-4 text-center">Valgte sæder</h3>
            <div className="h-px bg-white mb-4"></div>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <div className="bg-[#B2182B] text-white px-4 py-2 rounded-lg text-sm font-semibold">Række 2</div>
              <div className="bg-[#B2182B] text-white px-4 py-2 rounded-lg text-sm font-semibold">Sæde 4</div>
              <div className="bg-[#B2182B] text-white px-4 py-2 rounded-lg text-sm font-semibold">Række 2</div>
              <div className="bg-[#B2182B] text-white px-4 py-2 rounded-lg text-sm font-semibold">Sæde 5</div>
            </div>

            {/* Footer with price and buttons */}
            <div className="flex items-center justify-between gap-4">
              <div className="bg-[#F5E6D3] text-[#B2182B] px-6 py-3 rounded-full font-bold text-lg">
                2 billetter
              </div>
              <div className="text-white text-center">
                <div className="text-xs">Inkl. gebyr</div>
                <div className="text-xl font-bold">200 kr.</div>
              </div>
              <CreateButton onClick={() => {
                setIsSeatModalOpen(false);
                // Navigate to payment
                window.location.href = "/payment";
              }}>
                Betaling
              </CreateButton>
            </div>
          </section>
        </div>
      </Modal>
    </>
  );
}