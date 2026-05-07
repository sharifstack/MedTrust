'use client';

import { MdCheckCircle, MdCircle, MdError } from 'react-icons/md';

interface StepperProps {
  status: 'Upcoming' | 'Pending' | 'Completed' | 'Cancelled';
}

export default function AppointmentStatusStepper({ status }: StepperProps) {
  const steps = [
    { label: 'Booked', active: true },
    { label: 'Confirmed', active: status !== 'Pending' && status !== 'Cancelled' },
    { label: 'Consultation', active: status === 'Completed' },
    { label: 'Completed', active: status === 'Completed' },
  ];

  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-2 text-error font-label-sm">
        <MdError size={18} />
        <span>This appointment has been cancelled.</span>
      </div>
    );
  }

  return (
    <div className="flex items-center w-full max-w-md">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center relative">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step.active ? 'bg-secondary text-white' : 'bg-surface-container text-outline'}`}>
              {step.active ? <MdCheckCircle size={16} /> : <MdCircle size={10} />}
            </div>
            <span className={`absolute -bottom-6 text-[10px] font-bold uppercase whitespace-nowrap ${step.active ? 'text-secondary' : 'text-outline'}`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-[2px] mx-2 ${steps[index + 1].active ? 'bg-secondary' : 'bg-surface-container'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
