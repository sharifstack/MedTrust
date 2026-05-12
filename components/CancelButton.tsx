'use client';

import { useState } from 'react';
import { cancelAppointment } from '@/lib/actions';
import { MdCancelScheduleSend } from 'react-icons/md';
import { ImSpinner8 } from 'react-icons/im';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface CancelButtonProps {
  appointmentId: string;
  onCancelSuccess?: () => void;
}

export default function CancelButton({ appointmentId, onCancelSuccess }: CancelButtonProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const router = useRouter();

  const handleCancel = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (confirm('Are you sure you want to cancel this appointment?')) {
      setIsCancelling(true);
      try {
        await cancelAppointment(appointmentId);
        if (onCancelSuccess) {
          onCancelSuccess();
        }
      } catch (error) {
        console.error('Failed to cancel appointment', error);
        toast.error('Failed to cancel appointment');
      } finally {
        setIsCancelling(false);
      }
    }
  };

  return (
    <button 
      onClick={handleCancel}
      disabled={isCancelling}
      className="flex w-full items-center justify-center gap-1.5 px-md py-sm font-label-sm font-bold text-error border border-error/30 hover:bg-error/5 rounded-lg transition-colors disabled:opacity-50"
    >
      {isCancelling ? (
        <><ImSpinner8 size={14} className="animate-spin" /> Cancelling…</>
      ) : (
        <><MdCancelScheduleSend size={16} /> Cancel</>
      )}
    </button>
  );
}
