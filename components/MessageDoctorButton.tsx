'use client';

import { useState } from 'react';
import { MdChatBubble } from 'react-icons/md';
import dynamic from 'next/dynamic';

const MedicalChatbot = dynamic(() => import('./MedicalChatbot'), { ssr: false });

export default function MessageDoctorButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsChatOpen(true)}
        className="flex items-center justify-center space-x-md bg-surface-container-lowest border border-outline-variant text-primary px-lg py-xl rounded-xl shadow-[0px_4px_20px_rgba(30,41,59,0.05)] hover:bg-surface-container-low transition-all active:scale-95 group w-full"
      >
        <MdChatBubble size={28} className="text-secondary" />
        <span className="font-h3 text-h3">Message Doctor</span>
      </button>

      <MedicalChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
