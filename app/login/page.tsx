"use client";

// Importerer nødvendige hooks og komponenter
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import RedLogo from "@/components/RedLogo";
import Input from "@/components/Input";
import { signInUser } from "@/lib/auth";
import { useTheme } from "@/contexts/ThemeContext";

export default function LoginPage() {
  // Henter high-contrast state fra tema-context
  const { isHighContrast } = useTheme();
  // State til inputfelter, fejlbesked og loading
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Låser scroll på login-siden
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    // Genskaber scroll ved unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Håndterer login-formularen
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Simpel validering
    if (!email.trim()) {
      return setError("E-mail er påkrævet");
    }
    if (!password.trim()) {
      return setError("Adgangskode er påkrævet");
    }
    setLoading(true);
    try {
      await signInUser({ email: email.trim(), password });
      // Omdiriger til forside ved succes
      router.push("/home");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main 
      className="h-screen relative overflow-hidden"
      style={isHighContrast
        ? { background: "#000" }
        : {
            backgroundImage: `url('/assets/background-1.svg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }
      }
    >
      <section className="relative z-10">
        {/* Header med tilbage-knap og logo */}
        <div className="relative flex justify-center p-6">
          <Link href="/" className="absolute left-6 flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="assets/arrow-left.svg"
              alt="Tilbage"
              width={26}
              height={26}
            />
          </Link>
          <RedLogo/>
        </div>
        <div>
          {/* Titel */}
          <h1
            className={`font-bold text-center mb-2 mt-2 ${isHighContrast ? 'text-white' : 'text-[#192B5A]'}`}
            style={{ fontSize: '30px' }}
          >
            Log ind
          </h1>
        {/* Login-formular */}
        <section className="flex flex-col justify-center p-6">
          <form id="loginForm" onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@gmail.com"
              required
            />
            <Input
              id="password"
              label="Adgangskode"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </form>
        </section>
        {/* Log ind-knap */}
        <div className="flex justify-center mt-2">
          <button 
            type="submit" 
            form="loginForm" 
            disabled={loading}
            className="
              inline-block
              bg-[#B2182B]
              text-white
              font-bold
              px-16
              py-3
              rounded-full
              text-lg
              text-center
              shadow-[0_8px_0_0_#7C1C1A]
              active:translate-y-1
              active:shadow-[0_4px_0_0_#7C1C1A]
              disabled:opacity-50
              disabled:cursor-not-allowed
              disabled:active:translate-y-0
              disabled:active:shadow-[0_8px_0_0_#7C1C1A]
              cursor-pointer
            "
          >
            {loading ? "Logger ind..." : "Log ind"}
          </button>
        </div>
        {/* Fejlbesked vises hvis der er fejl */}
        {error && (
          <div className="text-center mt-4">
            <p className="text-red-600 text-sm" style={{ fontFamily: 'var(--font-palanquin)' }}>
              {error}
            </p>
          </div>
        )}
        {/* Link til signup hvis man ikke har en konto */}
        <p
          className={`text-center text-sm mt-6 ${isHighContrast ? 'text-white' : 'text-[#192B5A]'}`}
          style={{ fontFamily: 'var(--font-palanquin)' }}
        >
          Har du ikke en konto?{" "}
          <Link href="/signup" className="text-(--color-primary) font-medium hover:underline" style={{ fontFamily: 'var(--font-palanquin)' }}>
            Opret en her
          </Link>
        </p>
        </div>
      </section>
    </main>
  );
}