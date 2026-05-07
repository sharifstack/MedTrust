'use client';

import { useState } from 'react';
import { bookAppointment } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { MdVideoCall, MdCalendarToday, MdAccessTime, MdCheckCircle } from 'react-icons/md';
import { ImSpinner8 } from 'react-icons/im';

export default function BookAppointmentForm({ doctorId }: { doctorId: string }) {
  const router = useRouter();
  const [date, setDate] = useState('Oct 28, 2023');
  const [time, setTime] = useState('10:00 AM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBook = async () => {
    setIsSubmitting(true);
    await bookAppointment(doctorId, date, time, 'General Consultation');
    setIsSubmitting(false);
    router.push('/appointments');
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(30,41,59,0.05)] border-t-4 border-secondary mt-lg">
      <div className="mb-lg">
        <h3 className="font-h3 text-h3 text-primary">Book Appointment</h3>
        <p className="font-body-md text-on-surface-variant">Select your preferred date and time</p>
      </div>
      
      <div className="flex flex-col gap-md mb-lg">
        <div>
          <label className="font-label-sm font-bold text-on-surface flex items-center gap-1.5 mb-xs">
            <MdCalendarToday size={16} className="text-secondary" />
            Select Date
          </label>
          <input 
            type="text" 
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            placeholder="e.g. Oct 28, 2023"
          />
        </div>
        <div>
          <label className="font-label-sm font-bold text-on-surface flex items-center gap-1.5 mb-xs">
            <MdAccessTime size={16} className="text-secondary" />
            Select Time
          </label>
          <input 
            type="text" 
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all" 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
            placeholder="e.g. 10:00 AM"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between border-t border-outline-variant/30 pt-lg">
        <div className="flex items-center gap-md">
          <div className="p-sm bg-secondary/10 rounded-lg">
            <MdVideoCall size={22} className="text-secondary" />
          </div>
          <div>
            <p className="font-label-sm font-bold text-on-surface">Virtual or In-Person</p>
            <p className="font-caption text-on-surface-variant">Eligible for insurance coverage</p>
          </div>
        </div>
        <button 
          onClick={handleBook}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-secondary text-white px-xl py-md rounded-xl font-body-md font-bold hover:opacity-90 transition-all active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <><ImSpinner8 size={16} className="animate-spin" /> Booking…</>
          ) : (
            <><MdCheckCircle size={18} /> Confirm Booking</>
          )}
        </button>
      </div>
    </div>
  );
}
