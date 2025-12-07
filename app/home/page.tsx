"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RedHeader from "@/components/Header";
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
        background: `url('/assets/backgrounds-2.svg'), linear-gradient(135deg, #000000 0%, #4B0009 100%)`,
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat'
      }}
    >
      <section className="relative z-10">

        <RedHeader />
      
      </section>
    </main>
  );
}