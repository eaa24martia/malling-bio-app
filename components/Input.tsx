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
  return (
    <div>
      <label htmlFor={id} className="block text-[16px] text-[#192B5A] mb-2" style={{  fontFamily: 'var(--font-dosis)', fontWeight: '800'  }}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-3 border-2 text-[14px] border-[#B2182B] rounded-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
        style={{ fontFamily: 'var(--font-dosis)', fontWeight: '650' }}
      />
    </div>
  );
}