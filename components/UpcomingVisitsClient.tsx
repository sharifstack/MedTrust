'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { ImSpinner8 } from 'react-icons/im';
import {
  MdEventAvailable,
  MdEditCalendar,
  MdCancelScheduleSend,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdClose,
  MdWarning,
  MdSave,
  MdCalendarToday,
  MdAccessTime,
} from 'react-icons/md';
import AppointmentCard from './AppointmentCard';
import { bulkRescheduleAppointments, bulkCancelAppointments } from '@/lib/actions';

interface Props {
  appointments: any[];
  allDoctors: any[];
}

// ─── Portal wrapper — renders children into document.body ────────────────────
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // ESC key handler
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          position: 'relative',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          width: '100%',
          maxWidth: '480px',
          overflow: 'hidden',
          animation: 'modalIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function UpcomingVisitsClient({ appointments, allDoctors }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // ── selection ────────────────────────────────────────────
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const selectionMode = selected.size > 0;
  const activeIds = appointments.map((a) => a.id);
  const allSelected = activeIds.length > 0 && activeIds.every((id) => selected.has(id));

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(activeIds));

  const clearSelection = () => setSelected(new Set());

  // ── bulk edit state ──────────────────────────────────────
  const [showEdit, setShowEdit] = useState(false);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editStep, setEditStep] = useState<'form' | 'confirm'>('form');
  const [isSaving, setIsSaving] = useState(false);

  const openEdit = () => {
    setEditDate('');
    setEditTime('');
    setEditStep('form');
    setShowEdit(true);
  };
  const closeEdit = useCallback(() => { if (!isSaving) setShowEdit(false); }, [isSaving]);

  const handleBulkEdit = async () => {
    setIsSaving(true);
    try {
      await bulkRescheduleAppointments(Array.from(selected), editDate.trim(), editTime.trim());
      toast.success(`${selected.size} appointment${selected.size > 1 ? 's' : ''} rescheduled!`);
      setShowEdit(false);
      clearSelection();
      startTransition(() => router.refresh());
    } catch {
      toast.error('Failed to reschedule. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── bulk cancel state ────────────────────────────────────
  const [showCancel, setShowCancel] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const closeCancel = useCallback(() => { if (!isCancelling) setShowCancel(false); }, [isCancelling]);

  const handleBulkCancel = async () => {
    setIsCancelling(true);
    try {
      await bulkCancelAppointments(Array.from(selected));
      toast.success(`${selected.size} appointment${selected.size > 1 ? 's' : ''} cancelled.`);
      setShowCancel(false);
      clearSelection();
      startTransition(() => router.refresh());
    } catch {
      toast.error('Failed to cancel. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      {/* ── Section header ─────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-sm">
        <MdEventAvailable className="text-secondary" size={24} />
        <h2 className="font-h3 text-h3 text-primary">Upcoming Visits</h2>
        <span className="ml-2 px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-[10px] font-bold">
          {appointments.length}
        </span>
      </div>

      {/* ── Floating bulk action bar ────────────────────── */}
      <AnimatePresence>
        {selectionMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="sticky top-[72px] z-30 bg-white border border-secondary/20 rounded-2xl shadow-lg shadow-secondary/10 px-4 py-3 flex flex-wrap items-center gap-3"
          >
            {/* Select All */}
            <button
              onClick={toggleAll}
              className="flex items-center gap-1.5 text-sm font-bold text-primary hover:text-secondary transition-colors"
            >
              {allSelected
                ? <MdCheckBox size={20} className="text-secondary" />
                : <MdCheckBoxOutlineBlank size={20} className="text-on-surface-variant" />}
              <span className="hidden sm:inline">{allSelected ? 'Deselect All' : 'Select All'}</span>
            </button>

            <div className="w-px h-5 bg-outline-variant/40 hidden sm:block" />

            <span className="px-3 py-1 bg-secondary text-white rounded-full text-xs font-black">
              {selected.size} Selected
            </span>

            <div className="flex-1" />

            {/* Bulk Edit button */}
            <button
              onClick={openEdit}
              className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-white rounded-xl text-sm font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all"
            >
              <MdEditCalendar size={18} />
              <span className="hidden sm:inline">Bulk Edit</span>
            </button>

            {/* Bulk Cancel button */}
            <button
              onClick={() => setShowCancel(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold hover:bg-red-100 active:scale-95 transition-all"
            >
              <MdCancelScheduleSend size={18} />
              <span className="hidden sm:inline">Bulk Cancel</span>
            </button>

            {/* Clear */}
            <button
              onClick={clearSelection}
              className="flex items-center gap-1 px-3 py-2 text-on-surface-variant hover:text-primary text-sm font-medium rounded-xl hover:bg-surface-container transition-all"
            >
              <MdClose size={16} />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Select All row ─────────────────────────────── */}
      {appointments.length > 1 && (
        <div className="flex items-center gap-2 px-1">
          <button
            onClick={toggleAll}
            className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-secondary transition-colors"
          >
            {allSelected
              ? <MdCheckBox size={16} className="text-secondary" />
              : <MdCheckBoxOutlineBlank size={16} />}
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
          {selectionMode && (
            <span className="text-xs text-secondary font-bold">
              · {selected.size} of {appointments.length} selected
            </span>
          )}
        </div>
      )}

      {/* ── Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-md">
        {appointments.map((appt) => (
          <AppointmentCard
            key={appt.id}
            appt={appt}
            allDoctors={allDoctors}
            selectionMode
            isSelected={selected.has(appt.id)}
            onToggleSelect={toggleOne}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════════════════
          BULK EDIT MODAL  (via portal → document.body)
      ═══════════════════════════════════════════════════ */}
      <Modal open={showEdit} onClose={closeEdit}>
        {/* Blue header */}
        <div style={{ background: '#0058be', padding: '28px 28px 24px', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>Bulk Edit Appointments</h3>
              <p style={{ fontSize: 13, opacity: 0.75, margin: '6px 0 0' }}>
                Rescheduling <strong style={{ color: '#fff' }}>{selected.size}</strong> appointment{selected.size > 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={closeEdit}
              style={{ padding: 8, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 12, color: '#fff', cursor: 'pointer', lineHeight: 0 }}
            >
              <MdClose size={20} />
            </button>
          </div>
        </div>

        <div style={{ padding: 28 }}>
          {editStep === 'form' ? (
            <>
              <p style={{ fontSize: 13, color: '#45474c', marginBottom: 20 }}>
                The new date and time will be applied to <strong>all {selected.size} selected appointments</strong> at once.
              </p>

              {/* Date */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#091426', marginBottom: 8 }}>
                  <MdCalendarToday size={16} color="#0058be" /> New Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nov 15, 2024"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  style={{
                    display: 'block', width: '100%', boxSizing: 'border-box',
                    border: '1.5px solid #c5c6cd', borderRadius: 12, padding: '12px 14px',
                    fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#0058be'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#c5c6cd'; }}
                />
              </div>

              {/* Time */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#091426', marginBottom: 8 }}>
                  <MdAccessTime size={16} color="#0058be" /> New Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 11:00 AM"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  style={{
                    display: 'block', width: '100%', boxSizing: 'border-box',
                    border: '1.5px solid #c5c6cd', borderRadius: 12, padding: '12px 14px',
                    fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#0058be'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#c5c6cd'; }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={closeEdit}
                  style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: '1.5px solid #c5c6cd', background: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', color: '#091426' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!editDate.trim() || !editTime.trim()) { toast.error('Please fill in both date and time.'); return; }
                    setEditStep('confirm');
                  }}
                  style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: 'none', background: '#0058be', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                >
                  Review & Confirm
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Confirm step */}
              <div style={{ background: '#f0f4ff', border: '1.5px solid #c0d4ff', borderRadius: 14, padding: 16, marginBottom: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 900, color: '#091426', margin: '0 0 8px' }}>Confirm Changes</p>
                <p style={{ fontSize: 13, color: '#45474c', margin: '4px 0' }}>📅 <strong>New Date:</strong> {editDate}</p>
                <p style={{ fontSize: 13, color: '#45474c', margin: '4px 0' }}>⏰ <strong>New Time:</strong> {editTime}</p>
                <p style={{ fontSize: 13, color: '#45474c', margin: '4px 0' }}>📋 <strong>Appointments:</strong> {selected.size} selected</p>
              </div>
              <p style={{ fontSize: 12, color: '#75777d', marginBottom: 20 }}>
                This will overwrite the existing schedule for all selected appointments. This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setEditStep('form')}
                  disabled={isSaving}
                  style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: '1.5px solid #c5c6cd', background: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', color: '#091426', opacity: isSaving ? 0.5 : 1 }}
                >
                  Go Back
                </button>
                <button
                  onClick={handleBulkEdit}
                  disabled={isSaving}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 0', borderRadius: 12, border: 'none', background: '#0058be', color: '#fff', fontSize: 14, fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1 }}
                >
                  {isSaving ? <><ImSpinner8 size={15} className="animate-spin" /> Saving…</> : <><MdSave size={16} /> Save Changes</>}
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* ══════════════════════════════════════════════════
          BULK CANCEL MODAL  (via portal → document.body)
      ═══════════════════════════════════════════════════ */}
      <Modal open={showCancel} onClose={closeCancel}>
        {/* Red header */}
        <div style={{ background: '#ba1a1a', padding: '28px 28px 24px', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MdWarning size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>Cancel Appointments</h3>
              <p style={{ fontSize: 13, opacity: 0.75, margin: '4px 0 0' }}>This action cannot be undone</p>
            </div>
            <button
              onClick={closeCancel}
              style={{ marginLeft: 'auto', padding: 8, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 12, color: '#fff', cursor: 'pointer', lineHeight: 0 }}
            >
              <MdClose size={20} />
            </button>
          </div>
        </div>

        <div style={{ padding: 28 }}>
          <p style={{ fontSize: 14, color: '#45474c', lineHeight: 1.6, marginBottom: 24 }}>
            Are you sure you want to cancel{' '}
            <strong style={{ color: '#091426' }}>{selected.size} appointment{selected.size > 1 ? 's' : ''}</strong>?
            All selected visits will be permanently marked as cancelled.
          </p>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={closeCancel}
              disabled={isCancelling}
              style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: '1.5px solid #c5c6cd', background: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', color: '#091426', opacity: isCancelling ? 0.5 : 1 }}
            >
              Keep Appointments
            </button>
            <button
              onClick={handleBulkCancel}
              disabled={isCancelling}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 0', borderRadius: 12, border: 'none', background: '#ba1a1a', color: '#fff', fontSize: 14, fontWeight: 700, cursor: isCancelling ? 'not-allowed' : 'pointer', opacity: isCancelling ? 0.7 : 1 }}
            >
              {isCancelling ? <><ImSpinner8 size={15} className="animate-spin" /> Cancelling…</> : <><MdCancelScheduleSend size={16} /> Confirm Cancel</>}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
