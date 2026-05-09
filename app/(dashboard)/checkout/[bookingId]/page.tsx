'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAppointment, getDoctor, completePayment } from '@/lib/actions';
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
  MdOutlineCalendarToday
} from 'react-icons/md';
import { ImSpinner8 } from 'react-icons/im';

type PaymentStep = 'method' | 'processing' | 'success' | 'failed';
type PaymentMethod = 'bkash' | 'nagad' | 'card' | 'bank';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const [appointment, setAppointment] = useState<any>(null);
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<PaymentStep>('method');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const appt = await getAppointment(bookingId);
        if (!appt) {
          router.push('/appointments');
          return;
        }
        setAppointment(appt);
        
        const doc = await getDoctor(appt.doctorId);
        setDoctor(doc);
      } catch (error) {
        console.error('Error fetching checkout data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [bookingId, router]);

  const handlePayment = async (method: PaymentMethod) => {
    setSelectedMethod(method);
    setStep('processing');
    setIsProcessing(true);

    // Simulate payment gateway interaction
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      const transactionId = `TRX${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
      const result = await completePayment(
        bookingId, 
        transactionId, 
        method, 
        doctor?.fee || 150
      );

      if (result.success) {
        setStep('success');
        setTimeout(() => {
          router.push('/appointments');
        }, 3000);
      } else {
        setStep('failed');
      }
    } catch (error) {
      setStep('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-container-low">
        <ImSpinner8 className="text-secondary animate-spin text-4xl mb-4" />
        <p className="font-body-md text-on-surface-variant animate-pulse">Initializing Secure Checkout...</p>
      </div>
    );
  }

  const serviceCharge = 50;
  const totalAmount = (doctor?.fee || 0) + serviceCharge;

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'bkash': return <MdSmartphone className="text-[#D12053] text-3xl" />;
      case 'nagad': return <MdAccountBalanceWallet className="text-[#F7941D] text-3xl" />;
      case 'card': return <MdCreditCard className="text-blue-600 text-3xl" />;
      case 'bank': return <MdAccountBalance className="text-green-600 text-3xl" />;
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button 
            onClick={() => router.back()}
            className="p-3 bg-white hover:bg-surface-container-high rounded-2xl shadow-sm text-primary transition-all active:scale-95"
          >
            <MdArrowBack size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">Checkout</h1>
            <p className="text-on-surface-variant font-medium">Secure Payment for your Appointment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-8">
            {step === 'method' && (
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0px_20px_50px_rgba(0,0,0,0.05)] border border-white">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-primary uppercase tracking-wider flex items-center gap-3">
                    <MdPayment className="text-secondary" />
                    Select Payment Method
                  </h2>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <MdSecurity size={14} />
                    Secure SSL
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { id: 'bkash' as const, label: 'bKash Wallet', sub: 'Instant Transfer' },
                    { id: 'nagad' as const, label: 'Nagad Wallet', sub: 'Secure Checkout' },
                    { id: 'card' as const, label: 'Credit/Debit Card', sub: 'Visa, Mastercard' },
                    { id: 'bank' as const, label: 'Net Banking', sub: 'All Major Banks' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handlePayment(method.id)}
                      className="group flex items-center gap-6 p-6 bg-surface-container-lowest border-2 border-outline-variant/30 rounded-3xl hover:border-secondary hover:bg-secondary/[0.02] hover:shadow-xl hover:shadow-secondary/5 transition-all active:scale-[0.98] text-left"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                        {getMethodIcon(method.id)}
                      </div>
                      <div>
                        <span className="block text-sm font-black text-primary uppercase tracking-tight">{method.label}</span>
                        <span className="block text-xs text-on-surface-variant font-medium mt-1">{method.sub}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-outline-variant/20">
                  <div className="flex items-center gap-4 p-5 bg-surface-container-low/50 rounded-2xl border border-outline-variant/10">
                    <div className="text-secondary">
                      <MdSecurity size={24} />
                    </div>
                    <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                      Your payment information is encrypted and processed securely. We do not store your full card details or wallet PINs.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {(step === 'processing' || step === 'success' || step === 'failed') && (
              <div className="bg-white rounded-[2.5rem] p-12 md:p-20 shadow-[0px_20px_50px_rgba(0,0,0,0.05)] border border-white flex flex-col items-center justify-center text-center min-h-[500px]">
                {step === 'processing' && (
                  <>
                    <div className="relative w-32 h-32 mb-10">
                      <div className="absolute inset-0 border-[8px] border-secondary/10 rounded-full"></div>
                      <div className="absolute inset-0 border-[8px] border-t-secondary rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center scale-150">
                        {selectedMethod && getMethodIcon(selectedMethod)}
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-primary tracking-tight">Verifying Payment</h3>
                    <p className="text-on-surface-variant mt-4 font-medium max-w-sm">
                      We're confirming your transaction with the provider. Please do not close this window.
                    </p>
                    <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden max-w-[300px] mt-10 shadow-inner">
                      <div className="bg-secondary h-full animate-[progress_2s_infinite_ease-in-out] rounded-full w-1/3"></div>
                    </div>
                  </>
                )}

                {step === 'success' && (
                  <>
                    <div className="w-32 h-32 bg-green-50 rounded-[3rem] flex items-center justify-center text-green-500 mb-10 animate-in zoom-in-50 duration-700 shadow-xl shadow-green-500/10">
                      <MdCheckCircle size={80} />
                    </div>
                    <h3 className="text-4xl font-black text-primary tracking-tight">Payment Successful!</h3>
                    <p className="text-on-surface-variant mt-4 font-medium text-lg">
                      Your appointment with <span className="text-secondary font-bold">Dr. {doctor?.name}</span> has been confirmed.
                    </p>
                    <div className="mt-10 px-8 py-4 bg-green-500/10 rounded-full border border-green-500/20">
                      <p className="text-xs font-black text-green-700 uppercase tracking-[0.2em] animate-pulse">
                        Redirecting to dashboard...
                      </p>
                    </div>
                  </>
                )}

                {step === 'failed' && (
                  <>
                    <div className="w-28 h-28 bg-red-50 rounded-[2.5rem] flex items-center justify-center text-red-500 mb-10">
                      <MdError size={72} />
                    </div>
                    <h3 className="text-3xl font-black text-primary tracking-tight">Transaction Failed</h3>
                    <p className="text-on-surface-variant mt-4 font-medium max-w-sm leading-relaxed">
                      Something went wrong during the payment process. Please check your balance and try again.
                    </p>
                    <button 
                      onClick={() => setStep('method')}
                      className="mt-10 px-10 py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95"
                    >
                      Try Again
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-5 space-y-6">
            {/* Appointment Details */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-[0px_20px_50px_rgba(0,0,0,0.03)] border border-white">
              <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <MdReceipt size={18} className="text-secondary" />
                Booking Summary
              </h3>
              
              <div className="flex gap-5 mb-8 p-4 bg-surface-container-low/30 rounded-3xl border border-outline-variant/10">
                <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10 flex-shrink-0">
                  <img src={doctor?.image} alt={doctor?.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Doctor</p>
                  <h4 className="text-xl font-black text-primary">Dr. {doctor?.name}</h4>
                  <p className="text-xs text-on-surface-variant font-bold">{doctor?.specialty}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <MdOutlineCalendarToday />
                    <span className="font-medium">Date</span>
                  </div>
                  <span className="font-bold text-primary">{appointment?.date}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <MdOutlineAccessTime />
                    <span className="font-medium">Time</span>
                  </div>
                  <span className="font-bold text-primary">{appointment?.time}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <MdCheckCircle />
                    <span className="font-medium">Type</span>
                  </div>
                  <span className="font-bold text-primary">{appointment?.type}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 pt-6 border-t border-dashed border-outline-variant/30">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant font-medium">Consultation Fee</span>
                  <span className="font-bold text-primary">৳ {doctor?.fee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant font-medium">Service Charge</span>
                  <span className="font-bold text-primary">৳ {serviceCharge}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20 mt-2">
                  <span className="text-base font-black text-primary uppercase tracking-tight">Total Amount</span>
                  <span className="text-3xl font-black text-secondary">৳ {totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Support Info */}
            <div className="bg-secondary/5 rounded-[2.5rem] p-8 border border-secondary/10">
              <h4 className="text-xs font-black text-secondary uppercase tracking-widest mb-3">Need Help?</h4>
              <p className="text-xs text-primary/70 leading-relaxed font-medium">
                If you encounter any issues during the checkout process, please contact our 24/7 support at <span className="font-bold text-secondary">support@medtrust.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
