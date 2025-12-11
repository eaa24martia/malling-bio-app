import { useTheme } from "@/contexts/ThemeContext";

interface InputProps {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
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
  const { isHighContrast } = useTheme();
  return (
    <div>
      <label
        htmlFor={id}
        className={`block text-[16px] mb-2 ${isHighContrast ? 'text-white' : 'text-[#192B5A]'}`}
        style={{ fontFamily: 'var(--font-dosis)', fontWeight: '800' }}
      >
        {label}
      </label>
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