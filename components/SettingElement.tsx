"use client";

import { useState } from "react";
import CreateButton from "./CreateButton";
import Modal from "./Modal";

export default function SettingElement() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div 
      className="w-full min-h-[560px] mt-20 rounded-t-[30px] relative overflow-hidden"
      style={{
        background: 'linear-gradient(to top, #400B10, #B2182B), url(/assets/backgrounds-3.svg)',
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundBlendMode: 'multiply'
      }}
    >
      <div className="pt-5">
        {/* Mine billetter button */}
        <button 
          className="w-full transition-colors p-4 flex items-center justify-between group"
        >
          <h3 className="text-white text-[20px] font-bold">Mine billetter</h3>
          <img src="assets/white-arrow-right.svg" alt="" className="w-10 h-10" />
        </button>

        {/* Divider */}
        <div className="h-px bg-white my-6 mb-4"></div>

        {/* Høj kontrast-tilstand toggle */}
        <div className="w-full p-4 flex items-center justify-between">
          <h3 className="text-white text-[20px] font-bold">Høj kontrast-tilstand</h3>
          <button
            onClick={() => setIsHighContrast(!isHighContrast)}
            className={`relative w-20 h-10 rounded-full transition-colors ${
              isHighContrast ? 'bg-[#B2182B]' : 'bg-gray-400'
            }`}
            aria-label="Toggle high contrast mode"
          >
            <span
              className={`absolute top-1 left-1 w-8 h-8 bg-gray-200 rounded-full shadow-md transition-transform ${
                isHighContrast ? 'translate-x-10' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-white my-6 mb-4"></div>

        {/* Om Malling Bio button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full p-4 flex items-center justify-between group"
        >
          <h3 className="text-white text-[20px] font-bold">Om Malling Bio</h3>
          <img src="assets/white-arrow-right.svg" alt="" className="w-10 h-10" />
        </button>
      </div>


        <div className="h-px bg-white my-6 mb-4"></div>
      <div className="flex justify-center mt-8 pb-8">
        <CreateButton href="/">Log ud</CreateButton>
      </div>

      {/* Om Malling Bio Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Om Malling Bio"
        size="md"
      >
       
      </Modal>
    </div>
  );
}