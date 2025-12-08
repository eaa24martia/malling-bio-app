"use client";

import CreateButton from "./CreateButton";

export default function DetailFoldElement() {
  return (
    <div 
      className="w-full min-h-[500px] mt-20 rounded-[30px] relative overflow-hidden"
      style={{
        background: 'linear-gradient(to top, #400B10, #B2182B), url(/assets/backgrounds-3.svg)',
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundBlendMode: 'multiply'
      }}
    >
    </div>
  );
}