"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemeContextType = {
  isHighContrast: boolean;
  toggleHighContrast: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Load saved preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("highContrast");
    if (saved === "true") {
      setIsHighContrast(true);
    }
  }, []);

  // Apply high contrast class to document and save preference
  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add("high-contrast");
      localStorage.setItem("highContrast", "true");
    } else {
      document.documentElement.classList.remove("high-contrast");
      localStorage.setItem("highContrast", "false");
    }
  }, [isHighContrast]);

  const toggleHighContrast = () => {
    setIsHighContrast((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isHighContrast, toggleHighContrast }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
