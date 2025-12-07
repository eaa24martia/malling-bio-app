"use client";
import Image from "next/image";
import Link from "next/link";

export default function BottomNav() {
  return (
    <section className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#ffffff] z-50 shadow-lg rounded-[50px]" style={{ width: '361px', height: '62px' }}>
      <div className="flex justify-between items-center h-full px-8">
        <Link href="/home" className="flex flex-col items-center justify-center">
          <img src="/assets/house.svg" alt="Home page" className="w-8 h-8" />
          <h2 className="text-[12px] font-medium" style={{ color: '#B2182B' }}>Hjem</h2>
        </Link>
        <Link href="/events" className="flex flex-col items-center justify-center">
          <img src="/assets/events.svg" alt="Events page" className="w-8 h-8" />
          <h2 className="text-[12px] font-medium" style={{ color: '#B2182B' }}>Arrangementer</h2>
        </Link>
        <Link href="/tickets" className="flex flex-col items-center justify-center">
          <img src="/assets/tickets.svg" alt="Tickets page" className="w-8 h-8" />
          <h2 className="text-[12px] font-medium" style={{ color: '#B2182B' }}>Billetter</h2>
        </Link>
        <Link href="/profile" className="flex flex-col items-center justify-center">
          <img src="/assets/profile.svg" alt="Profile page" className="w-8 h-8" />
          <h2 className="text-[12px] font-medium" style={{ color: '#B2182B' }}>Profil</h2>
        </Link>
      </div>
    </section>
  );
}