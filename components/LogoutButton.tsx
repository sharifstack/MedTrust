'use client';

import { MdLogout } from 'react-icons/md';
import { logout } from '@/lib/actions';

export default function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="flex items-center gap-1.5 px-md py-xs text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg font-label-sm font-bold transition-all border border-transparent hover:border-error/20"
    >
      <MdLogout size={18} />
      <span className="hidden md:inline">Sign Out</span>
    </button>
  );
}
