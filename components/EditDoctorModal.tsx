'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { updateDoctor } from '@/lib/actions';
import { MdEdit, MdClose, MdSave, MdPerson, MdBadge, MdLocalHospital, MdNotes } from 'react-icons/md';
import { ImSpinner8 } from 'react-icons/im';

export default function EditDoctorModal({ doctor }: { doctor: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: doctor.name,
    specialty: doctor.specialty,
    title: doctor.title,
    bio: doctor.bio
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateDoctor(doctor.id, formData);
    setIsSaving(false);
    setIsOpen(false);
  };

  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface rounded-xl p-lg w-full max-w-[448px] shadow-lg border border-outline-variant">
        <div className="flex items-center justify-between mb-md">
          <h3 className="font-h3 text-h3 text-primary flex items-center gap-2">
            <MdEdit size={20} className="text-secondary" />
            Edit Doctor Profile
          </h3>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant">
            <MdClose size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <div>
            <label className="font-label-sm font-bold text-on-surface flex items-center gap-1.5 mb-xs">
              <MdPerson size={16} className="text-secondary" /> Name
            </label>
            <input 
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div>
            <label className="font-label-sm font-bold text-on-surface flex items-center gap-1.5 mb-xs">
              <MdBadge size={16} className="text-secondary" /> Title
            </label>
            <input 
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>
          <div>
            <label className="font-label-sm font-bold text-on-surface flex items-center gap-1.5 mb-xs">
              <MdLocalHospital size={16} className="text-secondary" /> Specialty
            </label>
            <input 
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all" 
              value={formData.specialty} 
              onChange={e => setFormData({...formData, specialty: e.target.value})} 
            />
          </div>
          <div>
            <label className="font-label-sm font-bold text-on-surface flex items-center gap-1.5 mb-xs">
              <MdNotes size={16} className="text-secondary" /> Bio
            </label>
            <textarea 
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-md h-24 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all" 
              value={formData.bio} 
              onChange={e => setFormData({...formData, bio: e.target.value})} 
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
              {isSaving ? <><ImSpinner8 size={14} className="animate-spin" /> Saving…</> : <><MdSave size={16} /> Save Changes</>}
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
        className="flex items-center gap-1.5 px-sm py-xs bg-surface-container rounded-lg font-label-sm font-bold border border-outline-variant hover:bg-surface-container-low transition-colors"
      >
        <MdEdit size={16} />
        Edit
      </button>
      {mounted && isOpen && createPortal(modalContent, document.body)}
    </>
  );
}
