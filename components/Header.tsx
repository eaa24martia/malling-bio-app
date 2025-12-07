"use client";
import Image from "next/image";

export default function RedHeader() {
  return (
    <section className="w-full bg-[#B2182B]">
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