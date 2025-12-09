"use client";

import { useState } from "react";
import CreateButton from "./CreateButton";
import Modal from "./Modal";

export default function DetailFoldElement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("05/12");

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
        <div className="relative min-h-full bg-[#410C10] px-4 md:px-6 pb-8">
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
          <div className="h-px bg-white/20 my-4"></div>

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
              <h4 className="text-white text-lg font-bold mb-4">Wicked: Part II</h4>
              <div className="flex gap-3 overflow-x-auto pb-2 -mr-4 pr-4">
                {times.map((timeSlot, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      // Navigate to seat selection
                      window.location.href = "/seat";
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
    </>
  );
}