"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import RedLogo from "@/components/RedLogo";
import CreateButton from "@/components/CreateButton";
import Input from "@/components/Input";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Firebase authentication will be implemented here later
    console.log("Signup form submitted:", { name, email, password });
  };

  return (
    <main 
      className="min-h-screen relative"
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
          <h1 className="text-2xl font-bold text-center text-[#192B5A] mb-2 mt-2">
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
          <button type="submit" form="signupForm">
            <CreateButton href="#">
              Opret bruger
            </CreateButton>
          </button>
        </div>

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