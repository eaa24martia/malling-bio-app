"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import RedLogo from "@/components/RedLogo";
import Input from "@/components/Input";
import { signUpUser } from "@/lib/auth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Disable scrolling on this page
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!name.trim()) {
      return setError("Navn er påkrævet");
    }

    if (!email.trim()) {
      return setError("E-mail er påkrævet");
    }

    if (password.length < 6) {
      return setError("Adgangskoden skal være mindst 6 tegn");
    }

    setLoading(true);

    try {
      await signUpUser({ name: name.trim(), email: email.trim(), password });
      
      // Redirect to login page after successful signup
      router.push("/login");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main 
      className="h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url('/assets/background-1.svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <section className="relative z-10">
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
          <h1 className="font-bold text-center text-[#192B5A] mb-2 mt-2" style={{ fontSize: '30px' }}>
            Opret ny bruger
          </h1>

        <section className="flex flex-col justify-center p-6">
 
          <form id="signupForm" onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              label="Brugernavn"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dit fornavn"
              required
            />

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

        <div className="flex justify-center mt-2">
          <button 
            type="submit" 
            form="signupForm" 
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
            {loading ? "Opretter bruger..." : "Opret bruger"}
          </button>
        </div>

        {error && (
          <div className="text-center mt-4">
            <p className="text-red-600 text-sm" style={{ fontFamily: 'var(--font-palanquin)' }}>
              {error}
            </p>
          </div>
        )}

        <p className="text-center text-sm text-[#192B5A] mt-6" style={{ fontFamily: 'var(--font-palanquin)' }}>
          Har du allerede en konto?{" "}
          <Link href="/login" className="text-(--color-primary) font-medium hover:underline" style={{ fontFamily: 'var(--font-palanquin)' }}>
            Log ind her
          </Link>
        </p>
        </div>
      </section>
    </main>
  );
}