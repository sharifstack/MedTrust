'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdDashboard, 
  MdEvent, 
  MdSearch, 
  MdPerson, 
  MdNotifications, 
  MdLogout, 
  MdMenu, 
  MdClose,
  MdSettings,
  MdOutlineSearch
} from 'react-icons/md';
import LogoutButton from './LogoutButton';

const navLinks = [
  { href: '/', label: 'Dashboard', icon: <MdDashboard size={20} /> },
  { href: '/appointments', label: 'Appointments', icon: <MdEvent size={20} /> },
  { href: '/search', label: 'Doctors', icon: <MdSearch size={20} /> },
  { href: '/profile', label: 'Profile', icon: <MdPerson size={20} /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(3);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-b border-slate-200/50 dark:border-slate-800/50' 
            : 'py-4 bg-transparent'
        }`}
      >
        <div className="max-w-container-max mx-auto px-md md:px-lg flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20 group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14h-2v-4H7v-2h4V6h2v4h4v2h-4z"/>
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              MedTrust
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-xl text-label-sm font-bold transition-all flex items-center gap-2 ${
                    isActive 
                      ? 'text-secondary' 
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  {link.icon}
                  {link.label}
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-secondary rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative group">
              <button className="p-2.5 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
                <MdOutlineSearch size={24} />
              </button>
            </div>
            
            <div className="relative">
              <button className="p-2.5 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant relative">
                <MdNotifications size={24} />
                {notificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                    {notificationsCount}
                  </span>
                )}
              </button>
            </div>

            <div className="relative h-10 w-[1px] bg-outline-variant/30 mx-1" />

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pl-1 pr-3 rounded-full hover:bg-surface-container transition-all"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant shadow-sm">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcgC8FxQdCHU3uy1ex-FNX0q3Q5Swlaqa2UrMgk6uRQKIpxN0pxR9opX_T2RRRQ5yBLAJC8f9OsdJGqKYBIY9xaL3e4K5Rp7O0w7_pKISzxUH1S2LLiOrn9ROFcKms84z7XyVy_YeE4fNUYVmnhOStC1cTVBjhJrFHqxBffOju-tpbOPw-KvbrJ-jFGXrhxVq8SePZYzDC-7g6ycXJbpkYaL12e3AfWksXt-3EZi8ccDo78516vdHlzeZLZPxgBwGFcpWCMvyAfAQs" 
                    alt="User" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-[12px] font-bold text-primary leading-tight">Alex Johnson</p>
                  <p className="text-[10px] text-on-surface-variant leading-tight">Patient Account</p>
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[-1]" 
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-outline-variant/30 p-2 z-50 overflow-hidden"
                    >
                      <div className="p-3 border-b border-outline-variant/30 mb-1">
                        <p className="text-sm font-bold text-primary">Alexander Johnson</p>
                        <p className="text-[11px] text-on-surface-variant">alex.j@example.com</p>
                      </div>
                      <Link href="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors text-sm font-medium text-on-surface">
                        <MdPerson size={20} className="text-secondary" /> My Profile
                      </Link>
                      <Link href="/appointments" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors text-sm font-medium text-on-surface">
                        <MdEvent size={20} className="text-secondary" /> My Appointments
                      </Link>
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors text-sm font-medium text-on-surface">
                        <MdSettings size={20} className="text-secondary" /> Settings
                      </button>
                      <div className="h-[1px] bg-outline-variant/30 my-1" />
                      <LogoutButton />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button className="p-2 text-on-surface-variant">
              <MdNotifications size={24} />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 bg-surface-container rounded-lg text-primary"
            >
              <MdMenu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white dark:bg-slate-950 z-[70] shadow-2xl p-lg flex flex-col"
            >
              <div className="flex items-center justify-between mb-xl">
                <span className="text-xl font-bold text-primary">MedTrust</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-surface-container rounded-xl text-on-surface-variant"
                >
                  <MdClose size={24} />
                </button>
              </div>

              <div className="flex items-center gap-3 p-md bg-surface-container rounded-2xl mb-xl">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcgC8FxQdCHU3uy1ex-FNX0q3Q5Swlaqa2UrMgk6uRQKIpxN0pxR9opX_T2RRRQ5yBLAJC8f9OsdJGqKYBIY9xaL3e4K5Rp7O0w7_pKISzxUH1S2LLiOrn9ROFcKms84z7XyVy_YeE4fNUYVmnhOStC1cTVBjhJrFHqxBffOju-tpbOPw-KvbrJ-jFGXrhxVq8SePZYzDC-7g6ycXJbpkYaL12e3AfWksXt-3EZi8ccDo78516vdHlzeZLZPxgBwGFcpWCMvyAfAQs" alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-primary">Alex Johnson</p>
                  <p className="text-[11px] text-on-surface-variant">alex.j@example.com</p>
                </div>
              </div>

              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link 
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
                        isActive 
                          ? 'bg-secondary text-white shadow-lg shadow-secondary/20' 
                          : 'text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto space-y-4">
                <button className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-on-surface-variant hover:bg-surface-container-low transition-all">
                  <MdSettings size={20} /> Settings
                </button>
                <div className="h-[1px] bg-outline-variant/30" />
                <LogoutButton />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
