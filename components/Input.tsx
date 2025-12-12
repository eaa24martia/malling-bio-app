// Input-komponent: Genanvendelig inputfelt med label og tema-understøttelse
import { useTheme } from "@/contexts/ThemeContext";

// Props for Input-komponenten
interface InputProps {
  id: string; // Unik id til input og label
  label: string; // Label-tekst
  type?: "text" | "email" | "password"; // Input-type
  value: string; // Værdi i inputfeltet
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Ændringshandler
  placeholder?: string; // Placeholder-tekst
  required?: boolean; // Om feltet er påkrævet
}

export default function Input({ 
  id, 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required = false 
}: InputProps) {
  // Henter high-contrast state fra tema-context
  const { isHighContrast } = useTheme();
  return (
    <div>
      {/* Label for inputfeltet, farve afhænger af high-contrast */}
      <label
        htmlFor={id}
        className={`block text-[16px] mb-2 ${isHighContrast ? 'text-white' : 'text-[#192B5A]'}`}
        style={{ fontFamily: 'var(--font-dosis)', fontWeight: '800' }}
      >
        {label}
      </label>
      {/* Selve inputfeltet med styling og props */}
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-3 border-2 text-[14px] text-[#192B5A] border-[#B2182B] rounded-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent placeholder:text-gray-400"
        style={{ fontFamily: 'var(--font-dosis)', fontWeight: '650' }}
      />
    </div>
  );
}