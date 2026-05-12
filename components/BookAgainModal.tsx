'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdClose, MdEvent, MdAccessTime, MdLocationOn, MdDescription, MdCheckCircle } from 'react-icons/md';
import { ImSpinner8 } from 'react-icons/im';
import { bookAppointment } from '@/lib/actions';
import { toast } from 'react-toastify';

interface BookAgainModalProps {
  appt: any;
  onSuccess: (message: string) => void;
}

export default function BookAgainModal({ appt, onSuccess }: BookAgainModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState(appt.location || '');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // For demonstration, we'll just use the date string directly
      // In a real app, this would be a proper ISO date or similar
      await bookAppointment(appt.doctorId, date, time, appt.type, location, notes);
      setIsOpen(false);
      onSuccess(`Successfully re-booked with Dr. ${appt.doctor?.name} for ${date} at ${time}!`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to book appointment');
    } finally {
      setIsSaving(false);
    }
  };

  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-surface rounded-2xl p-lg w-full max-w-[500px] shadow-2xl border border-outline-variant animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-secondary/20">
              <img src={appt.doctor?.image} alt={appt.doctor?.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-h3 text-h3 text-primary">Book Again</h3>
              <p className="font-caption text-on-surface-variant font-medium">with Dr. {appt.doctor?.name}</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors">
            <MdClose size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-lg">
          <div className="grid grid-cols-2 gap-md">
            <div className="space-y-sm">
              <label className="font-label-sm font-bold text-on-surface flex items-center gap-2">
                <MdEvent size={18} className="text-secondary" /> Select Date
              </label>
              <input 
                type="text" 
                placeholder="e.g. Oct 28"
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-sm font-body-md focus:outline-none focus:border-secondary transition-all"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-sm">
              <label className="font-label-sm font-bold text-on-surface flex items-center gap-2">
                <MdAccessTime size={18} className="text-secondary" /> Select Time
              </label>
              <input 
                type="text" 
                placeholder="e.g. 10:00 AM"
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-sm font-body-md focus:outline-none focus:border-secondary transition-all"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-sm">
            <label className="font-label-sm font-bold text-on-surface flex items-center gap-2">
              <MdLocationOn size={18} className="text-secondary" /> Location
            </label>
            <select 
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-sm font-body-md focus:outline-none focus:border-secondary transition-all"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="MedTrust Central Clinic">MedTrust Central Clinic</option>
              <option value="Skin & Laser Center">Skin & Laser Center</option>
              <option value="Westside Medical Hub">Westside Medical Hub</option>
            </select>
          </div>

          <div className="space-y-sm">
            <label className="font-label-sm font-bold text-on-surface flex items-center gap-2">
              <MdDescription size={18} className="text-secondary" /> Notes / Symptoms
            </label>
            <textarea 
              placeholder="Briefly describe your symptoms or reason for visit..."
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-md py-sm font-body-md focus:outline-none focus:border-secondary transition-all min-h-[100px] resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-sm pt-md">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="px-lg py-sm font-label-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving || !date || !time}
              className="flex items-center gap-2 px-xl py-sm bg-secondary text-white font-label-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isSaving ? <><ImSpinner8 size={18} className="animate-spin" /> Confirming...</> : <><MdCheckCircle size={20} /> Confirm Booking</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 px-md py-sm bg-secondary text-white rounded-xl font-label-sm font-bold shadow-sm hover:opacity-90 transition-all w-full"
      >
        <MdEvent size={20} /> Book Again
      </button>
      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
