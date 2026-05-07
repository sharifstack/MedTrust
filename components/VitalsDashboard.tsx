'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdMonitorHeart, MdWaterDrop, MdHistory, MdAdd, MdClose, MdCheckCircle, MdWarning } from 'react-icons/md';
import { ImSpinner8 } from 'react-icons/im';
import { addVitalsReading } from '@/lib/actions';

function getBpStatus(bp: string) {
  if (!bp) return { label: 'Unknown', color: 'text-on-surface-variant', bg: 'bg-surface-container' };
  const [sysStr, diaStr] = bp.split('/');
  const systolic = parseInt(sysStr, 10);
  const diastolic = parseInt(diaStr, 10);
  
  if (systolic < 120 && diastolic < 80) return { label: 'Normal', color: 'text-[#166534]', bg: 'bg-[#DCFCE7]' };
  if (systolic >= 120 && systolic < 130 && diastolic < 80) return { label: 'Elevated', color: 'text-[#854D0E]', bg: 'bg-[#FEF9C3]' };
  return { label: 'High', color: 'text-[#991B1B]', bg: 'bg-[#FEE2E2]' };
}

function getHrStatus(bpm: number) {
  if (!bpm) return { label: 'Unknown', color: 'text-on-surface-variant', bg: 'bg-surface-container' };
  if (bpm < 60) return { label: 'Low', color: 'text-[#1E40AF]', bg: 'bg-[#DBEAFE]' };
  if (bpm >= 60 && bpm <= 100) return { label: 'Normal', color: 'text-[#166534]', bg: 'bg-[#DCFCE7]' };
  return { label: 'High', color: 'text-[#991B1B]', bg: 'bg-[#FEE2E2]' };
}

function formatDate(isoString: string) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);
}

