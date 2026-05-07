'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdCheckCircle, MdError, MdClose } from 'react-icons/md';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!mounted) return null;

  const content = (
    <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-lg py-md rounded-xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300 border
      ${type === 'success' ? 'bg-surface border-secondary/20 text-secondary' : 'bg-surface border-error/20 text-error'}`}>
      {type === 'success' ? <MdCheckCircle size={24} /> : <MdError size={24} />}
      <p className="font-label-sm font-bold">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-surface-container rounded-full">
        <MdClose size={18} />
      </button>
    </div>
  );

  return createPortal(content, document.body);
}
