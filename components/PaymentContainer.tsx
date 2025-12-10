"use client";

import { useState } from "react";
import Input from "./Input"; // <-- make sure this path is correct

export default function PaymentContainer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Submitted:", { email, password });
  }

  return (
    <section className="w-full min-h-screen flex items-center justify-center">
      <div className="bg-[#FEEFE0] rounded-xl shadow-lg h-[445px] w-[365px] flex flex-col items-center -translate-y-20 pt-6 px-6">
        
        {/* Title */}
        <p className="text-[#192B53] text-xl font-bold mb-4">Kreditkort</p>

        {/* Form */}
        <form id="loginForm" onSubmit={handleSubmit} className="w-full space-y-4">
          <Input
            id="email"
            label="E-mail"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            placeholder="din@gmail.com"
            required
          />

          <Input
            id="password"
            label="Adgangskode"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            placeholder="••••••••"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#192B53] text-white font-semibold py-2 rounded-lg hover:opacity-90 transition"
          >
            Betal
          </button>
        </form>

      </div>
    </section>
  );
}