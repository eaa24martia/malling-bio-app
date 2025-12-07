"use client";
import Image from "next/image";

export default function BottomNav() {
  return (
    <section className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#ffffff] z-50 shadow-lg rounded-[50px]" style={{ width: '361px', height: '58px' }}>
      <div className="flex justify-center items-center h-full">
       <img src="/assets/house.svg" alt="Home page" />
        <img src="/assets/events.svg" alt="Events page" />
         <img src="/assets/tickets.svg" alt="Tickets page" />
          <img src="/assets/profile.svg" alt="Profile page" />
      </div>
    </section>
  );
}