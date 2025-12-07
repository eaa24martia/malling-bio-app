"use client";
import Image from "next/image";

export default function RedHeader() {
  return (
    <section className="fixed top-0 left-0 w-full bg-[#B2182B] z-50 shadow-bg">
      <div className="flex justify-center">
        <Image
          src="/assets/white-logo.svg"
          alt="Malling Bio Logo"
          width={150}
          height={90}
        />
      </div>
    </section>
  );
}