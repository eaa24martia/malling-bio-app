import Link from "next/link";
import { ReactNode } from "react";

export default function Button({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-block bg-[#7C1A22] text-white font-bold px-25 py-3 rounded-full text-lg text-center shadow-[0_8px_0_0_#3B0509] active:translate-y-1 active:shadow-[0_4px_0_0_#3B0509]"
    >
      {children}
    </Link>
  );
}