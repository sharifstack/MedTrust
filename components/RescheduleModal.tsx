'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { rescheduleAppointment } from '@/lib/actions';
import { MdEditCalendar, MdClose, MdSave, MdCalendarToday, MdAccessTime } from 'react-icons/md';
import { ImSpinner8 } from 'react-icons/im';

export default function RescheduleModal({ appointment }: { appointment: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [date, setDate] = useState(appointment.date);
  const [time, setTime] = useState(appointment.time);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await rescheduleAppointment(appointment.id, date, time);
    setIsSaving(false);
    setIsOpen(false);
  };

  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface rounded-xl p-lg w-full max-w-[384px] shadow-lg border border-outline-variant">
        <div className="flex items-center justify-between mb-md">
          <h3 className="font-h3 text-h3 text-primary flex items-center gap-2">
            <MdEditCalendar size={20} className="text-secondary" />
            Reschedule
          </h3>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant">
            <MdClose size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <div>
            <label className="font-label-sm font-bold text-on-surface flex items-center gap-1.5 mb-xs">
              <MdCalendarToday size={15} className="text-secondary" /> Date
            </label>
            <input 
              type="text"
              placeholder="e.g. Oct 28, 2023"
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
            />
          </div>
          <div>
            <label className="font-label-sm font-bold text-on-surface flex items-center gap-1.5 mb-xs">
              <MdAccessTime size={15} className="text-secondary" /> Time
            </label>
            <input 
              type="text"
              placeholder="e.g. 10:00 AM"
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all" 
              value={time} 
              onChange={e => setTime(e.target.value)} 
            />
          </div>
          <div className="flex justify-end gap-sm mt-sm">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-1.5 px-md py-sm font-label-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-lg"
            >
              <MdClose size={16} /> Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="flex items-center gap-1.5 px-md py-sm bg-secondary text-white font-label-sm font-bold rounded-lg shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isSaving ? <><ImSpinner8 size={14} className="animate-spin" /> Saving…</> : <><MdSave size={16} /> Confirm</>}
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
        className="flex items-center justify-center gap-1.5 px-md py-sm bg-surface-container rounded-lg font-label-sm font-bold text-primary border border-outline-variant hover:bg-surface-container-low transition-colors w-full md:w-auto"
      >
        <MdEditCalendar size={16} />
        Reschedule
      </button>
      {mounted && isOpen && createPortal(modalContent, document.body)}
    </>
  );
}
