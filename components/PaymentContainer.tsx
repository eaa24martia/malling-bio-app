"use client";

import { useState } from "react";
import Input from "./Input";
import CreateButton from "./CreateButton";

export default function PaymentContainer() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    console.log("Submitted:", { cardNumber, expiryDate, cvv, cardholderName });
    // TODO: Navigate to ticket modal/page after successful payment
  }

  return (
    <section className="w-full min-h-screen flex items-center justify-center">
      <div className="bg-[#FEEFE0] rounded-xl shadow-lg h-[445px] w-[365px] flex flex-col items-center -translate-y-20 pt-6 px-6">
        
        {/* Title */}
        <h2 className="text-[#192B53] text-[24px] font-bold mb-4">Kreditkort</h2>

        {/* Form */}
        <form id="paymentForm" onSubmit={handleSubmit} className="w-full space-y-4">
          <Input
            id="cardNumber"
            label="Kortnummer"
            type="text"
            value={cardNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCardNumber(e.target.value)
            }
            placeholder="1234 5678 9012 3456"
            required
          />

          <section className="flex flex-row gap-5 justify-center">
            <Input
              id="expiryDate"
              label="Udløbsdato"
              type="text"
              value={expiryDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setExpiryDate(e.target.value)
              }
              placeholder="MM/ÅÅ"
              required
            />

            <Input
              id="cvv"
              label="Sikkerhedskode"
              type="text"
              value={cvv}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCvv(e.target.value)
              }
              placeholder="123"
              required
            />
          </section>

          <Input
            id="cardholderName"
            label="Kortholderens navn"
            type="text"
            value={cardholderName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCardholderName(e.target.value)
            }
            placeholder="Navn på kort"
            required
          />

          {/* Submit Button */}
          <div className="pt-2 flex justify-center">
            <CreateButton onClick={handleSubmit}>
              Betal
            </CreateButton>
          </div>
        </form>

      </div>
    </section>
  );
}