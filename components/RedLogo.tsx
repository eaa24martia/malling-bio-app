"use client";
import Image from "next/image";

export default function RedLogo() {
  return (
    <Image
      src="/assets/red-logo.svg"
      alt="Malling Bio Logo"
      width={210}
      height={105}
    />
  );
}