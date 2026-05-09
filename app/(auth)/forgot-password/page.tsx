import ForgotPasswordFlow from '@/components/ForgotPasswordFlow';
import { MdHealthAndSafety } from 'react-icons/md';

export const metadata = {
  title: 'Forgot Password — MedTrust',
  description: 'Reset your MedTrust patient portal password',
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-background to-[#f5f0ff] flex flex-col items-center justify-center p-md">

      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-120px] right-[-120px] w-[480px] h-[480px] rounded-full bg-primary/8 blur-[80px]" />
        <div className="absolute bottom-[-120px] left-[-120px] w-[420px] h-[420px] rounded-full bg-secondary/8 blur-[80px]" />
      </div>

      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-1">
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shadow-md">
            <MdHealthAndSafety size={24} className="text-white" />
          </div>
          <span className="font-h2 text-h2 font-bold text-primary tracking-tight">MedTrust</span>
        </div>
        <p className="font-body-md text-on-surface-variant">Your personal health companion</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-[420px] bg-surface rounded-2xl border border-outline-variant/40 shadow-[0_8px_48px_rgba(30,41,59,0.12)] overflow-hidden">
        {/* Card top accent */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-tertiary" />

        <div className="p-8">
          <h1 className="font-h2 text-h2 text-on-surface mb-1">Reset Password</h1>
          <p className="font-body-md text-on-surface-variant mb-6">Enter your email or phone to reset your password.</p>

          <ForgotPasswordFlow />

        </div>
      </div>

      <p className="mt-6 font-caption text-on-surface-variant">
        © 2024 MedTrust. All rights reserved.
      </p>
    </main>
  );
}
