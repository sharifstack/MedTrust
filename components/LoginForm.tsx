'use client';

import { useState } from 'react';
import { login } from '@/lib/actions';
import Link from 'next/link';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdLogin, MdError } from 'react-icons/md';
import { ImSpinner8 } from 'react-icons/im';

export default function LoginForm() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
    }
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
          <MdError size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Email Field */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-semibold text-on-surface">
          Email Address
        </label>
        <div className="relative">
          <MdEmail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue="alex@medtrust.com"
            placeholder="your@email.com"
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-semibold text-on-surface">
            Password
          </label>
          <Link href="/forgot-password" className="text-xs text-secondary hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <MdLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            defaultValue="password123"
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

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full bg-secondary text-on-secondary text-sm font-bold py-3 rounded-xl shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <ImSpinner8 size={16} className="animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            <MdLogin size={18} />
            Sign in to Dashboard
          </>
        )}
      </button>
    </form>
  );
}
