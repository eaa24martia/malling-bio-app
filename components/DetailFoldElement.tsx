"use client";

import CreateButton from "./CreateButton";

export default function DetailFoldElement() {
  return (
    <div 
      className="w-full min-h-[360px] pb-20 rounded-[30px] relative overflow-hidden"
      style={{
        background: 'linear-gradient(to top, #400B10, #B2182B), url(/assets/backgrounds-3.svg)',
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundBlendMode: 'multiply'
      }}
    >
        <section className="absolute inset-0 flex items-center justify-center mt-[-70]">
            <div className="relative">
                <img src="/assets/ticket-element.svg" alt="" className="w-75 h-auto" />
                <div className="absolute inset-0 flex items-center justify-center mt-[-10]">
                    <CreateButton href="/seat">Se tider</CreateButton>
                </div>
            </div>
        </section>
    </div>
  );
}