export default function VitalsDashboard({ user, history }: { user: any, history: any[] }) {
  const [isLogging, setIsLogging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const [hrInput, setHrInput] = useState('');
  const [sysInput, setSysInput] = useState('');
  const [diaInput, setDiaInput] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const vitals = user.vitals || {};
  
  // Calculate remaining checks
  const today = new Date().toISOString().split('T')[0];
  const isToday = vitals.lastCheckedDate === today;
  const checksUsed = isToday ? (vitals.dailyChecks || 0) : 0;
  const checksRemaining = Math.max(0, 3 - checksUsed);

  const currentBpStatus = getBpStatus(vitals.bloodPressure);
  const currentHrStatus = getHrStatus(vitals.heartRate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!hrInput || !sysInput || !diaInput) {
      setError('Please fill in all fields.');
      return;
    }
    
    setIsSaving(true);
    try {
      const bpString = `${sysInput}/${diaInput}`;
      await addVitalsReading(parseInt(hrInput, 10), bpString);
      setIsLogging(false);
      setHrInput('');
      setSysInput('');
      setDiaInput('');
    } catch (err: any) {
      setError(err.message || 'Failed to add reading.');
    } finally {
      setIsSaving(false);
    }
  };

  const modalContent = isLogging ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-surface rounded-2xl p-lg w-full max-w-[448px] shadow-xl border border-outline-variant animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-lg">
          <h3 className="font-h3 text-h3 text-primary flex items-center gap-2">
            <MdAdd size={24} className="text-secondary" />
            Log New Vitals
          </h3>
          <button onClick={() => setIsLogging(false)} className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors">
            <MdClose size={20} />
          </button>
        </div>
        
        {error && (
          <div className="mb-md p-sm bg-error-container text-on-error-container rounded-lg font-body-md flex items-center gap-2">
            <MdWarning size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
          <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant/50">
            <label className="font-label-sm font-bold text-on-surface flex items-center gap-1.5 mb-md">
              <MdMonitorHeart size={18} className="text-secondary" /> Heart Rate (BPM)
            </label>
            <input 
              type="number"
              placeholder="e.g. 72"
              className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-lg focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all text-center" 
              value={hrInput} 
              onChange={e => setHrInput(e.target.value)} 
              min="30" max="250"
            />
          </div>
          
          <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant/50">
            <label className="font-label-sm font-bold text-on-surface flex items-center gap-1.5 mb-md">
              <MdWaterDrop size={18} className="text-secondary" /> Blood Pressure (mmHg)
            </label>
            <div className="flex items-center gap-sm">
              <div className="flex-1">
                <span className="block text-center font-caption text-on-surface-variant mb-1">Systolic</span>
                <input 
                  type="number"
                  placeholder="120"
                  className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-lg focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all text-center" 
                  value={sysInput} 
                  onChange={e => setSysInput(e.target.value)} 
                  min="70" max="250"
                />
              </div>
              <span className="text-h3 text-outline font-light mt-4">/</span>
              <div className="flex-1">
                <span className="block text-center font-caption text-on-surface-variant mb-1">Diastolic</span>
                <input 
                  type="number"
                  placeholder="80"
                  className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-lg focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all text-center" 
                  value={diaInput} 
                  onChange={e => setDiaInput(e.target.value)} 
                  min="40" max="150"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-sm mt-xs">
            <button 
              type="button" 
              onClick={() => setIsLogging(false)}
              className="px-md py-sm font-label-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving || !hrInput || !sysInput || !diaInput}
              className="flex items-center gap-1.5 px-lg py-sm bg-secondary text-white font-label-sm font-bold rounded-lg shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isSaving ? <><ImSpinner8 size={16} className="animate-spin" /> Saving...</> : 'Save Reading'}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <div className="flex flex-col gap-lg">
      {/* Current Vitals Section */}
      <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-[0px_4px_20px_rgba(30,41,59,0.05)] border border-outline-variant/30 overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-[#00b4d8]"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md mb-lg">
          <div>
            <h3 className="font-h3 text-h3 text-primary flex items-center gap-2">
              <MdMonitorHeart className="text-secondary" />
              Health Vitals
            </h3>
            <p className="font-body-md text-on-surface-variant mt-1">Track your daily heart rate and blood pressure.</p>
          </div>
          
          <div className="flex flex-col items-end">
            <button 
              onClick={() => setIsLogging(true)}
              disabled={checksRemaining === 0}
              className="flex items-center gap-1.5 px-md py-sm bg-secondary text-on-secondary font-label-sm font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
            >
              <MdAdd size={18} />
              Log Reading
            </button>
            <span className="font-caption text-on-surface-variant mt-1.5 font-medium">
              {checksRemaining} of 3 daily checks left
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
          {/* Heart Rate Card */}
          <div className="bg-surface p-md rounded-xl border border-outline-variant/40 hover:border-secondary/30 transition-colors group/card relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-secondary/5 group-hover/card:text-secondary/10 transition-colors">
              <MdMonitorHeart size={100} />
            </div>
            <div className="flex items-center justify-between mb-sm relative z-10">
              <p className="font-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Heart Rate</p>
              <span className={`px-2 py-0.5 rounded-full font-caption font-bold ${currentHrStatus.bg} ${currentHrStatus.color}`}>
                {currentHrStatus.label}
              </span>
            </div>
            <div className="flex items-baseline space-x-1 relative z-10">
              <span className="text-[40px] leading-none font-bold text-primary tracking-tight">{vitals.heartRate || '--'}</span>
              <span className="font-label-sm text-on-surface-variant font-medium">BPM</span>
            </div>
          </div>
          
          {/* Blood Pressure Card */}
          <div className="bg-surface p-md rounded-xl border border-outline-variant/40 hover:border-secondary/30 transition-colors group/card relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-secondary/5 group-hover/card:text-secondary/10 transition-colors">
              <MdWaterDrop size={100} />
            </div>
            <div className="flex items-center justify-between mb-sm relative z-10">
              <p className="font-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Blood Pressure</p>
              <span className={`px-2 py-0.5 rounded-full font-caption font-bold ${currentBpStatus.bg} ${currentBpStatus.color}`}>
                {currentBpStatus.label}
              </span>
            </div>
            <div className="flex items-baseline space-x-1 relative z-10">
              <span className="text-[40px] leading-none font-bold text-primary tracking-tight">{vitals.bloodPressure || '--/--'}</span>
              <span className="font-label-sm text-on-surface-variant font-medium">mmHg</span>
            </div>
          </div>
        </div>
      </div>

      {/* History Section */}
      {history && history.length > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-[0px_4px_20px_rgba(30,41,59,0.05)] border border-outline-variant/30">
          <h3 className="font-label-sm font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2 mb-md">
            <MdHistory size={18} />
            Recent Readings
          </h3>
          <div className="flex flex-col gap-sm max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {history.map((reading) => {
              const bpStat = getBpStatus(reading.bloodPressure);
              const hrStat = getHrStatus(reading.heartRate);
              
              return (
                <div key={reading.id} className="flex items-center justify-between p-sm md:p-md bg-surface rounded-xl border border-outline-variant/30 hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-md">
                    <div className="hidden sm:flex w-10 h-10 rounded-full bg-secondary/10 items-center justify-center text-secondary">
                      <MdCheckCircle size={20} />
                    </div>
                    <div>
                      <p className="font-label-sm font-bold text-on-surface">{formatDate(reading.date)}</p>
                      <div className="flex items-center gap-xs mt-1">
                        <span className={`w-2 h-2 rounded-full ${hrStat.bg.replace('bg-', 'bg-').replace('100', '500')}`}></span>
                        <span className="font-caption text-on-surface-variant mr-2">HR: {reading.heartRate}</span>
                        
                        <span className={`w-2 h-2 rounded-full ${bpStat.bg.replace('bg-', 'bg-').replace('100', '500')}`}></span>
                        <span className="font-caption text-on-surface-variant">BP: {reading.bloodPressure}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${bpStat.bg} ${bpStat.color}`}>BP: {bpStat.label}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${hrStat.bg} ${hrStat.color}`}>HR: {hrStat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {mounted && createPortal(modalContent, document.body)}
    </div>
  );
}
