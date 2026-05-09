'use client';

import { useState } from 'react';
import { bookAppointment } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { MdVideoCall, MdCalendarToday, MdAccessTime, MdCheckCircle } from 'react-icons/md';
import { ImSpinner8 } from 'react-icons/im';

export default function BookAppointmentForm({ doctorId, doctorName, fee }: { doctorId: string; doctorName: string; fee: number }) {
  const router = useRouter();
  const [date, setDate] = useState('Oct 28, 2023');
  const [time, setTime] = useState('10:00 AM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookInitiate = async () => {
    setIsSubmitting(true);
    try {
      const appointmentId = await bookAppointment(
        doctorId, 
        date, 
        time, 
        'General Consultation', 
        undefined, 
        undefined,
        'Pending'
      );
      
      if (appointmentId) {
        router.push(`/checkout/${appointmentId}`);
      }
    } catch (error) {
      console.error('Booking failed:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(30,41,59,0.05)] border-t-4 border-secondary mt-lg">
      <div className="mb-lg">
        <h3 className="font-h3 text-h3 text-primary">Book Appointment</h3>
        <p className="font-body-md text-on-surface-variant">Select your preferred date and time</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-lg">
        <div className="space-y-xs">
          <label className="font-label-sm font-bold text-on-surface flex items-center gap-1.5 px-xs">
            <MdCalendarToday size={16} className="text-secondary" />
            Select Date
          </label>
          <input 
            type="text" 
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-sm font-body-md focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-on-surface-variant/40" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            placeholder="e.g. Oct 28, 2023"
          />
        </div>
        <div className="space-y-xs">
          <label className="font-label-sm font-bold text-on-surface flex items-center gap-1.5 px-xs">
            <MdAccessTime size={16} className="text-secondary" />
            Select Time
          </label>
          <input 
            type="text" 
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-sm font-body-md focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-on-surface-variant/40" 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
            placeholder="e.g. 10:00 AM"
          />
        </div>
      </div>
      
      <div className="space-y-lg">
        <div className="flex items-center gap-md bg-surface-container-low/50 p-md rounded-xl border border-outline-variant/20">
          <div className="p-sm bg-secondary/10 rounded-lg text-secondary shadow-sm">
            <MdVideoCall size={24} />
          </div>
          <div>
            <p className="font-label-md font-bold text-on-surface">Virtual or In-Person</p>
            <p className="font-caption text-on-surface-variant">Eligible for insurance coverage</p>
          </div>
        </div>

        <button 
          onClick={handleBookInitiate}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 bg-secondary text-white px-xl py-lg rounded-2xl font-body-md font-bold hover:opacity-95 hover:shadow-lg transition-all active:scale-[0.98] shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isSubmitting ? (
            <><ImSpinner8 size={20} className="animate-spin" /> Initiating Booking…</>
          ) : (
            <>
              <MdCheckCircle size={22} className="group-hover:scale-110 transition-transform" /> 
              Confirm & Pay Booking
            </>
          )}
        </button>
      </div>
    </div>
  );
}
