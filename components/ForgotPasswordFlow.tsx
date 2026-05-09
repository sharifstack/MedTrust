'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdError, MdArrowBack, MdCheckCircle } from 'react-icons/md';
import { ImSpinner8 } from 'react-icons/im';
import { resetPassword } from '@/lib/actions';

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState<'identifier' | 'otp' | 'reset' | 'success'>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handlers for each step
  async function handleIdentifierSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const inputIdentifier = formData.get('identifier') as string;
    
    // Basic validation: Email OR Bangladeshi Phone Number (+8801... or 01...)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;

    if (!emailRegex.test(inputIdentifier) && !phoneRegex.test(inputIdentifier)) {
      setError('Please enter a valid email address or Bangladeshi phone number.');
      return;
    }

    setIdentifier(inputIdentifier);
    setIsLoading(true);

    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1500);
  }

  async function handleOtpSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const inputOtp = formData.get('otp') as string;

    if (!/^\d{6}$/.test(inputOtp)) {
      setError('OTP must be exactly 6 digits.');
      return;
    }

    setIsLoading(true);

    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      setOtp(inputOtp);
      setStep('reset');
    }, 1500);
  }

  async function handleResetSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(newPassword);
      setStep('success');
    } catch (err) {
      setError('An error occurred while resetting the password.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
          <MdError size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Identifier */}
      {step === 'identifier' && (
        <form onSubmit={handleIdentifierSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="identifier" className="text-sm font-semibold text-on-surface">
              Email or Phone Number
            </label>
            <div className="relative">
              <MdEmail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                autoFocus
                placeholder="Email or +8801..."
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full bg-secondary text-on-secondary text-sm font-bold py-3 rounded-xl shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <ImSpinner8 size={16} className="animate-spin" />
                Sending OTP…
              </>
            ) : (
              'Send OTP'
            )}
          </button>
          
          <div className="text-center mt-2">
            <Link href="/login" className="text-sm text-secondary hover:underline flex items-center justify-center gap-1">
              <MdArrowBack size={16} /> Back to Login
            </Link>
          </div>
        </form>
      )}

      {/* Step 2: OTP Verification */}
      {step === 'otp' && (
        <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
          <div className="text-sm text-on-surface-variant mb-2">
            We sent a 6-digit verification code to <span className="font-semibold text-on-surface">{identifier}</span>.
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="otp" className="text-sm font-semibold text-on-surface">
              Enter OTP
            </label>
            <div className="relative">
              <MdLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              <input
                id="otp"
                name="otp"
                type="text"
                maxLength={6}
                required
                autoFocus
                placeholder="123456"
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all tracking-widest"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full bg-secondary text-on-secondary text-sm font-bold py-3 rounded-xl shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <ImSpinner8 size={16} className="animate-spin" />
                Verifying…
              </>
            ) : (
              'Verify OTP'
            )}
          </button>

          <div className="text-center mt-2 flex justify-between items-center px-1">
            <button
              type="button"
              onClick={() => setStep('identifier')}
              className="text-sm text-secondary hover:underline flex items-center gap-1"
            >
              <MdArrowBack size={16} /> Change email/phone
            </button>
            <button
              type="button"
              onClick={(e) => handleIdentifierSubmit(e as any)}
              className="text-sm text-secondary hover:underline"
            >
              Resend OTP
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Reset Password */}
      {step === 'reset' && (
        <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="newPassword" className="text-sm font-semibold text-on-surface">
              New Password
            </label>
            <div className="relative">
              <MdLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                placeholder="••••••••"
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-12 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors p-1 rounded"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-semibold text-on-surface">
              Confirm Password
            </label>
            <div className="relative">
              <MdLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-12 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full bg-secondary text-on-secondary text-sm font-bold py-3 rounded-xl shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <ImSpinner8 size={16} className="animate-spin" />
                Resetting…
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      )}

      {/* Step 4: Success */}
      {step === 'success' && (
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
            <MdCheckCircle size={40} />
          </div>
          <div>
            <h3 className="font-h3 text-h3 text-on-surface mb-2">Password Reset!</h3>
            <p className="text-sm text-on-surface-variant">
              Your password has been successfully reset. You can now use your new password to sign in.
            </p>
          </div>
          <Link
            href="/login"
            className="mt-4 w-full bg-secondary text-on-secondary text-sm font-bold py-3 rounded-xl shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center"
          >
            Sign in to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
