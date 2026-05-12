'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdLocationOn, MdDescription, MdVideoCall, MdFileDownload, MdEventRepeat, MdSwapHoriz, MdMoreVert, MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import AppointmentStatusStepper from './AppointmentStatusStepper';
import RescheduleModal from './RescheduleModal';
import CancelButton from './CancelButton';
import BookAgainModal from './BookAgainModal';
import { toast } from 'react-toastify';
import { changeDoctor } from '@/lib/actions';
import Link from 'next/link';

interface AppointmentCardProps {
  appt: any;
  allDoctors: any[];
}

export default function AppointmentCard({ appt, allDoctors }: AppointmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isActive = appt.status === 'Upcoming' || appt.status === 'Pending';
  const isCompleted = appt.status === 'Completed';
  const isCancelled = appt.status === 'Cancelled';

  const [month, day] = appt.date.split(' ');

  return (
    <motion.div 
      layout
      className={`bg-surface-container-lowest rounded-2xl overflow-hidden border ${isActive ? 'border-secondary/20 shadow-md' : 'border-outline-variant/30 opacity-90'} transition-all`}
    >
      <div className="p-md md:p-lg">
        <div className="flex flex-col md:flex-row gap-lg">
          {/* Left: Date and Status */}
          <div className="flex flex-row md:flex-col items-center gap-md shrink-0">
            <div className={`h-20 w-20 ${isActive ? 'bg-secondary text-white' : 'bg-surface-container text-on-surface-variant'} rounded-2xl flex flex-col items-center justify-center shadow-inner`}>
              <span className="text-caption font-bold uppercase tracking-wider">{month || '-'}</span>
              <span className="text-h2 font-bold leading-none">{parseInt(day, 10) || '-'}</span>
            </div>
            <div className="flex flex-col md:items-center gap-1.5">
              <span className={`px-sm py-xs rounded-lg font-caption font-bold text-[10px] uppercase border
                ${appt.status === 'Upcoming' ? 'bg-secondary/10 text-secondary border-secondary/20' : 
                  appt.status === 'Pending' ? 'bg-warning/10 text-warning border-warning/20' :
                  appt.status === 'Completed' ? 'bg-success/10 text-success border-success/20' :
                  'bg-error/10 text-error border-error/20'}`}>
                {appt.status}
              </span>
              {appt.paymentStatus && (
                <span className={`px-sm py-xs rounded-lg font-caption font-bold text-[10px] uppercase border
                  ${appt.paymentStatus === 'Paid' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                  {appt.paymentStatus}
                </span>
              )}
              <span className="mt-1 font-label-sm text-on-surface-variant">{appt.time}</span>
            </div>
          </div>

          {/* Center: Doctor and Stepper */}
          <div className="flex-1 flex flex-col gap-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-md">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-surface-container shadow-sm">
                  <img src={appt.doctor?.image} alt={appt.doctor?.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-h3 text-h3 text-primary">Dr. {appt.doctor?.name}</h3>
                  <p className="font-caption text-on-surface-variant font-medium uppercase tracking-tight">{appt.doctor?.specialty} • {appt.type}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant"
              >
                {isExpanded ? <MdKeyboardArrowUp size={24} /> : <MdKeyboardArrowDown size={24} />}
              </button>
            </div>

            <div className="hidden md:block py-2">
              <AppointmentStatusStepper status={appt.status} paymentStatus={appt.paymentStatus} />
            </div>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex flex-col gap-sm w-full md:w-[260px] shrink-0">
            {isActive ? (
              <>
                <button className="flex items-center justify-center gap-2 px-md py-sm bg-secondary text-white rounded-xl font-label-sm font-bold shadow-sm hover:opacity-90 transition-all">
                  <MdVideoCall size={20} /> Join Visit
                </button>
                <div className="flex flex-row gap-2">
                  <div className="flex-1 min-w-0">
                    <RescheduleModal appointment={appt} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CancelButton appointmentId={appt.id} onCancelSuccess={() => toast.success('Appointment cancelled successfully')} />
                  </div>
                </div>
              </>
            ) : (
              <BookAgainModal appt={appt} onSuccess={(msg: string, type: string) => type === 'error' ? toast.error(msg) : toast.success(msg)} />
            )}
            {isCompleted && (
              <button className="flex items-center justify-center gap-2 px-md py-sm bg-surface-container border border-outline-variant text-primary rounded-xl font-label-sm font-bold hover:bg-surface-container-low transition-all">
                <MdFileDownload size={20} /> Prescription
              </button>
            )}
          </div>
        </div>

        {/* Expandable Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-lg pt-lg border-t border-outline-variant/20 grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="space-y-md">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-surface-container rounded-lg text-secondary">
                      <MdLocationOn size={18} />
                    </div>
                    <div>
                      <p className="font-label-sm font-bold text-on-surface">Location</p>
                      <p className="font-body-md text-on-surface-variant">{appt.location || 'MedTrust Medical Center, Main Branch'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-surface-container rounded-lg text-secondary">
                      <MdDescription size={18} />
                    </div>
                    <div>
                      <p className="font-label-sm font-bold text-on-surface">Notes / Symptoms</p>
                      <p className="font-body-md text-on-surface-variant italic">"{appt.notes || 'No notes provided.'}"</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-sm">
                  <p className="font-label-sm font-bold text-on-surface">Other Actions</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                    <Link href={`/doctor/${appt.doctorId}`} className="flex items-center justify-center gap-2 px-md py-sm bg-surface rounded-xl border border-outline-variant font-label-sm font-bold text-primary hover:bg-surface-container-low transition-all">
                      <MdSwapHoriz size={18} /> Change Doctor
                    </Link>
                    <button className="flex items-center justify-center gap-2 px-md py-sm bg-surface rounded-xl border border-outline-variant font-label-sm font-bold text-primary hover:bg-surface-container-low transition-all">
                      <MdMoreVert size={18} /> Update Info
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
