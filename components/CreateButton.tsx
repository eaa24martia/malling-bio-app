import Link from "next/link";
import { ReactNode } from "react";

type CreateButtonProps = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  size?: "default" | "small";
};

export default function CreateButton({ href, onClick, children, size = "default" }: CreateButtonProps) {
  const baseClassName = "inline-block bg-[#B2182B] text-white font-bold rounded-full text-center active:translate-y-1";
  const sizeClassName = size === "small" 
    ? "px-6 py-2 text-sm shadow-[0_4px_0_0_#7C1C1A] active:shadow-[0_2px_0_0_#7C1C1A]"
    : "px-16 py-3 text-lg shadow-[0_8px_0_0_#7C1C1A] active:shadow-[0_4px_0_0_#7C1C1A]";
  const className = `${baseClassName} ${sizeClassName}`;

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