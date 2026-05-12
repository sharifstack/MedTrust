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
        className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 hover:text-blue-600 hover:border-blue-400 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 active:scale-95 whitespace-nowrap relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <MdChatBubble size={18} className="text-blue-500 shrink-0 relative z-10" />
        <span className="relative z-10">Message Doctor</span>
      </button>

      <MedicalChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
