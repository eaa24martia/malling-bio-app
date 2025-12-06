"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import RedLogo from "@/components/RedLogo";
import Input from "@/components/Input";
import { signInUser } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    if (!email.trim()) {
      return setError("E-mail er påkrævet");
    }

    if (!password.trim()) {
      return setError("Adgangskode er påkrævet");
    }

    setLoading(true);

    try {
      await signInUser({ email: email.trim(), password });
      
      // Redirect to dashboard or home page after successful login
      router.push("/");
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
            Log ind
          </h1>

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

        {error && (
          <div className="text-center mt-4">
            <p className="text-red-600 text-sm" style={{ fontFamily: 'var(--font-palanquin)' }}>
              {error}
            </p>
          </div>
        )}

        <p className="text-center text-sm text-[#192B5A] mt-6" style={{ fontFamily: 'var(--font-palanquin)' }}>
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