// Modal-komponent: Viser en modal dialogboks med fokusfælde, ESC-lukning og valgfri tilbage-knap.
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// Definerer mulige størrelser for modalens bredde
type Size = "sm" | "md" | "lg" | "full";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
  size?: Size;
  roundedTopOnly?: boolean; // sheet-style on mobile
  onBack?: () => void; // Optional back button handler
};

const sizeClass: Record<Size, string> = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  full: "w-full h-full",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  ariaLabel,
  children,
  size = "md",
  roundedTopOnly = false,
  onBack,
}: Props) {
  // Ref til modalens container for fokusstyring
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Gemmer det element, der havde fokus før modal blev åbnet
  const previouslyFocused = useRef<HTMLElement | null>(null);
  // Finder portal-root til at placere modal i DOM'en
  const portalRoot = typeof document !== "undefined" ? document.getElementById("modal-root") ?? document.body : null;

  // Forhindrer baggrundsscroll når modal er åben
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Håndterer fokus: sætter fokus på første element i modal og genskaber fokus ved luk
  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    // Sætter fokus på første fokusérbare element i modal
    requestAnimationFrame(() => {
      const root = containerRef.current;
      if (!root) return;
      const focusable = root.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (focusable ?? root).focus();
    });

    return () => {
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen]);

  // Lytter efter ESC for at lukke modal og TAB for at fange fokus i modal
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) onClose();
      if (e.key === "Tab" && isOpen) {
        // Simpel fokusfælde
        const root = containerRef.current;
        if (!root) return;
        const focusables = Array.from(
          root.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled"));
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Hvis modal ikke er åben, eller portalRoot ikke findes, returneres null
  if (!isOpen || !portalRoot) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      aria-hidden={false}
    >
      {/* Baggrund/overlay der lukker modal ved klik */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal-panel */}
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-label={ariaLabel ?? title}
        className={`relative z-10 w-full ${sizeClass[size]} ${
          roundedTopOnly ? "rounded-t-[30px] md:rounded-2xl" : "rounded-t-[30px]"
        } bg-white shadow-2xl overflow-hidden max-h-[92vh] animate-slideUp`}
        style={{
          animation: isOpen ? "slideUp 0.3s ease-out" : "slideDown 0.3s ease-in"
        }}
      >
        {/* Header med titel og luk/tilbage-knap */}
        <div className="flex items-center justify-center h-[55px] bg-[#B2182B] px-4 md:px-5">
          <button
            onClick={onBack || onClose}
            aria-label={onBack ? "Gå tilbage" : "Luk"}
            className="absolute left-4 p-2"
          >
            <img 
              src={onBack ? "/assets/white-arrow-left.svg" : "/assets/white-close.svg"}
              alt={onBack ? "Tilbage" : "Luk"}
              className="w-5 h-5"
            />
          </button>
          <div className="text-white font-semibold text-lg" id="modal-title">
            {title}
          </div>
        </div>

        {/* Body med indhold og baggrundsgrafik */}
        <div 
          className="h-[796px] md:p-6 text-white overflow-auto"
          style={{
            background: 'linear-gradient(to bottom, #320006, #B2182B), url(/assets/backgrounds-3.svg)',
            backgroundSize: 'cover, cover',
            backgroundPosition: 'center, center',
            backgroundRepeat: 'no-repeat, no-repeat',
            backgroundBlendMode: 'multiply'
          }}
        >
          {children}
        </div>
      </div>
    </div>,
    portalRoot
  );
}