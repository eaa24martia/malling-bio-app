"use client";

export default function TicketCard() {
  return (
    <div className="relative overflow-hidden rounded-[20px] shadow-lg max-w-2xl mx-4 sm:mx-auto h-40 sm:h-[180px]"
         style={{
           backgroundImage: 'url(https://poster.ebillet.dk/Zootropolis2Ny-2025.large.jpg)',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
         }}>
      
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #b2182a9b, #0000008e)'
        }}
      />
      
      <div className="relative z-5 flex items-center justify-between h-full p-4">
        <div className="flex-1 text-white">
          <h2 className="text-[24px] font-extrabold leading-tight mb-2">
            Zootropolis II
          </h2>
          <p className="text-sm sm:text-base mb-10 opacity-95">
            12.00, 17. december, Malling Bio
          </p>
          <p className="text-lg sm:text-xl font-bold">
            2 billetter
          </p>
        </div>

        <div className="shrink-0 ml-3">
          <img 
            src="https://poster.ebillet.dk/Zootropolis2Ny-2025.large.jpg" 
            alt="Zootropolis II poster" 
            className="w-[100px] h-[130px] sm:w-[110px] sm:h-[145px] object-cover rounded-xl shadow-xl" 
          />
        </div>
      </div>
    </div>
  );
}