'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAppointment, getDoctor, completePayment } from '@/lib/actions';
import { toast } from 'react-toastify';
import {
  MdCheckCircle,
  MdError,
  MdPayment,
  MdAccountBalance,
  MdCreditCard,
  MdSmartphone,
  MdAccountBalanceWallet,
  MdArrowBack,
  MdSecurity,
  MdReceipt,
  MdOutlineAccessTime,
  MdOutlineCalendarToday,
  MdLocalHospital,
  MdAttachMoney,
  MdWifi,
  MdWifiOff,
  MdChevronRight,
  MdInfo,
} from 'react-icons/md';
import { ImSpinner8 } from 'react-icons/im';

type PaymentStep = 'select' | 'processing' | 'success' | 'failed';
type PaymentCategory = 'online' | 'offline' | null;
type OnlineMethod = 'bkash' | 'nagad' | 'card' | 'bank';
type OfflineMethod = 'clinic' | 'cash';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const [appointment, setAppointment] = useState<any>(null);
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<PaymentStep>('select');

  // Two-level selection
  const [selectedCategory, setSelectedCategory] = useState<PaymentCategory>(null);
  const [selectedOnlineMethod, setSelectedOnlineMethod] = useState<OnlineMethod | null>(null);
  const [selectedOfflineMethod, setSelectedOfflineMethod] = useState<OfflineMethod | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const appt = await getAppointment(bookingId);
        if (!appt) { router.push('/appointments'); return; }
        setAppointment(appt);
        const doc = await getDoctor(appt.doctorId);
        setDoctor(doc);
      } catch {
        toast.error('Failed to load booking details.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [bookingId, router]);

  const serviceCharge = 50;
  const totalAmount = (doctor?.fee || 0) + serviceCharge;

  const canProceed =
    selectedCategory === 'online'
      ? selectedOnlineMethod !== null
      : selectedCategory === 'offline'
        ? selectedOfflineMethod !== null
        : false;

  const handleProceed = async () => {
    if (!canProceed) return;

    if (selectedCategory === 'offline') {
      // Offline: just confirm booking, no real payment
      setIsProcessing(true);
      await new Promise((r) => setTimeout(r, 1500));
      try {
        const txId = `OFFLINE-${Date.now()}`;
        const result = await completePayment(bookingId, txId, 'Offline', totalAmount);
        if (result.success) {
          setStep('success');
          toast.success('Booking confirmed! Pay at the clinic.');
          setTimeout(() => router.push('/appointments'), 3000);
        } else {
          setStep('failed');
          toast.error('Confirmation failed. Please try again.');
        }
      } catch {
        setStep('failed');
        toast.error('An error occurred. Please try again.');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Online payment
    setStep('processing');
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 3000));
    try {
      const txId = `TRX${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
      const result = await completePayment(bookingId, txId, selectedOnlineMethod!, totalAmount);
      if (result.success) {
        setStep('success');
        toast.success('Payment completed successfully!');
        setTimeout(() => router.push('/appointments'), 3000);
      } else {
        setStep('failed');
        toast.error('Payment failed. Please try again.');
      }
    } catch {
      setStep('failed');
      toast.error('An error occurred during payment processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-container-low gap-4">
        <ImSpinner8 className="text-secondary animate-spin text-4xl" />
        <p className="font-body-md text-on-surface-variant animate-pulse">Initializing Secure Checkout...</p>
      </div>
    );
  }

  const onlineMethods: { id: OnlineMethod; label: string; sub: string; color: string; icon: React.ReactNode }[] = [
    { id: 'bkash', label: 'bKash', sub: 'Mobile Banking', color: '#D12053', icon: <MdSmartphone size={28} style={{ color: '#D12053' }} /> },
    { id: 'nagad', label: 'Nagad', sub: 'Digital Wallet', color: '#F7941D', icon: <MdAccountBalanceWallet size={28} style={{ color: '#F7941D' }} /> },
    { id: 'card', label: 'Card Payment', sub: 'Visa / Mastercard', color: '#2563eb', icon: <MdCreditCard size={28} style={{ color: '#2563eb' }} /> },
    { id: 'bank', label: 'Net Banking', sub: 'All Major Banks', color: '#16a34a', icon: <MdAccountBalance size={28} style={{ color: '#16a34a' }} /> },
  ];

  const offlineMethods: { id: OfflineMethod; label: string; sub: string; icon: React.ReactNode }[] = [
    { id: 'clinic', label: 'Pay at Clinic / Hospital', sub: 'Bring cash or card to your appointment', icon: <MdLocalHospital size={28} className="text-secondary" /> },
    { id: 'cash', label: 'Cash on Visit', sub: 'Pay the doctor directly on arrival', icon: <MdAttachMoney size={28} className="text-secondary" /> },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fc] px-4 md:px-8">
      <div className="max-w-6xl mx-auto py-20">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => router.back()}
            className="p-3 bg-white hover:bg-surface-container-high rounded-2xl shadow-sm text-primary transition-all active:scale-95"
          >
            <MdArrowBack size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">Secure Checkout</h1>
            <p className="text-on-surface-variant font-medium text-sm mt-0.5">Complete your appointment payment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ─── Main Panel ─────────────────────────────── */}
          <div className="lg:col-span-7 space-y-6">

            {/* ── STEP: select ── */}
            {step === 'select' && (
              <>
                {/* Amount Banner */}
                <div className="bg-secondary rounded-3xl p-6 flex items-center justify-between shadow-lg shadow-secondary/20">
                  <div>
                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Total Payable</p>
                    <p className="text-white text-4xl font-black mt-1">৳ {totalAmount}</p>
                    <p className="text-white/60 text-xs mt-1">Consultation ৳{doctor?.fee} + Service ৳{serviceCharge}</p>
                  </div>
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                    <MdPayment className="text-white text-4xl" />
                  </div>
                </div>

                {/* Category Selection */}
                <div className="bg-white rounded-3xl p-7 shadow-sm border border-white">
                  <h2 className="text-sm font-black text-primary uppercase tracking-widest mb-5 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-secondary text-white text-xs flex items-center justify-center font-black">1</span>
                    Choose Payment Type
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Online */}
                    <button
                      onClick={() => { setSelectedCategory('online'); setSelectedOfflineMethod(null); }}
                      className={`group relative flex flex-col gap-3 p-6 rounded-2xl border-2 transition-all text-left ${selectedCategory === 'online'
                          ? 'border-secondary bg-secondary/5 shadow-md shadow-secondary/10'
                          : 'border-outline-variant/30 bg-surface-container-lowest hover:border-secondary/40 hover:bg-secondary/[0.02]'
                        }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedCategory === 'online' ? 'bg-secondary text-white' : 'bg-surface-container-low text-secondary'}`}>
                        <MdWifi size={26} />
                      </div>
                      <div>
                        <p className="font-black text-primary text-base">Online Payment</p>
                        <p className="text-xs text-on-surface-variant font-medium mt-0.5">bKash, Nagad, Card, Bank</p>
                      </div>
                      {selectedCategory === 'online' && (
                        <span className="absolute top-3 right-3 w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                          <MdCheckCircle className="text-white text-xs" />
                        </span>
                      )}
                    </button>

                    {/* Offline */}
                    <button
                      onClick={() => { setSelectedCategory('offline'); setSelectedOnlineMethod(null); }}
                      className={`group relative flex flex-col gap-3 p-6 rounded-2xl border-2 transition-all text-left ${selectedCategory === 'offline'
                          ? 'border-secondary bg-secondary/5 shadow-md shadow-secondary/10'
                          : 'border-outline-variant/30 bg-surface-container-lowest hover:border-secondary/40 hover:bg-secondary/[0.02]'
                        }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedCategory === 'offline' ? 'bg-secondary text-white' : 'bg-surface-container-low text-secondary'}`}>
                        <MdWifiOff size={26} />
                      </div>
                      <div>
                        <p className="font-black text-primary text-base">Offline Payment</p>
                        <p className="text-xs text-on-surface-variant font-medium mt-0.5">Pay at clinic / Cash on visit</p>
                      </div>
                      {selectedCategory === 'offline' && (
                        <span className="absolute top-3 right-3 w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                          <MdCheckCircle className="text-white text-xs" />
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sub-method: Online */}
                {selectedCategory === 'online' && (
                  <div className="bg-white rounded-3xl p-7 shadow-sm border border-white">
                    <h2 className="text-sm font-black text-primary uppercase tracking-widest mb-5 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-secondary text-white text-xs flex items-center justify-center font-black">2</span>
                      Select Payment Gateway
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {onlineMethods.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setSelectedOnlineMethod(m.id)}
                          className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${selectedOnlineMethod === m.id
                              ? 'border-secondary bg-secondary/5 shadow-md shadow-secondary/10'
                              : 'border-outline-variant/30 bg-surface-container-lowest hover:border-secondary/40'
                            }`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-outline-variant/10">
                            {m.icon}
                          </div>
                          <div>
                            <p className="font-black text-primary text-sm">{m.label}</p>
                            <p className="text-xs text-on-surface-variant font-medium mt-0.5">{m.sub}</p>
                          </div>
                          {selectedOnlineMethod === m.id && (
                            <span className="absolute top-3 right-3 w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                              <MdCheckCircle className="text-white text-xs" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="mt-5 flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <MdSecurity className="text-blue-500 mt-0.5 flex-shrink-0" size={18} />
                      <p className="text-xs text-blue-700 font-medium leading-relaxed">
                        Your payment is encrypted with SSL/TLS. We never store card numbers or wallet PINs.
                      </p>
                    </div>
                  </div>
                )}

                {/* Sub-method: Offline */}
                {selectedCategory === 'offline' && (
                  <div className="bg-white rounded-3xl p-7 shadow-sm border border-white">
                    <h2 className="text-sm font-black text-primary uppercase tracking-widest mb-5 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-secondary text-white text-xs flex items-center justify-center font-black">2</span>
                      Select Offline Method
                    </h2>
                    <div className="space-y-4">
                      {offlineMethods.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setSelectedOfflineMethod(m.id)}
                          className={`relative w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${selectedOfflineMethod === m.id
                              ? 'border-secondary bg-secondary/5 shadow-md shadow-secondary/10'
                              : 'border-outline-variant/30 bg-surface-container-lowest hover:border-secondary/40'
                            }`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                            {m.icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-black text-primary text-sm">{m.label}</p>
                            <p className="text-xs text-on-surface-variant font-medium mt-0.5">{m.sub}</p>
                          </div>
                          {selectedOfflineMethod === m.id && (
                            <span className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                              <MdCheckCircle className="text-white text-xs" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {selectedOfflineMethod && (
                      <div className="mt-5 flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <MdInfo className="text-amber-500 mt-0.5 flex-shrink-0" size={18} />
                        <div className="text-xs text-amber-800 font-medium leading-relaxed space-y-1">
                          <p className="font-black">Manual Confirmation Process</p>
                          <p>Your booking will be reserved. Please bring payment to your appointment. A staff member will confirm your payment on arrival.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Proceed Button */}
                <button
                  onClick={handleProceed}
                  disabled={!canProceed || isProcessing}
                  className={`w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black text-base uppercase tracking-widest transition-all ${canProceed
                      ? 'bg-secondary text-white shadow-lg shadow-secondary/30 hover:opacity-95 hover:shadow-xl active:scale-[0.98]'
                      : 'bg-outline-variant/30 text-on-surface-variant cursor-not-allowed'
                    }`}
                >
                  {isProcessing ? (
                    <><ImSpinner8 className="animate-spin" size={20} /> Confirming...</>
                  ) : (
                    <>
                      <MdChevronRight size={22} />
                      Proceed to Payment
                    </>
                  )}
                </button>

                {!canProceed && (
                  <p className="text-center text-xs text-on-surface-variant font-medium -mt-3">
                    Please select a payment type and method to continue.
                  </p>
                )}
              </>
            )}

            {/* ── STEP: processing ── */}
            {step === 'processing' && (
              <div className="bg-white rounded-3xl p-16 shadow-sm flex flex-col items-center justify-center text-center min-h-[420px]">
                <div className="relative w-28 h-28 mb-10">
                  <div className="absolute inset-0 border-[8px] border-secondary/10 rounded-full" />
                  <div className="absolute inset-0 border-[8px] border-t-secondary rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MdPayment className="text-secondary text-4xl" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-primary">Verifying Payment</h3>
                <p className="text-on-surface-variant mt-3 font-medium max-w-sm">
                  Confirming your transaction. Please do not close this window.
                </p>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden max-w-xs mt-10">
                  <div className="bg-secondary h-full rounded-full animate-[progress_2s_infinite_ease-in-out] w-1/3" />
                </div>
              </div>
            )}

            {/* ── STEP: success ── */}
            {step === 'success' && (
              <div className="bg-white rounded-3xl p-16 shadow-sm flex flex-col items-center justify-center text-center min-h-[420px]">
                <div className="w-28 h-28 bg-green-50 rounded-[2.5rem] flex items-center justify-center text-green-500 mb-8 shadow-xl shadow-green-500/10">
                  <MdCheckCircle size={72} />
                </div>
                <h3 className="text-4xl font-black text-primary">
                  {selectedCategory === 'offline' ? 'Booking Confirmed!' : 'Payment Successful!'}
                </h3>
                <p className="text-on-surface-variant mt-4 font-medium text-base max-w-sm">
                  {selectedCategory === 'offline'
                    ? `Your appointment with Dr. ${doctor?.name} is reserved. Pay at the clinic on arrival.`
                    : `Your appointment with Dr. ${doctor?.name} has been confirmed and paid.`}
                </p>
                <div className="mt-8 px-8 py-3 bg-green-500/10 rounded-full border border-green-500/20">
                  <p className="text-xs font-black text-green-700 uppercase tracking-widest animate-pulse">
                    Redirecting to your appointments...
                  </p>
                </div>
              </div>
            )}

            {/* ── STEP: failed ── */}
            {step === 'failed' && (
              <div className="bg-white rounded-3xl p-16 shadow-sm flex flex-col items-center justify-center text-center min-h-[420px]">
                <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-500 mb-8">
                  <MdError size={64} />
                </div>
                <h3 className="text-3xl font-black text-primary">Transaction Failed</h3>
                <p className="text-on-surface-variant mt-3 font-medium max-w-sm leading-relaxed">
                  Something went wrong. Please check your balance or connection and try again.
                </p>
                <button
                  onClick={() => setStep('select')}
                  className="mt-8 px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:opacity-90 active:scale-95 transition-all"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* ─── Sidebar Summary ────────────────────────── */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-8">

            {/* Booking Summary Card */}
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-white">
              <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                <MdReceipt size={16} className="text-secondary" />
                Booking Summary
              </h3>

              <div className="flex gap-4 mb-6 p-4 bg-surface-container-low/40 rounded-2xl border border-outline-variant/10">
                <div className="w-18 h-18 rounded-xl overflow-hidden shadow-sm border border-outline-variant/10 flex-shrink-0" style={{ width: 72, height: 72 }}>
                  <img src={doctor?.image} alt={doctor?.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Doctor</p>
                  <h4 className="text-lg font-black text-primary leading-tight">Dr. {doctor?.name}</h4>
                  <p className="text-xs text-on-surface-variant font-bold mt-0.5">{doctor?.specialty}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <MdOutlineCalendarToday size={15} />
                    <span className="font-medium">Date</span>
                  </div>
                  <span className="font-bold text-primary">{appointment?.date}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <MdOutlineAccessTime size={15} />
                    <span className="font-medium">Time</span>
                  </div>
                  <span className="font-bold text-primary">{appointment?.time}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <MdCheckCircle size={15} />
                    <span className="font-medium">Type</span>
                  </div>
                  <span className="font-bold text-primary">{appointment?.type}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-5 border-t border-dashed border-outline-variant/30">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant font-medium">Consultation Fee</span>
                  <span className="font-bold text-primary">৳ {doctor?.fee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant font-medium">Service Charge</span>
                  <span className="font-bold text-primary">৳ {serviceCharge}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20 mt-1">
                  <span className="font-black text-primary uppercase tracking-tight text-sm">Total Amount</span>
                  <span className="text-3xl font-black text-secondary">৳ {totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-secondary/5 rounded-3xl p-6 border border-secondary/10">
              <h4 className="text-xs font-black text-secondary uppercase tracking-widest mb-2">Need Help?</h4>
              <p className="text-xs text-primary/70 leading-relaxed font-medium">
                Issues during checkout? Contact our 24/7 support at{' '}
                <span className="font-bold text-secondary">support@medtrust.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
