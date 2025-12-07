"use client";
import Image from "next/image";

export default function BottomNav() {
  return (
    <section className="fixed bottom-0 left-0 w-full bg-[#ffffff] z-50 shadow-lg rounded-[50px]">
      <div className="flex justify-center">
        <Image
          src="/assets/red-logo.svg"
          alt="Malling Bio Logo"
          width={150}
          height={90}
        />
      </div>
    </section>
  );
}