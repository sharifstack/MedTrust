import LoginForm from '@/components/LoginForm';
import { MdHealthAndSafety } from 'react-icons/md';

export const metadata = {
  title: 'Sign In — MedTrust',
  description: 'Sign in to your MedTrust patient portal',
};

export default function LoginPage() {
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
          <h1 className="font-h2 text-h2 text-on-surface mb-1">Welcome back</h1>
          <p className="font-body-md text-on-surface-variant mb-6">Sign in to access your patient dashboard</p>

          <LoginForm />

          <div className="mt-6 pt-5 border-t border-outline-variant/30 text-center">
            <p className="font-caption text-on-surface-variant">
              Demo credentials
            </p>
            <div className="mt-2 flex items-center justify-center gap-xs">
              <code className="px-sm py-xs bg-surface-container-low rounded-md font-mono text-[12px] text-primary font-bold">
                alex@medtrust.com
              </code>
              <span className="text-on-surface-variant">/</span>
              <code className="px-sm py-xs bg-surface-container-low rounded-md font-mono text-[12px] text-primary font-bold">
                password123
              </code>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 font-caption text-on-surface-variant">
        © 2024 MedTrust. All rights reserved.
      </p>
    </main>
  );
}
