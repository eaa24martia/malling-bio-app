import Link from "next/link";
import { ReactNode } from "react";

type CreateButtonProps = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
};

export default function CreateButton({ href, onClick, children }: CreateButtonProps) {
  const className = "inline-block bg-[#B2182B] text-white font-bold px-16 py-3 rounded-full text-lg text-center shadow-[0_8px_0_0_#7C1C1A] active:translate-y-1 active:shadow-[0_4px_0_0_#7C1C1A]";

  // If href is provided, render as Link
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}