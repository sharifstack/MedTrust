'use client';

import { useState } from 'react';
import { cancelAppointment } from '@/lib/actions';
import { MdCancelScheduleSend } from 'react-icons/md';
import { ImSpinner8 } from 'react-icons/im';

export default function CancelButton({ appointmentId }: { appointmentId: string }) {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      setIsCancelling(true);
      await cancelAppointment(appointmentId);
      setIsCancelling(false);
    }
  };

  return (
    <button 
      onClick={handleCancel}
      disabled={isCancelling}
      className="flex items-center gap-1.5 px-md py-sm font-label-sm font-bold text-error border border-error/30 hover:bg-error/5 rounded-lg transition-colors disabled:opacity-50"
    >
      {isCancelling ? (
        <><ImSpinner8 size={14} className="animate-spin" /> Cancelling…</>
      ) : (
        <><MdCancelScheduleSend size={16} /> Cancel</>
      )}
    </button>
  );
}
